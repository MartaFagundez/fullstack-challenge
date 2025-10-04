from faker import Faker
from random import randint, uniform
from decimal import Decimal, ROUND_HALF_UP
from ..models.user import User
from ..models.order import Order
from ..extensions import db

fake = Faker("es_ES")  # simple y cercano a español

def _money(n: float) -> Decimal:
    # 2 decimales, redondeo contable
    return Decimal(n).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

def run(users: int = 20, orders: int = 60):
    Faker.seed(1234)
    # Usuarios
    user_ids = []
    for _ in range(users):
        name = fake.name()
        email = fake.unique.email()
        u = User(name=name, email=email)
        db.session.add(u)
        db.session.flush()           # obtiene id sin commit
        user_ids.append(u.id)

    # Órdenes
    for _ in range(orders):
        uid = user_ids[randint(0, len(user_ids) - 1)]
        product = fake.catch_phrase()[:120]
        amount = _money(uniform(5, 200))
        o = Order(user_id=uid, product_name=product, amount=amount)
        db.session.add(o)

    db.session.commit()
    return {"users": len(user_ids), "orders": orders}
