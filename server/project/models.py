from datetime import datetime
from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    MetaData,
    String,
    PickleType,
    Text,
    event,
    Uuid,
    func,
)
from sqlalchemy.orm import mapped_column, relationship, DeclarativeBase
from project import db
from datetime import datetime


class Model(DeclarativeBase):
    metadata = MetaData(
        naming_convention={
            "ix": "ix_%(column_0_label)s",
            "uq": "uq_%(table_name)s_%(column_0_name)s",
            "ck": "ck_%(table_name)s_%(constraint_name)s",
            "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
            "pk": "pk_%(table_name)s",
        }
    )


class User(Model):
    """
    Class that represents a user of the application
    The following attributes of a user are stored in this table:
        * provider_id = id provided by the social login provider e.g Google
        * picture = profile picture from social login
        * provider = social login provider
        * email - email address of the user
        * registered_on - date & time that the user registered
        * refresh_token = refresh token from google
    """

    __tablename__ = "users"
    id = mapped_column(Integer, primary_key=True)
    provider_id = mapped_column(String, unique=False)
    is_admin = mapped_column(Boolean, default=False, nullable=False)
    picture = mapped_column(String, default="")
    provider = mapped_column(String, nullable=True)
    email = mapped_column(String, unique=True, nullable=False)
    refresh_token = mapped_column(String, nullable=True)
    created = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    scripts = relationship("Script", back_populates="user")
    files = relationship("File", back_populates="user")

    def __init__(
        self,
        provider_id: str,
        picture: str,
        email: str,
        provider: str,
        refresh_token: str,
    ):
        """Create a new User object using the email address"""
        self.provider_id = provider_id
        self.picture = picture
        self.email = email
        self.provider = provider
        self.refresh_token = refresh_token

    def to_dict(self):
        return {
            "registered_on": self.created,
            "is_admin": self.is_admin,
            "picture": self.picture,
            "email": self.email,
        }

    def get_user_scripts(self):
        return [script.to_data() for script in self.scripts]

    @classmethod
    def get_user_by_user_id(cls, id):
        return cls.query.filter_by(id=id).first()

    @classmethod
    def get_refresh_token_by_user_id(cls, id):
        user = cls.query.filter_by(id=id).first()

        return user.refresh_token

    @classmethod
    def update_refresh_token_by_user_id(cls, id, refresh_token):
        user = cls.query.filter_by(id=id).first()
        user.refresh_token = refresh_token

        db.session.commit()
        return user.refresh_token

    @classmethod
    def find_or_create_user(cls, user_info):
        user = cls.query.filter_by(
            provider_id=user_info["provider_id"],
            email=user_info["email"],
            provider=user_info["provider"],
        ).first()
        if not user:
            user = User(
                user_info["provider_id"],
                user_info["picture"],
                user_info["email"],
                user_info["provider"],
                user_info["refresh_token"],
            )
            db.session.add(user)
            db.session.commit()

        return user

    def __repr__(self):
        return f"<User: {self.email}>"


