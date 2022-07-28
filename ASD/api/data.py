import flask
# import logging
import ASD
import numpy as np
from classification.helper import test_one_user
# from classification.readdata import split_data


def split_data(diction):
    d_flipped = diction['flipped'].split(" ")
    d_flipped = [int(i) for i in d_flipped]
    ten_arr = np.array(d_flipped)
    xdata = diction['xdata'].split(" ")
    xdata = [float(i) for i in xdata]
    xdata = np.array(xdata)
    return ten_arr, xdata


@ASD.app.route("/api/v1/d/", methods=["POST"])
def data():
    email = "email"
    if email not in flask.session:
        return flask.jsonify({"message": "Bad Request", "status_code": 400}), 400
    json = flask.request.get_json()
    x_list = json["x_data"]
    for i, item in enumerate(x_list):
        x_list[i] = str(x_list[i])
    y_list = json["y_data"]
    for i, item in enumerate(y_list):
        y_list[i] = str(y_list[i])
    name = json["name"]
    flipped_list = json['flipped_list']
    for i, item in enumerate(flipped_list):
        flipped_list[i] = str(item)
    t = json["type"]
    classify = json["classify"]
    x_to_sql = " ".join(x_list)
    y_to_sql = " ".join(y_list)
    flipped = " ".join(flipped_list)
    connection = ASD.model.get_db()
    cur = connection.execute("SELECT COUNT(*) FROM data WHERE owner = ?", (name,))
    if cur.fetchone()["COUNT(*)"] == 0:
        connection.execute(
            "INSERT INTO data(owner, class, xdata, ydata, type, flipped) VALUES (?,?,?,?,?,?)",
            (name, classify, x_to_sql, y_to_sql, t, flipped),
        )
    else:
        connection.execute(
            "UPDATE data SET class = ?, xdata = ?, ydata = ?, type = ?, flipped = ? WHERE owner = ?",
            (classify, x_to_sql, y_to_sql, t, name, flipped),
        )

    return flask.jsonify({"message": "OK", "status_code": 200}), 200


@ASD.app.route('/api/v1/r/', methods=['POST'])
def result():
    email = "email"
    if email not in flask.session:
        return flask.jsonify({"message": "Bad Request", "status_code": 400}), 400
    name = flask.request.get_json()['name']
    # return flask.jsonify({"name": name}),200
    connection = ASD.model.get_db()
    # cur = connection.execute('SELECT COUNT(*) FROM data WHERE owner = ?', (name,))
    # if cur.fetchone()['COUNT(*)'] == 0:
    cur = connection.execute("SELECT * FROM data WHERE owner = ?", (name,))
    diction = cur.fetchone()
    # ASD.app.logger.debug('test')
    if diction:
        ten_arr, xdata = split_data(diction)
        prediction = test_one_user(ten_arr, xdata)
        return flask.jsonify({"prediction": prediction}), 200
    else:
        return flask.jsonify({"message": "Not Found", "status_code": 404}), 404

# @ASD.app.route('/api/v1/c/')
# def classification():
#     email = 'email'
#     if email not in flask.session:
#         return flask.jsonify({"message": "Bad Request", "status_code": 400}), 400
#     name = flask.request.get_json()['name']
#     connection = ASD.model.get_db()
#     cur = connection.execute('SELECT count(*) FROM data WHERE owner = ?', (name,))
#     context = {}
#     if cur.fetchone()['count(*)'] == 0:
#         context['message'] = 'OK'
#         classify = random.randint(0, 4)
#         connection.execute('INSERT INTO data(owner, class) VALUES (?,?)', (name, classify))
#         context['classify'] = classify
#     else:
#         context['message'] = 'Conflict'
#         cur = connection.execute('SELECT class FROM data WHERE owner = ?', (name,))
#         classify = cur.fetchone()['class']
#         context['classify'] = classify
#     return flask.jsonify(**context), 200
