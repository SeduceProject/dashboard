from flask_login import current_user, login_required
from influxdb import InfluxDBClient
from api.sensor_map import SENSOR_NAME_MAP
import flask, json, logging, time


b_main = flask.Blueprint("user", __name__, template_folder="templates/")


def update_values():
    monitoring_db_name = "mondb"
    influx = InfluxDBClient(host='localhost', port=8086)
    influx_dbs = [info["name"] for info in influx.get_list_database()]
    if monitoring_db_name not in influx_dbs:
        logging.error("No Influx database named '%s'" % monitoring_db_name)
        return
    influx.switch_database(monitoring_db_name)
    # Update the temperature values
    temperature_file = "static/temperature.json"
    with open(temperature_file, "r") as temp_file:
        data = json.load(temp_file)
    if data["time"] < time.time() - 10:
        # Write a new JSON
        result = { "time": int(time.time()), "values": [] }
        influx_query = "SELECT LAST(*) FROM sensors WHERE time > now() - 30s \
            AND sensor_type = 'temperature' GROUP BY sensor"
        influx_res = influx.query(influx_query, epoch="s")
        for item in influx_res.items():
            item_val = list(item[1])[0]
            sensor_name = item[0][1]["sensor"]
            if sensor_name in SENSOR_NAME_MAP:
                item_val["name"] = SENSOR_NAME_MAP[sensor_name]
                result["values"].append(item_val)
        with open(temperature_file, "w") as temp_file:
            json.dump(result, temp_file, indent = 4)
    # Update the power values
    power_file = "static/power.json"
    with open(power_file, "r") as temp_file:
        data = json.load(temp_file)
    if data["time"] < time.time() - 30:
        # Write a new JSON
        result = { "time": int(time.time()), "values": [] }
        influx_query = "SELECT LAST(*) FROM sensors WHERE time > now() - 60s \
            AND unit = 'W' GROUP BY sensor"
        influx_res = influx.query(influx_query, epoch="s")
        for item in influx_res.items():
            item_val = list(item[1])[0]
            sensor_name = item[0][1]["sensor"]
            if sensor_name.startswith("ecotype") or \
                sensor_name.startswith("solar") or  \
                sensor_name.startswith("watt") or  \
                sensor_name.startswith("switch"):
                if sensor_name in SENSOR_NAME_MAP:
                    item_val["name"] = SENSOR_NAME_MAP[sensor_name]
                else:
                    item_val["name"] = sensor_name
                result["values"].append(item_val)
        with open(power_file, "w") as temp_file:
            json.dump(result, temp_file, indent = 4)
    # Update the power values for the day
    power_file = "static/power_day.json"
    with open(power_file, "r") as temp_file:
        data = json.load(temp_file)
    # Compute the timestamp for midnight
    midnight = int(time.time())
    midnight = midnight - midnight % (24 * 3600)
    if data["time"] < midnight:
        # Write a new JSON
        result = { "time": int(time.time()), "values": {} }
        influx_query = "SELECT * FROM  power_mean_5m WHERE time > now() - 1d"
        influx_res = influx.query(influx_query, epoch="s")
        for item in list(influx_res.get_points()):
            sensor_name = item["sensor"] 
            if sensor_name.startswith("ecotype") or \
                sensor_name.startswith("watt") or  \
                sensor_name.startswith("switch"):
                timestamp = str(item["time"])
                if timestamp not in result["values"]:
                    result["values"][timestamp] = { "cons": 0, "prod": 0 }
                result["values"][timestamp]["cons"] += item["mean"] 
            elif sensor_name.startswith("solar"):
                timestamp = str(item["time"])
                if timestamp not in result["values"]:
                    result["values"][timestamp] = { "cons": 0, "prod": 0 }
                result["values"][timestamp]["prod"] += item["mean"] 
        with open(power_file, "w") as temp_file:
            json.dump(result, temp_file, indent = 4)


# HTML Pages
@b_main.route("/dashboard")
@login_required
def dashboard():
    update_values()
    return flask.render_template("dashboard.html", active_btn = "dashboard", admin = current_user.is_admin)
