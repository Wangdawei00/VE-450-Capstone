import flask
import ASD


@ASD.app.route("/api/v1/d/", methods=["POST"])
def data():
    email = 'email'
    if email not in flask.session:
        return flask.jsonify({"message": "Bad Request", "status_code": 400}), 400
    x_list = flask.request.get_json()["x_data"]
    y_list = flask.request.get_json()["y_data"]

    x_to_sql = " ".join(x_list)
    y_to_sql = " ".join(y_list)

    connection = ASD.model.get_db()

    connection.execute("DELETE FROM data WHERE owner = ?", (email))
    connection.execute(
        "INSERT INTO data (owner, xdata, ydata) VALUES (?, ?, ?)",
        (email, x_to_sql, y_to_sql),
    )

    return flask.jsonify({"message": "OK", "status_code": 200}), 200
