import flask
import ASD
import math
import random
from flask_mail import Message


def generateOTP():
    # Declare a digits variable
    # which stores all digits
    digits = "0123456789"
    OTP = ""

    # length of password can be changed
    # by changing value in range
    for i in range(6):
        OTP += digits[math.floor(random.random() * 10)]
    return OTP


@ASD.app.route('/api/v1/')
def service():
    return flask.jsonify({
        'url': '/api/v1/',
        'email': '/api/v1/e'
    }), 200


@ASD.app.route('/api/v1/e/', methods=['POST'])
def email():
    if 'email' in flask.session:
        return flask.jsonify({
            "message": "Bad Request",
            "status_code": 400
        }), 400
    user_email = flask.request.get_json()['email']
    connection = ASD.model.get_db()
    msg = Message('Password Reset Email', sender='wdwdawei01@163.com', recipients=[user_email])
    OTP = generateOTP()
    msg.body = "One Time password: " + OTP
    cur = connection.execute('SELECT COUNT(*) FROM users WHERE email = ?', (user_email,))
    if cur.fetchone()['COUNT(*)'] == 0:
        connection.execute("INSERT INTO users(email, OTP) VALUES (?,?)", (user_email, OTP))
    else:
        connection.execute("UPDATE users SET OTP = ? WHERE email = ?", (OTP, user_email))
    ASD.mail.send(msg)
    return flask.jsonify({
        "message": "OK",
        "status_code": 200
    }), 200
