from database.connector import open_session, close_session
from database.tables import User
from flask_login import current_user, login_required
from pymodbus.client.sync import ModbusTcpClient
from pymodbus.payload import BinaryPayloadDecoder
from werkzeug.security import generate_password_hash
import flask, json, logging


b_admin = flask.Blueprint("admin", __name__, template_folder="templates/")

# Information about the modbus table
modbus_units = {
    "big_endian_bool": {
        "read_bytes": 1,
        "byteorder": ">",
        "wordorder": ">",
        "decoder": "decode_16bit_uint"
    },
    "big_endian_int16": {
        "read_bytes": 1,
        "byteorder": ">",
        "wordorder": ">",
        "decoder": "decode_16bit_int"
    }
}
modbus_props = {
    "inverter1_network": {
        "address": 4210,
        "type": "big_endian_int16",
        "default": 1
    },
    "inverter2_network": {
        "address": 4214,
        "type": "big_endian_int16",
        "default": 1
    },
    "inverter3_network": {
        "address": 4218,
        "type": "big_endian_int16",
        "default": 2
    },
    "inverter4_network": {
        "address": 4222,
        "type": "big_endian_int16",
        "default": 2
    },
    "inverter5_network": {
        "address": 4226,
        "type": "big_endian_int16",
        "default": 3
    },
    "inverter6_network": {
        "address": 4230,
        "type": "big_endian_int16",
        "default": 3
    },
    "inverter7_network": {
        "address": 4234,
        "type": "big_endian_int16",
        "default": 4
    },
    "inverter8_network": {
        "address": 4238,
        "type": "big_endian_int16",
        "default": 4
    },
    "inverter9_network": {
        "address": 4242,
        "type": "big_endian_int16",
        "default": 5
    },
    "inverter10_network": {
        "address": 4246,
        "type": "big_endian_int16",
        "default": 5
    },
    "inverter11_network": {
        "address": 4250,
        "type": "big_endian_int16",
        "default": 6
    },
    "inverter12_network": {
        "address": 4254,
        "type": "big_endian_int16",
        "default": 6
    },
    "inverter13_network": {
        "address": 4258,
        "type": "big_endian_int16",
        "default": 7
    },
    "inverter14_network": {
        "address": 4262,
        "type": "big_endian_int16",
        "default": 8
    },
    "network1_alarm": {
        "address": 1100,
        "type": "big_endian_int16",
        "default": 0
    },
    "network1_grafcet": {
        "address": 1001,
        "type": "big_endian_int16",
        "default": 110
    },
    "network1_mode": {
        "address": 3111,
        "type": "big_endian_int16",
        "default": 1
    },
    "network1_status": {
        "address": 3110,
        "type": "big_endian_bool",
        "default": 1
    },
    "network2_alarm": {
        "address": 1130,
        "type": "big_endian_int16",
        "default": 0
    },
    "network2_grafcet": {
        "address": 1002,
        "type": "big_endian_int16",
        "default": 210
    },
    "network2_mode": {
        "address": 3121,
        "type": "big_endian_int16",
        "default": 1
    },
    "network2_status": {
        "address": 3120,
        "type": "big_endian_bool",
        "default": 1
    },
    "network3_alarm": {
        "address": 1160,
        "type": "big_endian_int16",
        "default": 0
    },
    "network3_grafcet": {
        "address": 1003,
        "type": "big_endian_int16",
        "default": 310
    },
    "network3_mode": {
        "address": 3131,
        "type": "big_endian_int16",
        "default": 1
    },
    "network3_status": {
        "address": 3130,
        "type": "big_endian_bool",
        "default": 1
    },
    "network4_alarm": {
        "address": 1190,
        "type": "big_endian_int16",
        "default": 0
    },
    "network4_grafcet": {
        "address": 1004,
        "type": "big_endian_int16",
        "default": 410
    },
    "network4_mode": {
        "address": 3141,
        "type": "big_endian_int16",
        "default": 1
    },
    "network4_status": {
        "address": 3140,
        "type": "big_endian_bool",
        "default": 1
    },
    "network5_alarm": {
        "address": 1210,
        "type": "big_endian_int16",
        "default": 0
    },
    "network5_grafcet": {
        "address": 1005,
        "type": "big_endian_int16",
        "default": 510
    },
    "network5_mode": {
        "address": 3151,
        "type": "big_endian_int16",
        "default": 1
    },
    "network5_status": {
        "address": 3150,
        "type": "big_endian_bool",
        "default": 1
    },
    "network6_alarm": {
        "address": 1240,
        "type": "big_endian_int16",
        "default": 0
    },
    "network6_grafcet": {
        "address": 1006,
        "type": "big_endian_int16",
        "default": 610
    },
    "network6_mode": {
        "address": 3161,
        "type": "big_endian_int16",
        "default": 1
    },
    "network6_status": {
        "address": 3160,
        "type": "big_endian_bool",
        "default": 1
    },
    "network7_alarm": {
        "address": 1270,
        "type": "big_endian_int16",
        "default": 0
    },
    "network7_grafcet": {
        "address": 1007,
        "type": "big_endian_int16",
        "default": 710
    },
    "network7_mode": {
        "address": 3171,
        "type": "big_endian_int16",
        "default": 1
    },
    "network7_status": {
        "address": 3170,
        "type": "big_endian_bool",
        "default": 1
    },
    "network8_alarm": {
        "address": 1300,
        "type": "big_endian_int16",
        "default": 0
    },
    "network8_grafcet": {
        "address": 1008,
        "type": "big_endian_int16",
        "default": 810
    },
    "network8_mode": {
        "address": 3181,
        "type": "big_endian_int16",
        "default": 1
    },
    "network8_status": {
        "address": 3180,
        "type": "big_endian_bool",
        "default": 1
    },
    "overall_grafcet": {
        "address": 1000,
        "type": "big_endian_int16",
        "default": 20
    },
    "overall_status": {
        "address": 3000,
        "type": "big_endian_bool",
        "default": 1
    }
}

