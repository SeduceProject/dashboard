from influxdb import InfluxDBClient
from api.sensor_map import SENSOR_NAME_MAP
import json, logging, sys, time

if __name__ == '__main__':
    logging.basicConfig(filename="info_updater.log", level=logging.INFO,
        format="%(asctime)s %(levelname)-8s %(message)s", datefmt="%Y-%m-%d %H:%M:%S")
    logging.info("Updater is starting")
    monitoring_db_name = "mondb"
    json_dir = "json"
    while True:
        try:
            influx = InfluxDBClient(host='localhost', port=8086)
            influx_dbs = [info["name"] for info in influx.get_list_database()]
            if monitoring_db_name not in influx_dbs:
                logging.error("No Influx database named '%s'" % monitoring_db_name)
                sys.exit(13)
            influx.switch_database(monitoring_db_name)
            # Update the temperature values
            temperature_file = "%s/temperature.json" % json_dir
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
            power_file = "%s/power.json" % json_dir
            with open(power_file, "r") as temp_file:
                data = json.load(temp_file)
            if data["time"] < time.time() - 10:
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
            power_file = "%s/power_day.json" % json_dir
            with open(power_file, "r") as temp_file:
                data = json.load(temp_file)
            if data["time"] < time.time() - 10 * 60:
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
            # Update the production values
            prod_file = "%s/production.json" % json_dir
            with open(prod_file, "r") as temp_file:
                data = json.load(temp_file)
            if data["time"] < time.time() - 10 * 60:
                # Write a new JSON
                result = { "time": int(time.time()), "values": {} }
                influx_query = "SELECT * FROM power_mean_5m WHERE \
                    sensor =~ /solar.*/ AND time > now() - 2d;"
                influx_res = influx.query(influx_query, epoch="s")
                for item in list(influx_res.get_points()):
                    sensor_name = SENSOR_NAME_MAP[item["sensor"]]
                    if sensor_name not in result["values"]:
                        result["values"][sensor_name] = [] 
                    result["values"][sensor_name].append(item)
                with open(prod_file, "w") as temp_file:
                    json.dump(result, temp_file, indent = 4)
        except:
            logging.exception("Something wrong happens")
        time.sleep(10)
