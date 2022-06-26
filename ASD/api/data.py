import random

import flask

import ASD


@ASD.app.route("/api/v1/d/", methods=["POST"])
def data():
    email = 'email'
    if email not in flask.session:
        return flask.jsonify({"message": "Bad Request", "status_code": 400}), 400
    json = flask.request.get_json()
    x_list = json["x_data"]
    y_list = json["y_data"]
    name = json['name']
    x_to_sql = " ".join(x_list)
    y_to_sql = " ".join(y_list)

    connection = ASD.model.get_db()

    connection.execute("UPDATE data SET xdata = ?, ydata = ? WHERE owner = ?",
                       (x_to_sql, y_to_sql, name))

    return flask.jsonify({"message": "OK", "status_code": 200}), 200


@ASD.app.route('/api/v1/c/')
def classification():
    email = 'email'
    if email not in flask.session:
        return flask.jsonify({"message": "Bad Request", "status_code": 400}), 400
    name = flask.request.get_json()['name']
    connection = ASD.model.get_db()
    cur = connection.execute('SELECT count(*) FROM data WHERE owner = ?', (name,))
    context = {}
    if cur.fetchone()['count(*)'] == 0:
        context['message'] = 'OK'
        classify = random.randint(0, 4)
        connection.execute('INSERT INTO data(owner, class) VALUES (?,?)', (name, classify))
        context['classify'] = classify
    else:
        context['message'] = 'Conflict'
        cur = connection.execute('SELECT class FROM data WHERE owner = ?', (name,))
        classify = cur.fetchone()['class']
        context['classify'] = classify
    return flask.jsonify(**context), 200
