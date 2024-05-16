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
# Get the absolute path to the .ini file
config_file = os.path.join(os.path.dirname(__file__), ".ini")

# Print the current working directory for debugging
print(f"Current working directory: {os.getcwd()}")
print(f"Configuration file path: {config_file}")

config.read(config_file)

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
        habitData = request["data"]

        # Find the index of the habit object in the habits array
        habit_index = next((i for i, habit in enumerate(heatmaps.find_one({"username": username})["habits"]) if habit['habitName'] == habitName), None)

        if habit_index is not None:
            heatmaps.find_one_and_update(
                {"username": username},
                {"$push": {f"habits.{habit_index}.data": habitData}},
                upsert=True
            )
    except Exception as e:
        raise Exception(f"An error occurred: {e}")
    
def removeMetric(request):
    try:
        username = request["username"]
        habitName = request["habitName"]
        habitData = request["data"]

        # Find the index of the habit object in the habits array
        habit_index = next((i for i, habit in enumerate(heatmaps.find_one({"username": username})["habits"]) if habit['habitName'] == habitName), None)
        
        heatmaps.find_one_and_update(
            {"username": username},
            {"$pull": {f"habits.{habit_index}.data": habitData}},
            upsert=True
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
    
def createHeatmap(request): 
    try:
        username = request["username"]
        habitName = request["habitName"]
        habit_metric = request.get("metric")  
        habit_color = request.get("color") 

        new_habit = {
            "habitName": habitName,
            "data": [],
            "metric": habit_metric,
            "color": habit_color
        } 

        heatmaps.find_one_and_update(
            {"username": username},
            {"$push": {f"habits": new_habit}},
            upsert=True
        )
    except Exception as e:
        raise Exception(f"An error occurred: {e}") 