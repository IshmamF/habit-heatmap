from typing import Union
from flask import Blueprint, request, jsonify
import bson
import json
from app.db import (
    addHeatMap,
    removeHeatMap,
    test_db_connection,
    addUser,
    authenticate
)

from flask_cors import CORS
# from app.api.utils import expect
from datetime import datetime

api_v1 = Blueprint("api_v1", "api_v1", url_prefix="/api/v1")

CORS(api_v1)

@api_v1.route("/ping", methods=["GET"])
def test_db():
    return jsonify(test_db_connection())

@api_v1.route("/addUser", methods=["POST"])
def add_user():
    if not request.is_json:
        return jsonify({"msg": "Not JSON request."}), 400
    userData = request.get_json()
    try:
        result = addUser(userData)
        if isinstance(result, dict) and "error" in result:
            return jsonify({"error": "User already exists."}), 400
        return jsonify({"msg": "User added successfully."}), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 400
    
@api_v1.route("/authenticate", methods=["POST"])
def authenticate_user():
    if not request.is_json:
        return jsonify({"msg": "Not JSON request."}), 400
    userData = request.get_json()
    try:
        result = authenticate(userData)
        match(result):
            case 0:
                return jsonify({"msg": "User authenticated."}), 200
            case 1:
                return jsonify({"error": "Incorrect password."}), 400
            case 2:
                return jsonify({"error": "User not found."}), 400
    except Exception as e:
        return jsonify({"msg": str(e)}), 400
    
@api_v1.route("/addHeatMap", methods=["POST"])
def add_map():
    if not request.is_json:
        return jsonify({"msg": "Not JSON request."}), 400
    req = request.get_json()
    try:
        # Add the map to the database
        addHeatMap(req)
        return jsonify({"msg": "Habits updated successfully."}), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 400

@api_v1.route("/removeHeatMap", methods=["GET"])
def remove_map():
    if not request.is_json:
        return jsonify({"msg": "Not JSON request."}), 400
    req = request.get_json()
    try:
        # Remove the map from the database
        removeHeatMap(req)
        return jsonify({"msg": "Habit removed successfully."}), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 400
    
@api_v1.route("/getHabits", methods=["GET"])
def get_habits():
    if not request.is_json:
        return jsonify({"msg": "Not JSON request."}), 400
    req = request.get_json()
    try:
        # Get the habits from the database
        getHabits(req)
        return jsonify({"msg": "Habits retrieved successfully."}), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 400