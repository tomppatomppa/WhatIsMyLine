from datetime import datetime

from flask_login import UserMixin, LoginManager
from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import mapped_column, relationship
from werkzeug.security import check_password_hash, generate_password_hash
from flask_dance.consumer.storage.sqla import OAuthConsumerMixin

from project import db


class User(UserMixin, db.Model):
    """
    Class that represents a user of the application
    The following attributes of a user are stored in this table:
        * user_id = id provided by the social login provider e.g Google
        * email - email address of the user
        * hashed password - hashed password (using werkzeug.security)
        * registered_on - date & time that the user registered
    REMEMBER: Never store the plaintext password in a database!
    """
    __tablename__ = 'users'
    id = mapped_column(Integer(), primary_key=True, autoincrement=True)
    user_id = mapped_column(String(), unique=True, nullable=False)
    provider = mapped_column(String(), nullable=False)
    email = mapped_column(String(), unique=True, nullable=False)
    password_hashed = mapped_column(String(128), nullable=False)
    registered_on = mapped_column(DateTime(), nullable=False)
    
    def __init__(self, user_id: str, email: str, password_plaintext: str, provider: str):
        """Create a new User object using the email address and hashing the
        plaintext password using Werkzeug.Security.
        """
        self.user_id = user_id
        self.email = email
        self.password_hashed = self._generate_password_hash(password_plaintext)
        self.provider = provider
        self.registered_on = datetime.now()

    def is_password_correct(self, password_plaintext: str):
        return check_password_hash(self.password_hashed, password_plaintext)
    def set_password(self, password_plaintext: str):
        self.password_hashed = self._generate_password_hash(password_plaintext)
        
    @staticmethod
    def _generate_password_hash(password_plaintext):
        return generate_password_hash(password_plaintext)
    
    def __repr__(self):
        return f'<User: {self.email}>'
