import click
from flask import current_app
from ..extensions import db
from ..models import User, Order

@click.command("seed-basic")
def seed_basic():
    """Crea datos mínimos de prueba (idempotente simple)."""
    with current_app.app_context():
        if User.query.count() > 0:
            click.echo("Ya existen usuarios. Omitiendo seed básico.")
            return

        u1 = User(name="Ada Lovelace", email="ada@example.com")
        u2 = User(name="Alan Turing", email="alan@example.com")
        db.session.add_all([u1, u2])
        db.session.flush()  # para obtener ids

        db.session.add_all([
            Order(user_id=u1.id, product_name="Cuaderno A5", amount=125.0),
            Order(user_id=u1.id, product_name="Lápiz HB", amount=19.9),
            Order(user_id=u2.id, product_name="Regla 30cm", amount=57.5),
        ])
        db.session.commit()
        click.echo("Seed básico creado.")
