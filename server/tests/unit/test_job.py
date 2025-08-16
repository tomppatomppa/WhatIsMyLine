from datetime import timedelta
import threading, time, signal

from project import Job



def test_scheduled_job(new_user):
    # """
    # GIVEN a User model
    # WHEN a new User is created
    # THEN check the user_id, email, picture, provider, refresh_token, access_token, expiry
    # """
    def foo():
        print(time.ctime())
        
    WAIT_TIME_SECONDS = 1

    job = Job(interval=timedelta(seconds=WAIT_TIME_SECONDS), execute=foo)
    