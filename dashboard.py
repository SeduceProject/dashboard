from database.connector import open_session, close_session
from database.tables import User
from datetime import datetime
from flask import Flask, render_template
from flask_login import LoginManager, UserMixin
from api.login import b_login
from api.main import b_main
import jinja2, logging, os, sys


# Create the application
dashboard = Flask(__name__)
dashboard.secret_key = "dashboard secret key"
# Add routes from blueprints
dashboard.register_blueprint(b_login)
dashboard.register_blueprint(b_main)


# Jinja filters to render templates
@dashboard.template_filter()
def timestamp_to_date(timestamp):
    return datetime.fromtimestamp(timestamp)


# Flask_login configuration (session manager)
class LoginUser(UserMixin):
    pass


login_manager = LoginManager()
login_manager.init_app(dashboard)
login_manager.login_view = "login.login"


@login_manager.user_loader
def load_user(user_email):
    db = open_session()
    db_user = db.query(User).filter(User.email == user_email).first()
    auth_user = None
    if db_user is not None:
        flask_user = LoginUser()
        flask_user.email = db_user.email
        auth_user = flask_user
    close_session(db)
    return auth_user


# HTML pages for error
@dashboard.errorhandler(403)
def page_not_found(e):
    # note that we set the 404 status explicitly
    return render_template('403.html'), 403


# Start the web interface
if __name__ == "__main__":
    logging.basicConfig(filename="info_dashboard.log", level=logging.INFO,
        format="%(asctime)s %(levelname)-8s %(message)s", datefmt="%Y-%m-%d %H:%M:%S")
    dashboard.run(port=8000, host="0.0.0.0")
