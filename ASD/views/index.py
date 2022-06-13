import ASD
import flask


@ASD.app.route('/')
def index():
    if 'username' in flask.session:
        resp = flask.make_response(flask.render_template('index.html'))
        resp.headers["Cross-Origin-Opener-Policy"] = "same-origin"
        resp.headers["Cross-Origin-Embedder-Policy"] = "require-corp"
        return resp
    else:
        return flask.redirect(flask.url_for("login"))
