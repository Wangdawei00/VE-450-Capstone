import hashlib
import math
import random
import uuid

import flask
import ASD




def hash_password(algorithm, salt, password_raw):
    """
    Hash password.

    :param algorithm: The algorithm used to hash the password
    :param salt: a random hexdecimal string
    :param password_raw: the raw password
    :return: the hashed password
    """
    func = hashlib.new(algorithm)
    func.update((salt + password_raw).encode('utf-8'))
    return func.hexdigest()


def new_login(connection):
    if len(flask.request.form['username']) == 0 or \
            len(flask.request.form['password']) == 0:
        flask.abort(400)
    cur = connection.execute('SELECT COUNT(password) '
                             'FROM users WHERE email=?',
                             (flask.request.form['username'],))
    if cur.fetchone()['COUNT(password)'] == 0:
        flask.abort(403)
    cur = connection.execute('SELECT password '
                             'FROM users WHERE email=?',
                             (flask.request.form['username'],))
    password_hashes = cur.fetchone()['password']
    algorithm, salt, password_hash = password_hashes.split('$')
    false_password_hash = hash_password(algorithm, salt,
                                        flask.request.form['password'])
    if false_password_hash != password_hash:
        flask.abort(403)
    flask.session[ASD.app.config.session_cookie_name] = flask.request.form['username']


@ASD.app.route("/accounts/login/")
def login():
    if ASD.app.config.session_cookie_name in flask.session:
        return flask.redirect(flask.url_for('index'))
    return flask.render_template("login.html")



@ASD.app.route("/accounts/", methods=['POST'])
def account():
    connection = ASD.model.get_db()
    connection.execute("PRAGMA foreign_keys = ON;")
    if flask.request.form['operation'] == 'login':
        new_login(connection)
    if flask.request.form['operation'] == 'create':
        new_create(connection)
    if flask.request.form['operation'] == 'reset':
        new_reset(connection)
    if not flask.request.args.get('target'):
        return flask.redirect(flask.url_for('index'))
    return flask.redirect(flask.request.args.get('target'))
