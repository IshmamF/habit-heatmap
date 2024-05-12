import os

from flask import Flask, jsonify, render_template
from json import JSONEncoder
from flask_cors import CORS
# from flask_bcrypt import Bcrypt
# from flask_jwt_extended import JWTManager

from bson import json_util, ObjectId
from datetime import datetime, timedelta
from app.api.endpoints import api_v1


class MongoJsonEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.strftime("%Y-%m-%d %H:%M:%S")
        if isinstance(obj, ObjectId):
            return str(obj)
        return json_util.default(obj, json_util.CANONICAL_JSON_OPTIONS)


def create_app():

    # APP_DIR = os.path.abspath(os.path.dirname(__file__))
    # STATIC_FOLDER = os.path.join(APP_DIR, 'build/static')
    # TEMPLATE_FOLDER = os.path.join(APP_DIR, 'build')

    app = Flask(__name__)
    CORS(app)
    app.json_encoder = MongoJsonEncoder
    app.register_blueprint(api_v1)
    
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        return jsonify("Welcome to the API!")

    return app