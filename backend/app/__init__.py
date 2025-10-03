from flask import Flask

from .api.health import bp as health_bp
from .api.orders import bp as orders_bp
from .api.users import bp as users_bp
from .cli import register_cli
from .config import load_config
from .errors import register_error_handlers
from .extensions import cors, db, migrate

from flasgger import Swagger


def create_app():
    app = Flask(__name__)
    load_config(app)

    # Extensiones
    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={r"/*": {"origins": app.config.get("CORS_ORIGINS", "*")}})

    # Swagger (UI en /apidocs)
    app.config["SWAGGER"] = {"title": "Fullstack Challenge API", "uiversion": 3}
    Swagger(app)

    # Blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(users_bp)

    # Importa modelos para que Flask-Migrate los detecte
    from .models import order, user  # noqa: F401

    # Errores JSON
    register_error_handlers(app)

    register_cli(app)
    return app
