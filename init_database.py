from database.tables import User
from database.connector import create_tables, open_session, close_session
import logging

logging.basicConfig(level=logging.INFO,
    format='%(asctime)s %(levelname)-8s %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
if create_tables():
    logging.info("Database initialization complete")
    # Create the admin user
    db = open_session()
    admin = User()
    admin.email = "admin@seduce.fr"
    # Default admin password: seduceadmin (please, change the password at the first login)
    admin.password = \
        "sha256$tfuUzjjN$86f64e27bd56bb25b606f3d4d595c0c837ee93648e3884d32c618d329025e5f3"
    db.add(admin)
    close_session(db)
else:
    logging.error("Fail to initialize the database")
