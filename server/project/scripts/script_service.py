from typing import List
from sqlalchemy import select, update
from project import db
from manage import Session
from project.models import Script, File
from . import dataclasses


def get_all(user_id: int) -> List:  # type: ignore
    q = select(Script).where(Script.user_id == user_id, Script.deleted_at == None)
    with Session() as session:
        result = session.scalars(q).all()
        return result


def create(data: dataclasses.ScriptUpdateDTO, user_id: int) -> Script:
    script = Script(
        filename=data.filename,
        script_id=data.script_id,
        content=data.markdown,
        user_id=user_id,
    )
    with Session() as session:
        session.add(script)
        session.commit()
        session.refresh(script)
        return script
    
#Old style script
def create_deprecated(data: dataclasses.ScriptUpdateDTO, user_id: int) -> Script:
    script = Script(
        filename=data.filename,
        script_id=None,
        scenes=data.markdown,
        user_id=user_id,
    )
    with Session() as session:
        session.add(script)
        session.commit()
        session.refresh(script)
        return script



def update(data: dataclasses.ScriptUpdateDTO, user_id: int) -> Script | None:
    q = select(Script).where(
        Script.id == data.id, Script.user_id == user_id, Script.deleted_at == None
    )

    with Session() as session:
        script = session.scalar(q)
        if not script:
            return None

        script.content = data.markdown
        script.filename = data.filename
        session.commit()
        session.refresh(script)
        return script


def find_by_id(id: int, user_id: int) -> Script:
    q = select(Script).where(
        Script.id == id, Script.user_id == user_id, Script.deleted_at == None
    )
    with Session() as session:
        result = session.scalars(q).one_or_none()
        return result


def find_by_uuid(uuid: str, user_id: int) -> Script:
    q = select(Script).where(
        Script.script_id == uuid, Script.user_id == user_id, Script.deleted_at == None
    )
    with Session() as session:
        result = session.scalars(q).one_or_none()
        return result

def find_original_file_by_uuid(uuid: str, user_id: int) -> Script:
    q = select(File).where(File.uuid==uuid, File.deleted_at==None)
    with Session() as session:
       result = session.scalars(q).one_or_none()
       return result
