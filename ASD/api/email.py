import flask
import ASD
import math
import random
from flask_mail import Message
import boto3
from botocore.exceptions import ClientError


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


@ASD.app.route("/api/v1/")
def service():
    return flask.jsonify({"url": "/api/v1/", "email": "/api/v1/e"}), 200


@ASD.app.route("/api/v1/e/", methods=["POST"])
def email():
    if "email" in flask.session:
        return flask.jsonify({"message": "Bad Request", "status_code": 400}), 400
    user_email = flask.request.get_json()["email"]
    OTP = generateOTP()

    connection = ASD.model.get_db()
    cur = connection.execute(
        "SELECT COUNT(*) FROM users WHERE email = ?", (user_email,)
    )
    if cur.fetchone()["COUNT(*)"] == 0:
        connection.execute(
            "INSERT INTO users(email, OTP) VALUES (?,?)", (user_email, OTP)
        )
    else:
        connection.execute(
            "UPDATE users SET OTP = ? WHERE email = ?", (OTP, user_email)
        )

    msg = Message(
        "Password Reset Email", sender="wdwdawei01@163.com", recipients=[user_email]
    )
    OTP = generateOTP()
    msg.body = "One Time password: " + OTP

    # with open("log.txt", "a") as log:
    #     log.write(str(msg))
    #     log.write("\n")

    ASD.mail.send(msg)

    # # send the email with AWS SES
    # SENDER = "deluyijason@126.com"
    # RECIPIENT = flask.request.get_json()["email"]
    # AWS_REGION = "us-east-2"
    # SUBJECT = "Password Reset Email"

    # # The email body for recipients with non-HTML email clients.
    # BODY_TEXT = "One Time password: " + OTP + "\r\n"

    # # The HTML body of the email.
    # BODY_HTML = """
    # <html>
    # <head></head>
    # <body>
    # <p>One Time password: %s </p>
    # </body>
    # </html>
    # """ % (
    #     OTP
    # )

    # # The character encoding for the email.
    # CHARSET = "UTF-8"

    # # Create a new SES resource and specify a region.
    # client = boto3.client("ses", region_name=AWS_REGION)

    # # Try to send the email.
    # try:
    #     # Provide the contents of the email.
    #     response = client.send_email(
    #         Destination={
    #             "ToAddresses": [
    #                 RECIPIENT,
    #             ],
    #         },
    #         Message={
    #             "Body": {
    #                 "Html": {
    #                     "Charset": CHARSET,
    #                     "Data": BODY_HTML,
    #                 },
    #                 "Text": {
    #                     "Charset": CHARSET,
    #                     "Data": BODY_TEXT,
    #                 },
    #             },
    #             "Subject": {
    #                 "Charset": CHARSET,
    #                 "Data": SUBJECT,
    #             },
    #         },
    #         Source=SENDER,
    #     )
    # # Display an error if something goes wrong.
    # except ClientError as e:
    #     print(e.response["Error"]["Message"])
    # else:
    #     print("Email sent! Message ID:"),
    #     print(response["MessageId"])

    return flask.jsonify({"message": "OK", "status_code": 200}), 200