class Script(Model):
    """
    Class that represents a script in the application
    The following attributes of a script are stored in this table:
        * id = database id of the script
        * script_id = id provided by the application
        * filename = name of the script
        * user_id = id of the user who owns the script
        * created_on - date & time that the script was created
        * modified_on - date & time that the script was last modified

    """

    __tablename__ = "scripts"
    id = mapped_column(Integer(), primary_key=True, autoincrement=True)
    script_id = mapped_column(String(), unique=True, nullable=True)
    filename = mapped_column(String(), nullable=True)
    user_id = mapped_column(ForeignKey("users.id"))
    scenes = mapped_column(PickleType(), nullable=True)
    content = mapped_column(Text(), nullable=True)
    created = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    deleted_at = mapped_column(DateTime(timezone=True), nullable=True, default=None)

    user = relationship("User", back_populates="scripts")
    forbidden_keys = ["id", "script_id", "created_on", "user_id"]

    def __init__(
        self,
        script_id: str,
        filename: str,
        user_id: str,
        scenes: list = [],
        content: str = "",
    ):
        """Create a new Script object using the name of the script and the user_id"""
        self.script_id = script_id
        self.filename = filename
        self.user_id = user_id
        self.scenes = scenes
        self.content = content

    def to_dict(self):
        return {
            "id": self.id,
            "script_id": self.script_id,
            "filename": self.filename,
            "user_id": self.user_id,
            "scenes": self.scenes,
        }

    def to_data(self):
        return {
            "id": self.id,
            "script_id": self.script_id,
            "filename": self.filename,
            "user_id": self.user_id,
            "deleted_at": self.deleted_at,
        }

    def to_markdown(self):
        return {
            "id": self.id,
            "filename": self.filename,
            "markdown": self.content,
        }

    def to_response(self):
        return {
            "id": self.id,
            "script_id": self.script_id,
            "filename": self.filename,
            "user_id": self.user_id,
            "scenes": self.scenes,
        }

    def to_summary_dict(self):
        """Return script data without the 'scenes' field."""
        return {
            "id": self.id,
            "script_id": self.script_id,
            "filename": self.filename,
            "user_id": self.user_id,
            "modified_on": self.updated.isoformat() if self.updated else None,  # delete
            "created": self.created.isoformat() if self.created else None,
            "created_on": self.created.isoformat() if self.created else None,  # delete
            "updated": self.updated.isoformat() if self.updated else None,
            "opened_on": (
                self.updated.strftime("%Y-%m-%d %H:%M:%S") if self.updated else None
            ),  # delete
            "deleted_at": self.deleted_at.isoformat() if self.deleted_at else None,
        }

    @classmethod
    def add_script(cls, script, user_id):
        new_script = Script(**script, user_id=str(user_id))
        db.session.add(new_script)
        db.session.commit()
        return new_script

    @classmethod
    def get_script_by_script_id(cls, script_id, user_id):
        script = cls.query.filter_by(script_id=script_id, user_id=user_id).first()
        if script:
            script.opened_on = datetime.utcnow()
            db.session.commit()
        return script

    @classmethod
    def get_scripts_by_user_id(cls, user_id):
        scripts = cls.query.filter_by(user_id=user_id).all()  # , deleted_at=None
        # Use the `to_summary_dict` method to exclude scenes
        return [script.to_summary_dict() for script in scripts]

    @classmethod
    def update(cls, updated_data, script):
        for key, value in updated_data.items():
            if key not in cls.forbidden_keys:
                setattr(script, key, value)
        db.session.commit()
        return script

    @classmethod
    def delete_script_by_script_id(cls, script_id, user_id):
        script = cls.query.filter_by(script_id=script_id, user_id=user_id).first()
        if script and not script.deleted_at:
            script.deleted_at = datetime.now()
            db.session.commit()
        return script

    def __repr__(self):
        return f"<Script: {self.filename}>"


@event.listens_for(Script, "load")
def update_opened_on(instance, context):
    pass
    # print("LOADED")


# instance.opened_on = datetime.utcnow()


class File(Model):
    """
    Class that represents a file in the application
    The following attributes of a file are stored in this table:
        * id = database id of the file
        * uuid = stored in bucket
        * filename = name of the file
        * user_id = id of the user who owns the file
        * created_on - date & time that the file was created
        * modified_on - date & time that the file was last modified
    """

    __tablename__ = "files"

    id = mapped_column(Integer(), primary_key=True, autoincrement=True)
    uuid = mapped_column(Uuid(), unique=True, nullable=True)
    hash = mapped_column(String(), unique=False, nullable=True)
    filename = mapped_column(String(), nullable=True)
    mime_type = mapped_column(String(), nullable=True)
    user_id = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_on = mapped_column(DateTime(), default=datetime.now(), nullable=True)
    modified_on = mapped_column(
        DateTime(), default=datetime.now(), onupdate=datetime.now(), nullable=True
    )
    deleted_at = mapped_column(DateTime(), nullable=True)

    user = relationship("User", back_populates="files")

    def __init__(
        self, filename: str, user_id: int, uuid: str, hash: str, mime_type: str
    ):
        """Create a new File object using the name of the file and the user_id"""
        self.filename = filename
        self.user_id = user_id
        self.uuid = uuid
        self.hash = hash
        self.mime_type = mime_type
        self.created_on = datetime.now()
        self.modified_on = datetime.now()
        self.deleted_at = None

    def get_storage_path(self):
        return f"{self.user_id}/files/{self.uuid}"

    def save(self):
        """Saves the file instance to the database."""
        db.session.add(self)
        db.session.commit()

    def __repr__(self):
        return (
            f"File(id={self.uuid}, filename='{self.filename}', user_id={self.user_id})"
        )
