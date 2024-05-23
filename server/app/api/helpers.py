from datetime import datetime
from functools import wraps
from flask import request, jsonify
import jwt

def get_recent_habits(data):
    all_metrics = []
    for habit in data:
        for metric in habit['data']:
            metric_data = metric.copy()  
            metric_data['habitName'] = habit['habitName']
            metric_data['metric'] = habit['metric']
            all_metrics.append(metric_data)
    
    return sorted(all_metrics, key=lambda x: datetime.strptime(x['date'], "%Y/%m/%d"), reverse=True)


def get_most_recent_data(data, number=3):
    return get_recent_habits(data)[:number]

def get_most_recent_active_notes(data, number=3):
    recent_habits = get_recent_habits(data)
    return [metric for metric in recent_habits if metric['note'] != ""][:number]


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 403
        try:
            token = token.split(" ")[1]  # "Bearer <JWT>"
            data = jwt.decode(token, config["JWT"]["SECRET"], algorithms=["HS256"])
            current_user = data['user']
        except Exception as e:
            return jsonify({'message': 'Token is invalid!'}), 403
        return f(*args, **kwargs)
    return decorated