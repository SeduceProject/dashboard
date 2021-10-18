from database.base import Base
from flask_login import UserMixin
from sqlalchemy import Boolean, Column, String, Text


class User(Base):
    __tablename__ = "user"
    email = Column(Text, primary_key=True)
    password = Column(String)


    def is_active(self):
        """True, as all users are active."""
        return True


    def get_id(self):
        """Return the email address to satisfy Flask-Login's requirements."""
        return self.email


    def is_authenticated(self):
        """Return True if the user is authenticated."""
        return self.authenticated


    def is_anonymous(self):
        """False, as anonymous users aren't supported."""
        return False


    def __repr__(self):
        return "User(%s, %s, %s)" % (self.email, self.is_authorized, self.is_admin)
