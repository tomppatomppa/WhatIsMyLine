from flask.cli import FlaskGroup
import pytest
from project import db, models
import app

cli = FlaskGroup(app)

@cli.command("create_db")
def create_db():
    db.drop_all()
    db.create_all()
    db.session.commit()

@cli.command("seed_db")
def seed_db():
    db.session.add(models.User(email="michael@mherman.org"))
    db.session.commit()

@cli.command("run_tests")
def run_tests():
    pytest.main(["-q", "tests"])

if __name__ == "__main__":
    cli()