modbus_actions = {
    "inverter1": {
        "assign_network1": {
            "address": 4210,
            "value": 1
        }
    },
    "inverter2": {
        "assign_network1": {
            "address": 4214,
            "value": 1
        }
    },
    "inverter3": {
        "assign_network2": {
            "address": 4218,
            "value": 1
        }
    },
    "inverter4": {
        "assign_network2": {
            "address": 4222,
            "value": 1
        }
    },
    "inverter5": {
        "assign_network3": {
            "address": 4226,
            "value": 1
        }
    },
    "inverter6": {
        "assign_network3": {
            "address": 4230,
            "value": 1
        }
    },
    "inverter7": {
        "assign_network4": {
            "address": 4234,
            "value": 1
        }
    },
    "inverter8": {
        "assign_network4": {
            "address": 4238,
            "value": 1
        }
    },
    "inverter9": {
        "assign_network5": {
            "address": 4242,
            "value": 1
        }
    },
    "inverter10": {
        "assign_network5": {
            "address": 4246,
            "value": 1
        }
    },
    "inverter11": {
        "assign_network6": {
            "address": 4250,
            "value": 1
        }
    },
    "inverter12": {
        "assign_network6": {
            "address": 4254,
            "value": 1
        }
    },
    "inverter13": {
        "assign_network7": {
            "address": 4258,
            "value": 1
        }
    },
    "inverter14": {
        "assign_network8": {
            "address": 4262,
            "value": 1
        }
    },
    "network1" : {
        "activate": {
            "address": 3110,
            "value": 1
        },
        "deactivate": {
            "address": 3110,
            "value": 0
        }
    },
    "network2" : {
        "activate": {
            "address": 3120,
            "value": 1
        },
        "deactivate": {
            "address": 3120,
            "value": 0
        }
    },
    "network3" : {
        "activate": {
            "address": 3130,
            "value": 1
        },
        "deactivate": {
            "address": 3130,
            "value": 0
        }
    },
    "network4" : {
        "activate": {
            "address": 3140,
            "value": 1
        },
        "deactivate": {
            "address": 3140,
            "value": 0
        }
    },
    "network5" : {
        "activate": {
            "address": 3150,
            "value": 1
        },
        "deactivate": {
            "address": 3150,
            "value": 0
        }
    },
    "network6" : {
        "activate": {
            "address": 3160,
            "value": 1
        },
        "deactivate": {
            "address": 3160,
            "value": 0
        }
    },
    "network7" : {
        "activate": {
            "address": 3170,
            "value": 1
        },
        "deactivate": {
            "address": 3170,
            "value": 0
        }
    },
    "network8" : {
        "activate": {
            "address": 3180,
            "value": 1
        },
        "deactivate": {
            "address": 3180,
            "value": 0
        }
    },
    "overall" : {
        "activate": {
            "address": 3000,
            "value": 1
        },
        "deactivate": {
            "address": 3000,
            "value": 0
        },
        "toggle_ack": {
            "address": 3001,
            "value": 1
        }
    }
}

