import os
from project import create_app

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
SECRET_KEY = os.getenv("SECRET_KEY")

app = create_app()
app.secret_key = SECRET_KEY

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"


if __name__ == '__main__':
  app.run(debug=True)