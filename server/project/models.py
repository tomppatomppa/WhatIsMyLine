from datetime import datetime
from sqlalchemy import DateTime, Integer, String
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
        * access_token = access token to call google api
        * expiry = expiry date for access_token
    REMEMBER: Never store the plaintext password in a database!
    """
    __tablename__ = 'users'
    id = mapped_column(Integer(), primary_key=True, autoincrement=True)
    user_id = mapped_column(String(), unique=True, nullable=False)
    picture = mapped_column(String(), unique=True, nullable=True, default="")
    provider = mapped_column(String(), nullable=False)
    email = mapped_column(String(), unique=True, nullable=False)
    registered_on = mapped_column(DateTime(), nullable=False)
    refresh_token = mapped_column(String(), nullable=False)
    access_token = mapped_column(String(), nullable=True)
    expiry = mapped_column(String(), nullable=True)
    
    def __init__(self, user_id: str, picture:str, email: str, provider: str, refresh_token: str, access_token: str, expiry: str):
        """Create a new User object using the email address and hashing the
        plaintext password using Werkzeug.Security.
        """
        self.user_id = user_id
        self.picture = picture
        self.email = email
        self.provider = provider
        self.registered_on = datetime.now()
        self.refresh_token = refresh_token
        self.access_token = access_token
        self.expiry = expiry

    @classmethod
    def get_user_by_user_id(cls, user_id):
        return cls.query.filter_by(user_id=user_id).first()
    
    @classmethod
    def get_access_token_by_user_id(cls, user_id):
        user = cls.query.filter_by(user_id=user_id).first()
     
        return user.access_token
    @classmethod
    def get_access_token_expiry(cls, user_id):
        user = cls.query.filter_by(user_id=user_id).first()
     
        return user.expiry
    @classmethod
    def get_refresh_token_by_user_id(cls, user_id):
        user = cls.query.filter_by(user_id=user_id).first()
     
        return user.refresh_token
    
    @classmethod
    def update_access_token_and_expiry(cls, user_id, access_token, expiry):
        user = cls.query.filter_by(user_id=user_id).first()
        user.access_token = access_token
        user.expiry = expiry

        db.session.commit()
     
        return user.expiry
    
  
    

    def __repr__(self):
        return f'<User: {self.email}>'
