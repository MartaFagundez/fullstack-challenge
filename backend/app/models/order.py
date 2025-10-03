from sqlalchemy import func, CheckConstraint, ForeignKey
from ..extensions import db

class Order(db.Model):
    __tablename__ = "orders"
    __table_args__ = (
        CheckConstraint("amount > 0", name="ck_orders_amount_positive"),
        db.Index("ix_orders_user_created", "user_id", "created_at"),
    )

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    product_name = db.Column(db.String(200), nullable=False)
    amount = db.Column(db.Numeric(10,2), nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)

    user = db.relationship("User", back_populates="orders")

    def __repr__(self) -> str:
        return f"<Order id={self.id} user_id={self.user_id} amount={self.amount}>"
