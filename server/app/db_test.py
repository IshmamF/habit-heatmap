import pytest
import mongomock
from app.db import (
    addUser,
    authenticate,
    addHeatMap,
    removeMetric,
    getHabits,
    removeHabit,
    createHeatmap,
    updateHabit,
    updateMetric,
    updateUsername,
)

@pytest.fixture
def mock_db():
    client = mongomock.MongoClient()
    db = client['test_db']
    heatmaps = db['heatmaps']
    users = db['users']
    ping = db['ping']
    yield db, users, heatmaps, ping


def test_add_user(mock_db):
    db, users, heatmaps, ping = mock_db
    user = {"username": "testuser", "password": "testpass"}
    user_id = addUser(user, users)
    assert users.find_one({"_id": user_id})

def test_duplicate_user(mock_db):
    db, users, heatmaps, ping = mock_db
    user = {"username": "testuser", "password": "testpass"}
    addUser(user, users)
    result = addUser(user, users)
    assert result == {"error": "User already exists."}

def test_authenticate_user(mock_db):
    db, users, heatmaps, ping = mock_db
    user = {"username": "testuser", "password": "testpass"}
    addUser(user, users)
    result = authenticate(user, users)
    assert result == 0

def test_authenticate_wrong_password(mock_db):
    db, users, heatmaps, ping = mock_db
    user = {"username": "testuser", "password": "testpass"}
    addUser(user, users)
    wrong_password_user = {"username": "testuser", "password": "wrongpass"}
    result = authenticate(wrong_password_user, users)
    assert result == 1

def test_authenticate_nonexistent_user(mock_db):
    db, users, heatmaps, ping = mock_db
    user = {"username": "nonexistent", "password": "testpass"}
    result = authenticate(user, users)
    assert result == 2

def test_create_heatmap(mock_db):
    db, users, heatmaps, ping = mock_db
    request = {
        "username": "testuser",
        "habitName": "Draw",
        "metric": "minutes",
        "color": "blue"
    }
    createHeatmap(request, heatmaps)
    user_data = heatmaps.find_one({"username": request['username']})
    assert user_data is not None
    assert len(user_data["habits"]) == 1
    assert user_data["habits"][0]["habitName"] == request['habitName']
    assert user_data["habits"][0]["metric"] == request['metric']
    assert user_data["habits"][0]["color"] == request['color']
    assert user_data["habits"][0]["data"] == []

def test_add_heatmap(mock_db):
    db, users, heatmaps, ping = mock_db
    createHeatmap({
        "username": "testuser",
        "habitName": "Draw",
        "metric": "minutes",
        "color": "blue"
    }, heatmaps)
    addHeatMap({
        "username": "testuser",
        "habitName": "Draw",
        "data": {"date": "2024-01-01", "value": 30}
    }, heatmaps)
    user_data = heatmaps.find_one({"username": "testuser"})
    assert user_data is not None
    assert len(user_data["habits"][0]["data"]) == 1
    assert user_data["habits"][0]["data"][0] == {"date": "2024-01-01", "value": 30}

def test_remove_metric(mock_db):
    db, users, heatmaps, ping = mock_db
    createHeatmap({
        "username": "testuser",
        "habitName": "Draw",
        "metric": "minutes",
        "color": "blue"
    }, heatmaps)
    addHeatMap({
        "username": "testuser",
        "habitName": "Draw",
        "data": {"date": "2024/01/01", "value": 30, "note": ""}
    }, heatmaps)
    removeMetric({
        "username": "testuser",
        "habitName": "Draw",
        "data": {"date": "2024/01/01", "value": 30, "note": ""}
    }, heatmaps)
    user_data = heatmaps.find_one({"username": "testuser"})
    assert user_data is not None
    assert len(user_data["habits"][0]["data"]) != 0

def test_get_habits(mock_db):
    db, users, heatmaps, ping = mock_db
    createHeatmap({
        "username": "testuser",
        "habitName": "Draw",
        "metric": "minutes",
        "color": "blue"
    }, heatmaps)
    habits = getHabits("testuser", heatmaps)
    assert "error" not in habits
    assert len(habits["habits"]) == 1
    assert habits["habits"][0]["habitName"] == "Draw"

def test_remove_habit(mock_db):
    db, users, heatmaps, ping = mock_db
    createHeatmap({
        "username": "testuser",
        "habitName": "Draw",
        "metric": "minutes",
        "color": "blue"
    }, heatmaps)
    removeHabit({
        "username": "testuser",
        "habitName": "Draw"
    }, heatmaps)
    user_data = heatmaps.find_one({"username": "testuser"})
    assert user_data is not None
    assert len(user_data["habits"]) == 0

def test_update_habit(mock_db):
    db, users, heatmaps, ping = mock_db
    createHeatmap({
        "username": "testuser",
        "habitName": "Draw",
        "metric": "minutes",
        "color": "blue"
    }, heatmaps)
    updateHabit({
        "username": "testuser",
        "habitName": "Draw",
        "newHabitName": "Sketch",
        "metric": "hours",
        "color": "red"
    }, heatmaps)
    user_data = heatmaps.find_one({"username": "testuser"})
    assert user_data is not None
    assert len(user_data["habits"]) == 1
    assert user_data["habits"][0]["habitName"] == "Sketch"
    assert user_data["habits"][0]["metric"] == "hours"
    assert user_data["habits"][0]["color"] == "red"

def test_update_metric(mock_db):
    db, users, heatmaps, ping = mock_db
    createHeatmap({
        "username": "testuser",
        "habitName": "Draw",
        "metric": "minutes",
        "color": "blue"
    }, heatmaps)
    addHeatMap({
        "username": "testuser",
        "habitName": "Draw",
        "data": {"date": "2024-01-01", "value": 30}
    }, heatmaps)
    updateMetric({
        "username": "testuser",
        "habitName": "Draw",
        "data": {"date": "2024-01-01"},
        "newValue": 60,
        "newNote": "Updated note"
    }, heatmaps)
    user_data = heatmaps.find_one({"username": "testuser"})
    assert user_data is not None
    assert len(user_data["habits"][0]["data"]) == 1
    assert user_data["habits"][0]["data"][0]["value"] == 60
    assert user_data["habits"][0]["data"][0]["note"] == "Updated note"

def test_update_username(mock_db):
    db, users, heatmaps, ping = mock_db
    createHeatmap({
        "username": "testuser",
        "habitName": "Draw",
        "metric": "minutes",
        "color": "blue"
    }, heatmaps)
    updateUsername({
        "username": "testuser",
        "newUsername": "newuser"
    }, heatmaps)
    user_data = heatmaps.find_one({"username": "newuser"})
    assert user_data is not None
    assert user_data["username"] == "newuser"
