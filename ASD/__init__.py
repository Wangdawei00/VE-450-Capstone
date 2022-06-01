import flask

app = flask.Flask(__name__)

app.config.from_object('ASD.config')
import ASD.api
import ASD.views
import ASD.model