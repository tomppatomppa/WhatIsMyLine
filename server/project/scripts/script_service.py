
from project import db
from project.models import Script

def create(script: dict) -> Script:
    script = Script(
            script_id=None,
            scenes=[],
            filename='',
            content=script.get('markdown'),
            user_id=script.get('user_id')   
        )
       
    db.session.add(script)
    db.session.commit()
    return script

def update(data: dict) -> Script:
    script = Script.query.filter_by(id=data.get("id")).first()
    if script:
        script.content = data.get('markdown')
    db.session.commit()
    return script

def find_by_id(id: int) -> Script:
    user = Script.query.filter_by(id=id).first()
    return user