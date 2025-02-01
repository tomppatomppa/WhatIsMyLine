from datetime import datetime, timedelta, timezone
from time import strftime
import traceback
from flask import render_template_string, request
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, set_access_cookies
from project.logger_helper import get_logger

# Helper function to format log message
def format_log_message(level, tb=None):
    """Format log message with default info for timestamp, request, and traceback."""
    timestamp = strftime('[%Y-%b-%d %H:%M]')
    remote_addr = request.remote_addr
    method = request.method
    scheme = request.scheme
    full_path = request.full_path
    
    # Create the log message base
    log_message = f"{timestamp} {remote_addr} {method} {scheme} {full_path}"

    # Include the traceback for error-level logs (if provided)
    if tb:
        log_message += f"\n{tb}"

    # Return the formatted log message
    return log_message

def request_handlers(app):
    '''
    Refresh original if JWT is about to expire within the next 30 minutes.
    '''
    @app.after_request
    def refresh_expiring_jwts(response):
        try:
            exp_timestamp = get_jwt()["exp"]
            now = datetime.now(timezone.utc)
            target_timestamp = datetime.timestamp(now + timedelta(hours=12))
            
            if target_timestamp > exp_timestamp:
                access_token = create_access_token(identity=get_jwt_identity())
                set_access_cookies(response, access_token)
            return response
        except (RuntimeError, KeyError):
            return response
        
    @app.before_request
    def before_request():
        """Ensure logger is initialized for every request."""
        logger = get_logger("system/requests")
        message = format_log_message(level="info")
        logger.info(f'{message}') 
    
    @app.errorhandler(Exception)
    def exceptions(e):
        print(e)
        logger = get_logger("system")
        tb = traceback.format_exc()
        message = format_log_message(level="critical", tb=tb)
       
        logger.critical(message)

        html_content = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>500 Internal Server Error</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    padding: 50px;
                }
                button { 
                    background-color: #007BFF;
                    color: white;
                    border: none;
                    padding: 10px 20px; 
                    font-size: 16px;
                    cursor: pointer; 
                    border-radius: 5px;
                }
                button:hover { 
                    background-color: #0056b3; 
                }
            </style>
        </head>
        <body>
            <h2>Something went wrong!</h2>
            <p>An internal server error occurred.</p>
            <button onclick="window.location.href='/'">Go to Root</button>
        </body>
        </html>
        """
    
        # Return the error page with the button
        return render_template_string(html_content), 500