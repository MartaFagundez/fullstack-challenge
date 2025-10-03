from flask import Flask

from .seeds.seed_basic import seed_basic


def register_cli(app: Flask):
    app.cli.add_command(seed_basic)
