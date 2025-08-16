from flask import has_request_context, request
import logging

class RequestFormatter(logging.Formatter):
    def format(self, record):
        if has_request_context():
            record.url = request.url
            record.remote_addr = request.remote_addr
        else:
            record.url = None
            record.remote_addr = None

        return super().format(record)

# # Create an instance of RequestFormatter
# formatter = RequestFormatter(
#     '[%(asctime)s] %(remote_addr)s requested %(url)s\n'
#     '%(levelname)s in %(module)s: %(message)s'
# )

# # Apply the formatter to default_handler
# default_handler.setFormatter(formatter)