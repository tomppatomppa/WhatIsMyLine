import os
from flask.cli import FlaskGroup
import pytest
from project import db, models
import app
from sqlalchemy import create_engine, inspect
cli = FlaskGroup(app)

engine = create_engine(os.getenv('DATABASE_URL'))

# Create an inspector
inspector = inspect(engine)

table_names = ["users", "scripts"]

@cli.command("create_db")
def create_db():
    all_tables_exist = all(inspector.has_table(table_name) for table_name in table_names)
   
    if not all_tables_exist:
       print("Table missing, create")
       db.create_all()
       db.session.commit()

@cli.command("seed_db")
def seed_db():
    db.session.add(models.User(email="michael@mherman.org"))
    db.session.commit()

@cli.command("reset_db")
def reset_db():
    db.drop_all()
    db.session.commit()


@cli.command("run_tests")
def run_tests():
    os.environ['CONFIG_TYPE'] = 'config.TestingConfig'
    pytest.main(["-q", "tests"])

if __name__ == "__main__":
    cli()