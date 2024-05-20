from flask import Blueprint, config, jsonify, request
import bcrypt
import jwt
from datetime import datetime, timedelta
from .helpers import token_required
from flask_cors import CORS
from datetime import datetime
from app.db import (
    config,
    addHeatMap,
    find_user_by_email,
    find_users,
    register,
    removeMetric,
    test_db_connection,
    getHabits,
    createHeatmap,
    removeHabit,
    updateHabit,
    updateMetric,
    updateUsername,
)

secret = config["JWT"]["SECRET"]
print(secret)
salt = bcrypt.gensalt()


api_v1 = Blueprint("api_v1", "api_v1", url_prefix="/api/v1")

CORS(api_v1)


@api_v1.route("/ping", methods=["GET"])
@token_required
def test_db():
    return jsonify(test_db_connection())


@api_v1.route("/register", methods=["POST"])
def save_user():
    message = ""
    code = 500
    status = "fail"
    try:
        data = request.get_json()
        check = find_users(data)
        if check >= 1:
            message = "User with that email already exists."
            code = 400
        else:
            salt = bcrypt.gensalt()
            data["password"] = bcrypt.hashpw(
                data["password"].encode("utf-8"), salt
            ).decode("utf-8")
            data["created_at"] = datetime.now()
            res = register(data)
            if res.acknowledged:
                message = "User registered successfully."
                code = 201
                status = "success"
    except Exception as e:
        message = str(e)
        status = "fail"
    return jsonify({"status": status, "message": message}), code


@api_v1.route("/login", methods=["POST"])
def login():
    message = ""
    code = 500
    status = "fail"
    res_data = {}
    try:
        data = request.get_json()
        user = find_user_by_email(data["email"])
        if user:
            user["_id"] = str(user["_id"])
            if bcrypt.checkpw(
                data["password"].encode("utf-8"), user["password"].encode("utf-8")
            ):
                token = jwt.encode(
                    {
                        "user": {
                            "email": user["email"],
                            "id": user["_id"],
                        },
                        "exp": datetime.now() + timedelta(hours=24),
                    },
                    secret,
                    algorithm="HS256",
                )
                del user["password"]
                message = "User logged in successfully."
                code = 200
                status = "success"
                res_data["token"] = token
                res_data["user"] = user
            else:
                message = "Invalid credentials."
                code = 401
        else:
            message = "User not found."
            code = 404
    except Exception as e:
        message = str(e)
        status = "fail"
    return jsonify({"status": status, "message": message, "data": res_data}), code


@api_v1.route("/removeHabit", methods=["POST"])
@token_required
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
        return jsonify({"msg": "Habits retrieved successfully.", "result": habits}), 200
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
