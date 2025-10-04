import click

from flask import Flask
from .seeds import seed_faker
from .seeds.seed_basic import seed_basic
from .extensions import db


def register_cli(app: Flask):
    app.cli.add_command(seed_basic)
    @app.cli.command("seed-faker")
    @click.option("--users", default=20, help="Cantidad de usuarios")
    @click.option("--orders", default=60, help="Cantidad de órdenes")
    def seed_faker_cmd(users, orders):
        """Genera datos con Faker (no borra datos existentes)."""
        res = seed_faker.run(users=users, orders=orders)
        click.echo(f"Seeded: {res['users']} users, {res['orders']} orders")
