import os
import configparser
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError

def heatmap_db():
    config = configparser.ConfigParser()
    config_file = os.path.join(os.path.dirname(__file__), "config.ini")
    config.read(config_file)
    client = MongoClient(config["PROD"]["DB_URI"])
    db = client.get_database("prod")
    return db.get_collection("heatmaps")

def users_db():
    config = configparser.ConfigParser()
    config_file = os.path.join(os.path.dirname(__file__), "config.ini")
    config.read(config_file)
    client = MongoClient(config["PROD"]["DB_URI"])
    db = client.get_database("prod")
    users = db.get_collection("users")
    users.create_index("username", unique=True)
    return users

def ping_db():
    config = configparser.ConfigParser()
    config_file = os.path.join(os.path.dirname(__file__), "config.ini")
    config.read(config_file)
    client = MongoClient(config["PROD"]["DB_URI"])
    db = client.get_database("prod")
    return db.get_collection("ping")

# Test the database connection:
def test_db_connection(ping):
    try:
        ping.insert_one({"ping": "1"})
        ping.delete_one({"ping": "1"})
        return "Pong. The database is successfully connected."
    except Exception as e:
        return f"Error connecting to the database: {e}"

def addUser(user, users):
    try:
        return users.insert_one(user).inserted_id
    except DuplicateKeyError:
        return {"error": "User already exists."}
    
def authenticate(user, users):
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

def addHeatMap(request, heatmaps):
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
    
def removeMetric(request, heatmaps):
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
    
def getHabits(username, heatmaps):
    try:
        result = heatmaps.find_one({"username": username})
        if result is None:
            return {"error": "User not found."}
        return {"habits": result["habits"]}
    except Exception as e:
        raise Exception(f"An error occurred: {e}")

def removeHabit(request, heatmaps):
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
    
def createHeatmap(request, heatmaps): 
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
    
def updateHabit(request, heatmaps):
    try:
        username = request["username"]
        habitName = request["habitName"]
        newHabitName = request.get("newHabitName")
        habit_metric = request.get("metric")  
        habit_color = request.get("color") 

        # Find the index of the habit object in the habits array
        habit_index = next((i for i, habit in enumerate(heatmaps.find_one({"username": username})["habits"]) if habit['habitName'] == habitName), None)

        if habit_index is not None:
            heatmaps.find_one_and_update(
                {"username": username},
                {"$set": {f"habits.{habit_index}.metric": habit_metric, f"habits.{habit_index}.color": habit_color, f"habits.{habit_index}.habitName": newHabitName}},
                upsert=True
            )
    except Exception as e:
        raise Exception(f"An error occurred: {e}")
    
def updateMetric(request, heatmaps):
    try:
        username = request["username"]
        habitName = request["habitName"]
        habitData = request["data"]
        newMetric = request.get("newValue")
        newNote = request.get("newNote")

        # Find the index of the habit object in the habits array
        habit_index = next((i for i, habit in enumerate(heatmaps.find_one({"username": username})["habits"]) if habit['habitName'] == habitName), None)
        metric_index = next((i for i, metric in enumerate(heatmaps.find_one({"username": username})["habits"][habit_index]["data"]) if metric['date'] == habitData['date']), None)

        if habit_index is not None:
            heatmaps.find_one_and_update(
                {"username": username},
                {"$set": {f"habits.{habit_index}.data.{metric_index}.value": newMetric, f"habits.{habit_index}.data.{metric_index}.note": newNote}},
                upsert=True,
            )
    except Exception as e:
        raise Exception(f"An error occurred: {e}")

def updateUsername(request, heatmaps):
    try:
        username = request["username"]
        newUsername = request["newUsername"]

        heatmaps.find_one_and_update(
            {"username": username},
            {"$set": {"username": newUsername}},
            upsert=True
        )
    except Exception as e:
        raise Exception(f"An error occurred: {e}")
