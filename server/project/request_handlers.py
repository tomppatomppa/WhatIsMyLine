from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, set_access_cookies

def request_handlers(app):
    '''
    Refresh original if JWT is about to expire within the next 30 minutes.
    '''
    @app.after_request
    def refresh_expiring_jwts(response):
        try:
            app.logger.info('refresh jwt after request')
            exp_timestamp = get_jwt()["exp"]
            now = datetime.now(timezone.utc)
            target_timestamp = datetime.timestamp(now + timedelta(hours=12))
            
            if target_timestamp > exp_timestamp:
                access_token = create_access_token(identity=get_jwt_identity())
                set_access_cookies(response, access_token)
            return response
        except (RuntimeError, KeyError):
            return response