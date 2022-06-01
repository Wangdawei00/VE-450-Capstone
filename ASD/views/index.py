import ASD
import flask


@ASD.app.route('/')
def index():
    resp = flask.make_response(flask.render_template('index.html'))
    resp.headers["Cross-Origin-Opener-Policy"] = "same-origin"
    resp.headers["Cross-Origin-Embedder-Policy"] = "require-corp"
    return resp
