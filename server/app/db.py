import os
import configparser
import bcrypt
import bson.json_util
from flask import current_app
from datetime import datetime, timedelta
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from bson.objectid import ObjectId

# Load the configuration from the ..ini file
config = configparser.ConfigParser()
# Get the absolute path to the .ini file
config_file = "./server/.ini"

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

def find_users(data):
    return users.count_documents({"email": data["email"]})


def find_user_by_email(email):
    return users.find_one({"email": email})

def register(user):
    return users.insert_one(user)


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
    username = request["username"]
    habitName = request["habitName"]
    habitData = request["data"]
    try:
        # Find the index of the habit object in the habits array
        habit_index = next((i for i, habit in enumerate(heatmaps.find_one({"username": username})["habits"]) if habit['habitName'] == habitName), None)
        
        heatmaps.find_one_and_update(
            {"username": username},
            {"$pull": {f"habits.{habit_index}.data": habitData}},
            upsert=True
        )
        return True
    except Exception as e:
        return False
    
def getHabits(username):
    try:
        habit = heatmaps.find_one({"username": username})
        if habit is None:
            return None
        return habit
    except Exception as e:
        return str(e)  # Return the exception message


def removeHabit(request):
    try:
        username = request["username"]
        habitName = request["habitName"]

        heatmaps.find_one_and_update(
            {"username": username},
            {"$pull": {"habits": {"habitName": habitName}}},
            upsert=True
        )
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
    
def updateHabit(request):
    username = request["username"]
    habitName = request["habitName"]
    newHabitName = request.get("newHabitName")
    habit_metric = request.get("metric")  
    habit_color = request.get("color") 
    try:
        # Find the index of the habit object in the habits array
        habit_index = next((i for i, habit in enumerate(heatmaps.find_one({"username": username})["habits"]) if habit['habitName'] == habitName), None)

        if habit_index is not None:
            heatmaps.find_one_and_update(
                {"username": username},
                {"$set": {f"habits.{habit_index}.metric": habit_metric, f"habits.{habit_index}.color": habit_color, f"habits.{habit_index}.habitName": newHabitName}},
                upsert=True
            )
        return True
    except Exception as e:
        return False
    
def updateMetric(request):
    username = request["username"]
    habitName = request["habitName"]
    habitData = request["data"]
    newMetric = request.get("newValue")
    newNote = request.get("newNote")
    try:
        # Find the index of the habit object in the habits array
        habit_index = next((i for i, habit in enumerate(heatmaps.find_one({"username": username})["habits"]) if habit['habitName'] == habitName), None)
        metric_index = next((i for i, metric in enumerate(heatmaps.find_one({"username": username})["habits"][habit_index]["data"]) if metric['date'] == habitData['date']), None)

        if habit_index is not None:
            heatmaps.find_one_and_update(
                {"username": username},
                {"$set": {f"habits.{habit_index}.data.{metric_index}.value": newMetric, f"habits.{habit_index}.data.{metric_index}.note": newNote}},
                upsert=True,
            )
        return True
    except Exception as e:
        return False

def updateUsername(request):
    username = request["username"]
    newUsername = request["newUsername"]
    try:
        heatmaps.find_one_and_update(
            {"username": username},
            {"$set": {"username": newUsername}},
            upsert=True
        )
        return True
    except Exception as e:
        return False
