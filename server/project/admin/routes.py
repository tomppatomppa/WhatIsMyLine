
# Endpoint to fetch log data from all log files as JSON
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from . import admin_blueprint
from project.FileLogger import FileLogger


@admin_blueprint.route('/admin/logs', methods=['GET'])
@jwt_required()
def get_logs():
    user_id = get_jwt_identity()

    if user_id != 5:
        return "Not permitted", 404
    try:
        logger = FileLogger(route="api/auth/login")
        all_log_data = logger.get_all_log_files_data()
        return jsonify(all_log_data)
    except Exception as error:
        return str(error), 404
        
   