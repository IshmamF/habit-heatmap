import os
import configparser
from pymongo import MongoClient
from dotenv import load_dotenv
load_dotenv()

# Load the MongoDB URI from the .env file
# MongoURI = os.environ['MONGO_URI']
MongoURI = "mongodb+srv://habitmap:habit@habit-heatmap.zqordn7.mongodb.net/?retryWrites=true&w=majority&appName=habit-heatmap"
# Connect to the MongoDB database
client = MongoClient(MongoURI)
db = client.get_database("prod")

# Test the database connection to ensure api endpoints and database works
def test_db_connection(ping):
    try:
        ping.insert_one({"ping": "1"})
        ping.delete_one({"ping": "1"})
        return "Pong. The database is successfully connected."
    except Exception as e:
        return f"Error connecting to the database: {e}"

# Find a specific user in the database
def find_users(data):
    users = users_db()
    return users.count_documents({"email": data["email"]})

# Finds a specific user by their email
def find_user_by_email(email):
    users = users_db()
    return users.find_one({"email": email})

def register(user):
    users = users_db()
    return users.insert_one(user)

def heatmap_db():
    return db.get_collection("heatmaps")

def users_db():
    users = db.get_collection("users")
    users.create_index("username", unique=True)
    return users

def ping_db():
    return db.get_collection("ping")
    
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