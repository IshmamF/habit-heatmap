from flask import Flask, request, jsonify
from User import db, User

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

@app.route("/", methods=['GET'])
def index():
    return jsonify({'message': 'Hello, World!'})


@app.route('/create_user', methods=['POST'])
def create_user():
    name = request.json.get('name')
    email = request.json.get('email')

    if not name or not email:
        return jsonify({'error': 'Name and email are required'}), 400

    new_user = User(name=name, email=email)
    db.session.add(new_user)

    try:
        db.session.commit()
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
