from typing import Union
from flask import Blueprint, request, jsonify
from bson import ObjectId
import jwt
from datetime import datetime, timedelta
from app.factory import bcrypt
import json
from app.db import (
    addHeatMap,
    removeMetric,
    test_db_connection,
    addUser,
    authenticate,
    getHabits,
    createHeatmap,
    removeHabit,
    updateHabit,
    updateMetric,
    updateUsername
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
    
@api_v1.route("/addMetric", methods=["POST"])
def add_metric():
    if not request.is_json:
        return jsonify({"msg": "Not JSON request."}), 400
    req = request.get_json()
    try:
        # Add the map to the database
        addHeatMap(req)
        return jsonify({"msg": "Data added to Habit successfully."}), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 400
    
@api_v1.route("/createHabit", methods=["POST"])
def add_habit():
    if not request.is_json:
        return jsonify({"msg": "Not JSON request."}), 400
    req = request.get_json()
    try:
        createHeatmap(req)
        return jsonify({"msg": "Habit created successfully."}), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 400    

@api_v1.route("/removeMetric", methods=["POST"])
def remove_metric():
    if not request.is_json:
        return jsonify({"msg": "Not JSON request."}), 400
    req = request.get_json()
    try:
        # Remove the metric from the database
        removeMetric(req)
        return jsonify({"msg": "Metric removed successfully."}), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 400
    
@api_v1.route("/removeHabit", methods=["POST"])
def remove_habit():
    if not request.is_json:
        return jsonify({"msg": "Not JSON request."}), 400
    req = request.get_json()
    try:
        # Remove the habit from the database
        removeHabit(req)
        return jsonify({"msg": "habit removed successfully."}), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 400
    
@api_v1.route("/getHabits", methods=["POST"])
def get_habits():
    if not request.is_json:
        return jsonify({"msg": "Not JSON request."}), 400
    req = request.get_json()
    try:
        # Get the habits from the database
        habits = getHabits(req.get("username"))
        return jsonify({"msg": "Habits retrieved successfully.", "result":habits}), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 400
    
@api_v1.route("/updateHabit", methods=["POST"])
def update_habit():
    if not request.is_json:
        return jsonify({"msg": "Not JSON request."}), 400
    req = request.get_json()
    try:
        # Update the habit in the database
        updateHabit(req)
        return jsonify({"msg": "Habit updated successfully."}), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 400
    
@api_v1.route("/updateMetric", methods=["POST"])
def update_metric():
    if not request.is_json:
        return jsonify({"msg": "Not JSON request."}), 400
    req = request.get_json()
    try:
        # Update the metric in the database
        updateMetric(req)
        return jsonify({"msg": "Metric updated successfully."}), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 400
    
@api_v1.route("/updateUsername", methods=["POST"])
def update_username():
    if not request.is_json:
        return jsonify({"msg": "Not JSON request."}), 400
    req = request.get_json()
    try:
        # Update the username in the database
        updateUsername(req)
        return jsonify({"msg": "Username updated successfully."}), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 400