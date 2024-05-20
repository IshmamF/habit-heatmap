from functools import wraps
from flask import request, jsonify
import jwt
from app.db import config

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