from flask import Flask

from .api.health import bp as health_bp
from .config import load_config
from .errors import register_error_handlers
from .extensions import cors, db, migrate


def create_app():
    app = Flask(__name__)
    load_config(app)

    # Extensiones
    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={r"/*": {"origins": app.config.get("CORS_ORIGINS", "*")}})

    # Blueprints
    app.register_blueprint(health_bp)

    # Importa modelos para que Flask-Migrate los detecte
    from .models import user, order  # noqa: F401

    # Errores JSON
    register_error_handlers(app)

    return app