# POST methods
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


@b_admin.route("/update-pwd", methods=[ "POST" ])
@login_required
def update_pwd():
    updated = False
    form_data = flask.request.form
    db = open_session()
    existing = db.query(User).filter(User.email == current_user.email).first()
    if existing is None:
        logging.error("Administrator '%s' does not exist" % current_user.email)
    else:
        if form_data["pwd"] == form_data["confirm_pwd"]:
            existing.password = generate_password_hash(form_data["pwd"], method = 'sha256')
            logging.info("Password for '%s' updated" % current_user.email)
            updated = True
        else:
            logging.error("Can not update the password: password and confirm password are different")
    close_session(db)
    if updated:
        return flask.redirect("/dashboard")
    else:
        return flask.redirect("/password")


# The pages of the left menu
@b_admin.route("/users")
@login_required
def users():
    admins = []
    db = open_session()
    for user in db.query(User).all():
        admins.append(user.email)
    close_session(db)
    return flask.render_template("users.html", active_btn = "users",
        is_anonymous = current_user.is_anonymous, existing = admins)


@b_admin.route("/password")
@login_required
def password():
    return flask.render_template("password.html", active_btn = "password",
        is_anonymous = current_user.is_anonymous)


def read_register(modbus_client, register_nb, unit_cfg):
    value = modbus_client.read_holding_registers(register_nb, unit_cfg["read_bytes"], unit = 1)
    if not hasattr(value, "registers"):
        logging.error("can not read the register %d" % register_nb)
    else:
        decoder = BinaryPayloadDecoder.fromRegisters(value.registers,
             byteorder = unit_cfg["byteorder"],
             wordorder = unit_cfg["wordorder"])
        return getattr(decoder, unit_cfg["decoder"])()


def write_register(register_nb, value):
    client = ModbusTcpClient("192.168.1.2", port=503)
    client.connect()
    client.write_register(register_nb, value)
    client.close()


@b_admin.route("/commands/<device_name>/<action_name>")
@login_required
def command_actions(device_name, action_name):
    if device_name in modbus_actions and action_name in modbus_actions[device_name]:
        write_register(
            modbus_actions[device_name][action_name]["address"],
            modbus_actions[device_name][action_name]["value"])
    else:
        logging.error("Action '%s' not found for the device '%s'" % (action_name, device_name))
    return flask.redirect("/commands")


@b_admin.route("/commands")
@login_required
def commands():
    client = ModbusTcpClient("192.168.1.2", port=503)
    client.connect()
    result = {}
    for name, value in modbus_props.items():
        modbus_value = read_register(client, value["address"], modbus_units[value["type"]])
        device_name = name.split("_")[0]
        prop_name = name.split("_")[1]
        if device_name not in result:
            result[device_name] = {}
        result[device_name][prop_name] = {
            "register": value["address"],
            "value": modbus_value,
            "default_value": value["default"]
        }
        if device_name in modbus_actions:
            result[device_name]["actions"] = list(modbus_actions[device_name].keys())
    client.close()
    return flask.render_template("commands.html", active_btn = "commands",
        is_anonymous = current_user.is_anonymous, modbus = result)
