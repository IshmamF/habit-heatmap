from datetime import datetime
from typing import Union
import bson
import os
import configparser
import bson.json_util
import pymongo
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError, OperationFailure
from bson.objectid import ObjectId
from bson.errors import InvalidId
from flask import make_response, request, flash, jsonify
import re

# Load the configuration from the ..ini file
config = configparser.ConfigParser()
config.read(".ini")

client = MongoClient(config["PROD"]["DB_URI"])
db = client.get_database("prod")
users = db.get_collection("users")
users.create_index("username", unique=True)
ping = db.get_collection("ping")
heatmaps = db.get_collection("heatmaps")


# Test the database connection:
def test_db_connection():
    try:
        ping.insert_one({"ping": "1"})
        ping.delete_one({"ping": "1"})
        return "Pong. The database is successfully connected."
    except Exception as e:
        return f"Error connecting to the database: {e}"

def addUser(user):
    try:
        return users.insert_one(user).inserted_id
    except DuplicateKeyError:
        return {"error": "User already exists."}
    
def authenticate(user):
    username = user["username"]
    password = user["password"]
    try:
        result = users.find_one({"username": username})
        if result:
            # check if the passwords and username matches up
            if result["username"] == username and result["password"] == password:
                return 0
            else:
                return 1
        else:
            return 2
    except Exception as e:
        raise Exception(f"An error occurred: {e}")

def addHeatMap(request):
    try:
        username = request["username"]
        habitName = request["habitName"]
        habitData = request["habitData"]
        heatmaps.find_one_and_update(
            {"username": username},
            {"$push": {f"habits.{habitName}.data": habitData}},
            upsert=True
        )
    except Exception as e:
        raise Exception(f"An error occurred: {e}")
    
def removeHeatMap(request):
    try:
        username = request["username"]
        habitName = request["habitName"]
        habitData = request["habitData"]
        heatmaps.find_one_and_update(
            {"username": username},
            {"$pull": {f"habits.{habitName}.data": habitData}}
        )
    except Exception as e:
        raise Exception(f"An error occurred: {e}")
    
def getHabits(username):
    try:
        result = heatmaps.find_one({"username": username})
        if result is None:
            return {"error": "User not found."}
        return {"habits": result["habits"]}
    except Exception as e:
        raise Exception(f"An error occurred: {e}")