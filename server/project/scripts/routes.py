import io
import mimetypes
import os


# from docling.datamodel import vlm_model_specs
# from docling.datamodel.base_models import InputFormat
# from docling.document_converter import DocumentConverter, PdfFormatOption
# from docling.backend.docling_parse_backend import DoclingParseDocumentBackend
# from docling.datamodel.pipeline_options import (
#     VlmPipelineOptions,
#     PdfPipelineOptions,
# )
# from docling.pipeline.vlm_pipeline import VlmPipeline
# from docling.datamodel.base_models import InputFormat
# from docling.datamodel.pipeline_options import (
#     EasyOcrOptions,
#     OcrMacOptions,

#     TesseractCliOcrOptions,
#     TesseractOcrOptions,
# )

from project.scripts.script_manager import ScriptManager
from project.adapters.S3Client import S3Handler
from .dataclasses import ScriptUpdateDTO
from . import scripts_blueprint
from . import script_service
from flask import Response, request, make_response, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from project.models import Script
import json


@scripts_blueprint.route("/scripts", methods=["GET"])
@jwt_required()
def get_all():
    try:
        scripts = script_service.get_all(get_jwt_identity())
        result = [script.to_summary_dict() for script in scripts]
        return make_response(json.dumps(result), 200)
    except Exception as error:
        return "Not found", 404
   

@scripts_blueprint.route("/script/<script_id>", methods=["GET"])
@jwt_required()
def get_by_script_id(script_id):
    try:
        
        script = script_service.find_by_id(script_id, get_jwt_identity())
        if script.scenes: 
            return make_response(json.dumps(script.to_dict()), 200)
        
        script_manager = ScriptManager()
        test = script_manager.parse_markdown_to_json(script.content)
        return make_response(json.dumps({"id": script.id, "filename": script.filename, "scenes" : test}, indent=2, ensure_ascii=False), 200)
    except Exception as err:
        return "Not found", 400

@scripts_blueprint.route("/script", methods=["POST"])
@jwt_required()
def create():
    script = request.get_json()
    try:
        new_script = Script.add_script(script, get_jwt_identity())

        return json.dumps(new_script.to_dict()), 200
    except Exception as error:
        return str(error), 400
   

@scripts_blueprint.route("/script/<script_id>", methods=["DELETE"])
@jwt_required()
def delete(script_id):
    deleted_script = Script.delete_script_by_script_id(script_id, get_jwt_identity())

    if deleted_script:
        return f"Script {deleted_script.script_id} Deleted Succesfully", 200
    else:
        return "Error deleting script", 404

@scripts_blueprint.route("/script/<script_id>", methods=["PUT"])
@jwt_required()
def update(script_id):
    script_to_update = Script.get_script_by_script_id(script_id, get_jwt_identity())

    if not script_to_update:
        return "Error updating script", 404
 
    updated_data = request.get_json()
    updated_script = Script.update(updated_data, script_to_update)
   
    return json.dumps(updated_script.to_dict()), 200

@scripts_blueprint.route("/script/markdown-test", methods=["GET"])
def get_markdown_test():
    folder_path = os.path.abspath("uploaded_files")
   
    try:
        script_manager = ScriptManager()
        markdown = script_manager.to_markdown(f"{folder_path}/1.9.pdf", remove_backticks=True)
        return markdown, 200

    except Exception as e:
        return f"{e}", 404
    
@scripts_blueprint.route("/script/markdown-test/<id>", methods=["GET"])
@jwt_required()
def get_markdown(id):
    try:
        script = script_service.find_by_id(id, get_jwt_identity())
        if not script.content:
            script_manager = ScriptManager()
            test = script_manager.json_to_markdown(script.scenes)
            data = script.to_markdown()
            data['markdown'] = test
            return json.dumps(data), 200

        return json.dumps(script.to_markdown()), 200

    except Exception as e:
        return f"{e}", 404

@scripts_blueprint.route("/script/markdown-test", methods=["POST"])
@jwt_required()
def create_markdown():
    payload = request.get_json()
   
    try:
        user_id = get_jwt_identity()
        data = ScriptUpdateDTO(**payload)  
        if data.id:
            script = script_service.update(data, user_id)   
        else:
            script = script_service.create(data, user_id)
            
        return json.dumps(script.to_markdown()), 200

    except Exception as e:
        return f"{e}", 404
    

@scripts_blueprint.route("/script/file/<id>", methods=["GET"])
@jwt_required()
def get_original_file(id):
    try:
       
        file = script_service.find_original_file_by_uuid(uuid=id, user_id=get_jwt_identity())
       
        result = S3Handler().get_object(key=file.get_storage_path())
        file_stream = io.BytesIO(result['Body'].read())
     
        mime_type, _ = mimetypes.guess_type(file.filename)
        mime_type = mime_type or 'application/octet-stream'

        file_stream.seek(0)
        return Response(
            file_stream,
            mimetype=mime_type,
            headers={
                "Content-Disposition": f'inline; filename="{file.filename}"'
            }
        )


    except Exception as e:
        return f"{e}", 404
    

# @scripts_blueprint.route("/script/markdown-docling-test", methods=["GET"])
# def get_markdown_docling():
#     folder_path = os.path.abspath("uploaded_files")
   
#     try:
#         pipeline_options = PdfPipelineOptions()
#         pipeline_options.do_ocr = False
#         pipeline_options.do_table_structure = False
#         pipeline_options.table_structure_options.do_cell_matching = False

#         converter = DocumentConverter(
#             format_options={
#                 InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options)  # switch to beta PDF backend
#                 }
#         )
#         result = converter.convert(f"{folder_path}/1.9.pdf").document
#         text = re.sub(r"```", '', result.export_to_markdown())
#         return re.sub(r"´´´", '', text)
#         #return result.document.export_to_markdown(), 200

#     except Exception as e:
#         return f"{e}", 404
    
    
# def watsonx_vlm_options():
#     load_dotenv()
#     api_key = os.environ.get("WX_API_KEY")
#     project_id = os.environ.get("WX_PROJECT_ID")

#     def _get_iam_access_token(api_key: str) -> str:
#         res = requests.post(
#             url="https://iam.cloud.ibm.com/identity/token",
#             headers={
#                 "Content-Type": "application/x-www-form-urlencoded",
#             },
#             data=f"grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey={api_key}",
#         )
#         res.raise_for_status()
#         api_out = res.json()
#         print(f"{api_out=}")
#         return api_out["access_token"]

#     options = PictureDescriptionApiOptions(
#         url="https://us-south.ml.cloud.ibm.com/ml/v1/text/chat?version=2023-05-29",
#         params=dict(
#             model_id="ibm/granite-vision-3-2-2b",
#             project_id=project_id,
#             parameters=dict(
#                 max_new_tokens=400,
#             ),
#         ),
#         headers={
#             "Authorization": "Bearer " + _get_iam_access_token(api_key=api_key),
#         },
#         prompt="Describe the image in three sentences. Be consise and accurate.",
#         timeout=60,
#     )
#     return options