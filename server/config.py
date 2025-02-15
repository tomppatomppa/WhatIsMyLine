import os

BASEDIR = os.path.abspath(os.path.dirname(__file__))
GOOGLE_CREDENTIALS_PATH = os.path.join(BASEDIR, "google-credentials.json")

class Config(object):
    FLASK_ENV = 'development'
    DEBUG = False
    TESTING = False
    SECRET_KEY = os.getenv("SECRET_KEY")

    if os.getenv('DATABASE_URL'):
        SQLALCHEMY_DATABASE_URI =  os.getenv("DATABASE_URL")

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Logging
    LOG_WITH_GUNICORN = os.getenv('LOG_WITH_GUNICORN', default=False)

class ProductionConfig(Config):
    FLASK_ENV = 'production'

class DevelopmentConfig(Config):
    DEBUG = True
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
  
    WTF_CSRF_ENABLED = False
