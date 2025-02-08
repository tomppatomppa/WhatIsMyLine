
from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

from project.models import User
from . import admin_blueprint
from project.FileLogger import FileLogger


def admin_required(func):
    @wraps(func)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user = User.get_user_by_user_id(get_jwt_identity())
        if not user or not user.is_admin:
            return "Insufficient permission", 403
        return func(*args, **kwargs)
    return wrapper

@admin_blueprint.route('/admin/logs', methods=['GET'])
@admin_required
def get_logs():
    try:
        logger = FileLogger()
        all_log_data = logger.get_all_log_files_data()
        return jsonify(all_log_data)
    except Exception as error:
        return str(error), 404
        
   