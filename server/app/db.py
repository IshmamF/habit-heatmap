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
db = client.get_database("sample_mflix")
comments = db.get_collection("comments")


# Test the database connection:
def test_db_connection():
    try:
        test_person = comments.find_one({"name": "Mercedes Tyler"})
        if test_person:
            return "The database is successfully connected"
        # return "The database is successfully connected"
    except Exception as e:
        return f"Error connecting to the database: {e}"
