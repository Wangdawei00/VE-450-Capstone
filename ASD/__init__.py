import flask
from flask_mail import Mail

app = flask.Flask(__name__)
app.config.from_object('ASD.config')
mail = Mail(app)
import ASD.api
import ASD.views
import ASD.model
