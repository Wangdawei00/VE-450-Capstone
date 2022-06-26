import random
import uuid

import flask

import ASD
from ASD.views.accounts import hash_password


@ASD.app.route("/api/v1/r/", methods=["POST"])
def reset():
    json = flask.request.get_json()
    email = json["email"]
    otp = json["otp"]
    password_raw = json["password"]
    algorithm = "sha512"
    salt = uuid.uuid4().hex
    password_hash = hash_password(algorithm, salt, password_raw)
    password_sql = '$'.join([algorithm, salt, password_hash])
    connection = ASD.model.get_db()
    cur = connection.execute("SELECT COUNT(*) FROM users WHERE email = ?", (email,))
    if cur.fetchone()["COUNT(*)"] == 0:
        return flask.jsonify({"message": "Bad Request", "status_code": 400}), 400
    cur = connection.execute("SELECT OTP FROM users WHERE email = ?", (email,))
    if cur.fetchone()["OTP"] != otp:
        return flask.jsonify({"message": "Bad Request", "status_code": 400}), 400
    connection.execute("UPDATE users SET password = ? WHERE email = ?", (password_sql, email))
    flask.session['email'] = email
    return flask.jsonify({"message": "OK", "status_code": 200}), 200
