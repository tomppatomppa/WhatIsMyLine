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
