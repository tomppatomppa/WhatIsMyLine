from datetime import datetime
from sqlalchemy import DateTime, Integer, String, PickleType
from sqlalchemy.orm import mapped_column
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
   
    def __init__(self, user_id: str, picture:str, email: str, provider: str, refresh_token: str):
        """Create a new User object using the email address and hashing the
        plaintext password using Werkzeug.Security.
        """
        self.user_id = user_id
        self.picture = picture
        self.email = email
        self.provider = provider
        self.registered_on = datetime.now()
        self.refresh_token = refresh_token
      
    def to_dict(self):
        return {
            'user_id': self.user_id,
            'picture': self.picture,
            'email': self.email,
            
        }
    
    @classmethod
    def get_user_by_user_id(cls, user_id):
        return cls.query.filter_by(user_id=user_id).first()
    
 
    @classmethod
    def get_refresh_token_by_user_id(cls, user_id):
        user = cls.query.filter_by(user_id=user_id).first()
     
        return user.refresh_token
    
    @classmethod
    def update_refresh_token_by_user_id(cls, user_id, refresh_token):
        user = cls.query.filter_by(user_id=user_id).first()
        user.refresh_token = refresh_token

        db.session.commit()
        return user.refresh_token
    

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

        *forbidden_keys - columns that cannot be updated
    """
    __tablename__ = 'scripts'
    id = mapped_column(Integer(), primary_key=True, autoincrement=True)
    script_id = mapped_column(String(), unique=True, nullable=False)
    filename = mapped_column(String(), nullable=False)
    user_id = mapped_column(String(), nullable=False)
    scenes = mapped_column(PickleType(), nullable=True)
    created_on = mapped_column(DateTime(), nullable=False)
    modified_on = mapped_column(DateTime(), nullable=False)
    
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
    
    def to_dict(self):
      return {
          "id": self.id,
          "script_id": self.script_id,
          "filename": self.filename,
          "user_id": self.user_id,
          "scenes": self.scenes
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
        return cls.query.filter_by(user_id=user_id).all()
    
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
        if script:
            db.session.delete(script)
            db.session.commit()
        return script
    
    def __repr__(self):
        return f'<Script: {self.filename}>'