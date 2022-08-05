import ASD
import flask
import pathlib


@ASD.app.route('/')
def index():
    if 'email' in flask.session:
        context = {
            "title": "ASD Website",
            "name": "main"
        }
        resp = flask.make_response(flask.render_template('index.html', **context))
        resp.headers["Cross-Origin-Opener-Policy"] = "same-origin"
        resp.headers["Cross-Origin-Embedder-Policy"] = "require-corp"
        return resp
    else:
        return flask.redirect(flask.url_for("login"))


@ASD.app.route('/manual/')
def manual():
    return flask.render_template('manual.html')


@ASD.app.route('/manual_eng/')
def manual_eng():
    return flask.render_template('manual_eng.html')


@ASD.app.route('/result/')
def result_page():
    if 'email' not in flask.session:
        return flask.redirect(flask.url_for('login'))
    context = {
        'title': "Result",
        "name": 'result',
    }
    return flask.render_template("index.html", **context)
# @ASD.app.route('/favicon.ico/')
# def favicon():
#     return flask.send_from_directory(ASD.app.config['ASD_ROOT'] / 'static' / 'images', 'favicon.ico')
