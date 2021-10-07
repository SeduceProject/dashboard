from database.base import Base, engine, SessionLocal
from sqlalchemy import inspect
# Import tables to load the table description
import database.tables, logging, requests, sys


def open_session():
    return SessionLocal()


def close_session(session):
    session.commit()
    session.close()


def create_tables():
    inspector = inspect(engine)
    tables = []
    tables = inspector.get_table_names()
    if len(tables) == 0:
        logging.info("The database is empty. Create tables...")
        Base.metadata.create_all(engine)
        return True
    return False
