from datetime import datetime
from sqlalchemy import text
from project.logger_helper import get_logger
from flask_apscheduler import APScheduler
from project import db

from apscheduler.events import (
    EVENT_JOB_EXECUTED,
)
DAY = 186400

SUPABASE_JOB = 'keep_supabase_connection_alive'

scheduler = APScheduler()

def init_scheduled_tasks(app):

    scheduler.init_app(app)
    scheduler.start()

    @scheduler.task('interval', id=SUPABASE_JOB, seconds=DAY * 5, misfire_grace_time=900, max_instances=1)
    def keep_supabase_database_connection_alive():
        '''
        Free version of supabase will automatically shutdown if not used for 1 week
        '''
        try: 
            with scheduler.app.app_context():
                db.session.execute(text('SELECT * FROM users LIMIT 1'))
        except Exception as e:
             print(f"Error occurred: {e}")

    def job_executed(event):
        """Job executed event."""
        with scheduler.app.app_context():
            logger = get_logger("system/jobs")
            logger.info(f'{event.job_id}') 

    scheduler.add_listener(job_executed, EVENT_JOB_EXECUTED)

    run_jobs_on_app_start()

def run_jobs_on_app_start():
    for job in scheduler.get_jobs():
       job.modify(next_run_time=datetime.now())