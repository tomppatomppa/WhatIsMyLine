import os
import random
import uuid
from flask.cli import FlaskGroup
import pytest
from project import db, models
import app
import click
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from uuid import uuid4
from sqlalchemy import select, func

cli = FlaskGroup(app)

engine = create_engine(
    os.getenv("DATABASE_URL"), pool_size=3, max_overflow=0, pool_pre_ping=True
)
models.Model.metadata.create_all(engine)
Session = sessionmaker(engine)

with Session() as session:
    with session.begin():
        print("START")
        # session.add(c64)

# Create an inspector
inspector = inspect(engine)

table_names = ["users", "scripts"]


@cli.command("create_db")
def create_db():
    all_tables_exist = all(
        inspector.has_table(table_name) for table_name in table_names
    )

    if not all_tables_exist:
        print("Table missing, create")
        db.create_all()
        db.session.commit()


@cli.command("seed_db")
@click.argument("number")
def seed_db(number):
    q = select(func.count(models.User.id))
    
    user_count = 0
    with Session() as session:
        user_count = session.scalar(q)
      
    users = []
    for i in range(int(number)):
        unique_id = str(uuid.uuid4())
        provider_id = random.randint(100000, 999999)
        user = models.User(
            provider_id=provider_id,
            email=f"testuser_{user_count+i}@gmail.com",
            provider="google",
            refresh_token=unique_id,
            picture="https://lh3.googleusercontent.com/a-/ALV-UjWdj8irxFp9GLSS0-3wm5_5cBtDEqCBLlLGKGVP8KUrPikdtQ=s96-c"
        )
        users.append(user)

    with Session() as session:
        session.bulk_save_objects(users)  # efficient batch insert
        session.commit()

    print(f"✅ {number} users inserted successfully!")
          
  
DUMMY_SCRIPT_CONTENT = """# SCRIPT DETAILS

*BUU-klubben 2023 
Printed by Tika Sevón Liljegren, 11 Aug 2023, 11:31
BUU-klubben 2023
Date: 2023-09-15
15807*

# 15807 INT. VÅNING 1000

*Malin har radat fram alla ingredienser till en
spökbuffet på den stora duken på golvet. ÄÄNI: Hissen
kommer. 2 BUU-barn ut (samma eller andra än tidigare i
veckan) med tyg som ska bli spökdräkter i famnen.
...

## BUSMUS 2

Jaa! Hähähähä!

LJUD: Klippande och rivande av papper."""

@cli.command("add_files_to_users")
@click.argument("num_scripts")
def seed_scripts_for_all_users(num_scripts=1000):
    q = select(models.User).where(models.User.email != "tomi.west.tw@gmail.com")
    
    users = session.scalars(q).all()
   
    for user in users:
        scripts = []
        files = []
        
        for i in range(int(num_scripts)):
          
            random_int = random.randint(100000, 999999)
            script_id =  str(uuid.uuid4())
            hash = "46e5956a4e509ee8d88e714ba68d713b3e1f97bc"
            file = models.File(
                user_id=user.id,
                filename=str(random_int),
                uuid=script_id,
                hash=hash,
                mime_type="application/pdf"
            )
            files.append(file)
            script = models.Script(
                script_id=script_id,
                filename=str(random_int),
                user_id=user.id,
                scenes=None,
                content=DUMMY_SCRIPT_CONTENT,
            )
            scripts.append(script)

        db.session.bulk_save_objects(scripts)  # efficient batch insert
        db.session.bulk_save_objects(files)
        print(f"Inserted {num_scripts} scripts for user {user.id}")

    db.session.commit()
    print("✅ All dummy scripts inserted successfully!")
@cli.command("reset_db")
def reset_db():
    db.drop_all()
    db.session.commit()


@cli.command("run_tests")
def run_tests():
    os.environ["CONFIG_TYPE"] = "config.TestingConfig"
    pytest.main(["-q", "tests"])


@cli.command("add_dummy")
def seed_db():
    db.session.add(models.User(email="michael@mherman.org"))
    db.session.commit()


if __name__ == "__main__":
    cli()
