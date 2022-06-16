import ASD
import flask
import pathlib


@ASD.app.route('/')
def index():
    # if 'username' in flask.session:
    resp = flask.make_response(flask.render_template('index.html'))
    resp.headers["Cross-Origin-Opener-Policy"] = "same-origin"
    resp.headers["Cross-Origin-Embedder-Policy"] = "require-corp"
    return resp
    # else:
    #     return flask.redirect(flask.url_for("login"))


# @ASD.app.route('/favicon.ico/')
# def favicon():
#     return flask.send_from_directory(ASD.app.config['ASD_ROOT'] / 'static' / 'images', 'favicon.ico')
