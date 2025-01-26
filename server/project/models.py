from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, Integer, String, PickleType
from sqlalchemy.orm import mapped_column, relationship, joinedload
from project import db
from datetime import datetime

class User(db.Model):
    """
    Class that represents a user of the application
    The following attributes of a user are stored in this table:
        * user_id = id provided by the social login provider e.g Google
        * picture = profile picture from social login
        * provider = social login provider
        * email - email address of the user
        * registered_on - date & time that the user registered
        * refresh_token = refresh token from google
    """
    __tablename__ = 'users'
    id = mapped_column(Integer(), primary_key=True, autoincrement=True)
    user_id = mapped_column(String(), unique=True, nullable=False)
    picture = mapped_column(String(), unique=True, nullable=True, default="")
    provider = mapped_column(String(), nullable=False)
    email = mapped_column(String(), unique=True, nullable=False)
    registered_on = mapped_column(DateTime(), nullable=False)
    refresh_token = mapped_column(String(), nullable=False)
   
    scripts = relationship("Script", back_populates="user")
   
    def __init__(self, user_id: str, picture:str, email: str, provider: str, refresh_token: str):
        """Create a new User object using the email address
        """
        self.user_id = user_id
        self.picture = picture
        self.email = email
        self.provider = provider
        self.registered_on = datetime.now()
        self.refresh_token = refresh_token
      
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'picture': self.picture,
            'email': self.email,   
        }
    
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
        user = cls.query.filter_by(user_id=user_info["user_id"],
                                        email=user_info["email"],
                                        provider=user_info["provider"]
                                        ).first()
        if not user:
            user = User(user_info["user_id"],
                        user_info["picture"],
                        user_info["email"],
                        user_info["provider"],
                        user_info["refresh_token"],
                        )
            db.session.add(user)
            db.session.commit()
    
        return user
    
    @classmethod
    def get_logged_in_user_data(cls, id: str):
        """
        Get the data of the logged-in user by their user_id.
        This includes user data and their associated scripts.

        :param session: The SQLAlchemy session
        :param user_id: The unique identifier of the logged-in user
        :return: The user data and associated scripts
        """
        user = cls.query.filter_by(id=id).first()
        if not user:
            return None

        user_data = {
            "id": user.id,
            "picture": user.picture,
            "email": user.email,
            "registered_on": user.registered_on,
            "scripts": [script.to_data() for script in user.scripts]
        }

        return user_data
       
    def __repr__(self):
        return f'<User: {self.email}>'

class Script(db.Model):
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
    
    __tablename__ = 'scripts'
    id = mapped_column(Integer(), primary_key=True, autoincrement=True)
    script_id = mapped_column(String(), unique=True, nullable=False)
    filename = mapped_column(String(), nullable=False)
    user_id = mapped_column(ForeignKey("users.id"))
    scenes = mapped_column(PickleType(), nullable=True)
    created_on = mapped_column(DateTime(), nullable=False)
    modified_on = mapped_column(DateTime(), nullable=False)
    deleted_at = mapped_column(DateTime(), nullable=True)

    user = relationship("User", back_populates="scripts")
    forbidden_keys = ['id', 'script_id', "created_on", "user_id"]

    def __init__(self,script_id: str, filename: str, user_id: str, scenes: list = []):
        """Create a new Script object using the name of the script and the user_id
        """
        self.script_id = script_id
        self.filename = filename
        self.user_id = user_id
        self.scenes = scenes
        self.created_on = datetime.now()
        self.modified_on = datetime.now()
        self.deleted_at = None
    
    def to_dict(self):
      return {
          "id": self.id,
          "script_id": self.script_id,
          "filename": self.filename,
          "user_id": self.user_id,
          "scenes": self.scenes
      }
    def to_data(self):
        return {
          "id": self.id,
          "script_id": self.script_id,
          "filename": self.filename,
          "user_id": self.user_id,
          "created_on": self.created_on,
          "modified_on": self.modified_on,
          "deleted_at": self.deleted_at
        }
    def to_response(self):
        return {
          "id": self.id,
          "script_id": self.script_id,
          "filename": self.filename,
          "user_id": self.user_id,
          "scenes": self.scenes
        }

    def to_summary_dict(self):
       """Return script data without the 'scenes' field."""
       return {
           "id": self.id,
           "script_id": self.script_id,
           "filename": self.filename,
           "user_id": self.user_id
       }
       
    @classmethod
    def add_script(cls, script, user_id):
        new_script = Script(**script, user_id=user_id)
        db.session.add(new_script)
        db.session.commit()
        return new_script   
    
    @classmethod
    def get_script_by_script_id(cls, script_id, user_id):
        return cls.query.filter_by(script_id=script_id, user_id=user_id).first()
    
    @classmethod
    def get_scripts_by_user_id(cls, user_id):
        scripts = cls.query.filter_by(user_id=user_id, deleted_at=None).all()
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
        return f'<Script: {self.filename}>'