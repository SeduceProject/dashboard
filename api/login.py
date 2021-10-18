from database.connector import open_session, close_session
from database.tables import User
from flask_login import current_user, login_user, login_required, logout_user
from werkzeug.security import generate_password_hash, check_password_hash
import flask, logging


b_login = flask.Blueprint("login", __name__, template_folder="templates/")


@b_login.route("/login")
def login():
    if current_user.is_authenticated:
        return flask.redirect("/dashboard")
    else:
        return flask.render_template("login.html")


@b_login.route("/login-post", methods=["POST"])
def login_post():
    if current_user.is_authenticated:
        return flask.redirect("/dashboard")
    form_data = flask.request.form
    authenticated = False
    if len(form_data["email"]) > 0 and len(form_data["pwd"]) > 0:
        db = open_session()
        user = db.query(User).filter_by(email = form_data["email"]).first()
        if user is not None:
            if check_password_hash(user.password, form_data["pwd"]):
                authenticated = True
                login_user(user, remember=True)
            else:
                msg="Wrong email or password"
        else:
            msg = "User is not authorized to login"
        close_session(db)
    else:
        msg = "Missing parameters: 'email' or 'pwd'"
    if authenticated:
        return flask.redirect("/dashboard")
    else:
        return flask.redirect("/login?msg=%s" % msg)


@b_login.route('/logout')
@login_required
def logout():
    logout_user()
    return flask.redirect("/dashboard")
