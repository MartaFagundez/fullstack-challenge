import re

from sqlalchemy import func
from sqlalchemy.orm import validates

from ..extensions import db

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True, index=True)
    created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)

    # Relación 1—N con Order
    orders = db.relationship(
        "Order",
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    @validates("email")
    def validate_email(self, key, value: str):
        # normalizamos para evitar duplicados por mayúsculas
        value = (value or "").strip().lower()
        if not EMAIL_RE.fullmatch(value):
            raise ValueError("Formato de email inválido")
        return value

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email!r}>"
