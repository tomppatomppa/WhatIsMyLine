from functools import wraps
import os
import traceback
from flask import current_app, request

from project.FileLogger import FileLogger


def setup_logger(route="system"):
    """Initialize a logger instance with the specified route."""
    return FileLogger(route=f"{route}")

def get_logger(override=None):
    """Retrieve or create the logger dynamically based on the request path."""
    if not hasattr(current_app, "logger"):
        current_app.logger = FileLogger(route="flask_app")

    if not override:
        route = request.path.strip("/")
    else:
        route = override
    return FileLogger(route=route) 

def logger_helper(log_incoming=True, log_outgoing=True, log_errors=True):
    """Decorator to log incoming requests, outgoing responses, and errors."""
    
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if os.getenv('CONFIG_TYPE') == 'config.TestingConfig':
                return func(*args, **kwargs)

            logger = get_logger()
            user_agent = request.headers.get('User-Agent', 'Unknown')
            ip_address = request.remote_addr or 'Unknown'
            data = request.get_json(silent=True)

            if log_incoming:
                log_message = f"Incoming request: {request.method} {request.path} IP: {ip_address}, User-Agent: {user_agent}, Payload: {data}"
                logger.info(log_message)

            try:
                # Call the actual endpoint function
                response = func(*args, **kwargs)
                if isinstance(response, tuple) and len(response) == 2:
                    response_data, status_code = response
                else:
                    response_data = response  # Extract the response body as text
                    status_code = response.status_code  
                    
                if hasattr(response_data, 'get_data'):
                    data = response_data.get_data(as_text=True)
                else:
                    data = response_data

                if log_outgoing:
                    log_message = f"Outgoing response: {status_code} - {request.method} {request.path}, Response payload: {response_data.get_data(as_text=True)}"
                    logger.info(log_message)
                
                return response
            except Exception as e:
                #Handle errors: Log the error traceback if enabled
                if log_errors:
                    tb = traceback.format_exc()
                    log_message = f"Error in endpoint {request.method} {request.path}: {str(e)}\nTraceback:\n{tb}"
                    logger.error(log_message)
                raise e
        
        return wrapper
    
    return decorator
