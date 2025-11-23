import datetime
from os import getenv
from flask import (Blueprint, jsonify, request, session)
from ..db.db import (get_db, close_db)
import jwt
from werkzeug.security import check_password_hash, generate_password_hash
auth_bp = Blueprint('auth',__name__,)

""" 
fetch("http://127.0.0.1:5000/register",
{
method: "POST",
headers: {"Content-type": "application/json",},
body: JSON.stringify(
    {
        username: "usernamo",
        password: "1Password!",
        email: "email@email.com"
    })
}).then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error("Fetch error:", error);
  });
  
  A route to register an user
"""

@auth_bp.route('/register', methods=['POST'])
def registeruser():
    data = request.get_json()
    if(email_in_use(data['email'])):
        return jsonify({"message":"email in use"}) , 409
    else:
        if data['username'] and data['password'] and data['email']:
            db_con = get_db()
            db_cursor = db_con.cursor()
            db_cursor.execute("INSERT INTO user (username, password, email, type) VALUES (?, ?, ?, 'USER')", (data['username'], generate_password_hash(data['password']), data['email']))
            db_con.commit()
            new_user_id = db_cursor.lastrowid
            print(new_user_id)
            close_db()
            return jsonify(
                {
                "id": int(new_user_id),
                }
                ), 201
        else:
            return jsonify({"message": "username, password or email empty"}), 401
"""
fetch("http://127.0.0.1:5000/login",
{
method: "POST",
headers: {"Content-type": "application/json",},
body: JSON.stringify(
    {
        password: "1Password!",
        email: "email@email.com"
    })
}).then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error("Fetch error:", error);
  });
  A route to login, the frontend should receive a jwt
"""
@auth_bp.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    if data['email'] and data['password']:
        user = get_user(data['email'])
        if not user or not check_password_hash(user.get('password'),data['password']):
            return jsonify({"message": "Incorrect credentials"}) , 401
        else:
            jwt_payload = {'id': user.get('id'),
                           'username': user.get('username'),
                           'email': user.get('email'),
                           'type': user.get('type'),
                           'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=15)
                           }
            user_token = jwt.encode(jwt_payload,getenv("JWT_SECRET_KEY"),"HS256")
            return jsonify({"token": user_token}), 200


@auth_bp.route('/test', methods=['POST'])
def test_token():
    data = request.headers
    return jsonify({"isAuthorized": is_user_authorized(data['Auth'],"USER")}), 200


# Helper methods
"""
Checks if the email is in the db
"""
def email_in_use(email_to_check):
    db_con = get_db()
    db_cursor = db_con.cursor()
    db_cursor.execute(f'SELECT COUNT(*) FROM user WHERE email LIKE "{email_to_check}" ' )
    email_exists = bool(dict(db_cursor.fetchone()).get('COUNT(*)'))
    close_db()
    return email_exists

"""
Get a user from their email
"""
def get_user(email):
    db_con=get_db()
    db_cursor = db_con.cursor()
    db_cursor.execute("SELECT * FROM user WHERE email LIKE ?",(email,))
    row = db_cursor.fetchone()
    close_db()
    if row is not None:
        return dict(row)
    else:
        return 0

"""
Decodes a jwt token returning who the user is
"""
def decode_user_token(token):
    return jwt.decode(token,getenv("JWT_SECRET_KEY"),"HS256",options={"require":["exp"],"verify_exp": True})


def is_user_authorized(token, user_type):
    try:
        user = jwt.decode(token,getenv("JWT_SECRET_KEY"),"HS256",options={"require":["exp"],"verify_exp": True})

        if user.get('type') == user_type and get_user(user.get('email')): #Check that the type is correct and the user is in the db, just to make it really secure
            return True
        else: 
            return False
    except:
        return False