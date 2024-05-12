from typing import Union
from flask import Blueprint, request, jsonify
import bson
import json
from app.db import (
    test_db_connection,
)

from flask_cors import CORS
# from app.api.utils import expect
from datetime import datetime

api_v1 = Blueprint("api_v1", "api_v1", url_prefix="/api/v1")

CORS(api_v1)

@api_v1.route("/test_db_connection", methods=["GET"])
def test_db():
    return test_db_connection()
