from database.connector import open_session, close_session
from database.tables import User
from flask_login import current_user, login_required
from werkzeug.security import generate_password_hash
import flask, logging


b_admin = flask.Blueprint("admin", __name__, template_folder="templates/")


@b_admin.route("/users")
@login_required
def users():
    admins = []
    db = open_session()
    for user in db.query(User).all():
        admins.append(user.email)
    close_session(db)
    return flask.render_template("users.html", active_btn = "user",
        is_anonymous = current_user.is_anonymous, existing = admins)


@b_admin.route("/add-admin", methods=[ "POST" ])
@login_required
def add_admin():
    form_data = flask.request.form
    db = open_session()
    existing = db.query(User).filter(User.email == form_data["email"]).first()
    if existing is None:
        if form_data["pwd"] == form_data["confirm_pwd"]:
            new_user = User(email = form_data["email"],
                password = generate_password_hash(form_data["pwd"], method = 'sha256'))
            db.add(new_user)
        else:
            logging.error("Can not add the administrator '%s': password and confirm password are different" % form_data["email"])
    else:
        logging.error("Can not add the administrator '%s': the administrator already exists" % form_data["email"])
    close_session(db)
    return flask.redirect("/users")


@b_admin.route("/del-admin", methods=[ "POST" ])
@login_required
def del_admin():
    email = flask.request.form["email"]
    db = open_session()
    existing = db.query(User).filter(User.email == email).first()
    if existing is None:
        logging.error("Administrator '%s' does not exist" % email)
    else:
        admins = db.query(User).all()
        if len(admins) < 2:
            logging.error("Can not delete the administrator '%s' because he is the last administrator" % email)
        else:
            db.delete(existing)
    close_session(db)
    return flask.redirect("/users")
