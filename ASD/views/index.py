import ASD
import flask


@ASD.app.route('/')
def index():
    return flask.render_template('index.html')
