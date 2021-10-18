from flask_login import current_user, login_required
import flask


b_main = flask.Blueprint("user", __name__, template_folder="templates/")

# JSON files
@b_main.route("/json/temperature")
def temperature_file():
    return flask.send_file("json/temperature.json", cache_timeout = 5)


@b_main.route("/json/power")
def power_file():
    return flask.send_file("json/power.json", cache_timeout = 5)


@b_main.route("/json/power_day")
def power_day_file():
    return flask.send_file("json/power_day.json", cache_timeout = 5)


@b_main.route("/json/production")
def production_file():
    return flask.send_file("json/production.json", cache_timeout = 5)


# HTML Pages
@b_main.route("/dashboard")
@login_required
def dashboard():
    return flask.render_template("dashboard.html", active_btn = "dashboard", admin = current_user.is_admin)


@b_main.route("/sensors")
@login_required
def sensors():
    return flask.render_template("sensors.html", active_btn = "sensors", admin = current_user.is_admin)


@b_main.route("/temperatures")
@login_required
def temperatures():
    return flask.render_template("rack_temperatures.html", active_btn = "temperatures", admin = current_user.is_admin)


@b_main.route("/consumption")
@login_required
def consumption():
    return flask.render_template("consumption.html", active_btn = "consumption", admin = current_user.is_admin)


@b_main.route("/production")
@login_required
def production():
    return flask.render_template("production.html", active_btn = "production", admin = current_user.is_admin)
