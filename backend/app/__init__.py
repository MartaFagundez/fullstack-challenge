from flask import Flask
from .config import load_config
from .extensions import db, migrate, cors
from .errors import register_error_handlers
from .api.health import bp as health_bp

def create_app():
    app = Flask(__name__)
    load_config(app)

    # Extensiones
    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={r"/*": {"origins": app.config.get("CORS_ORIGINS", "*")}})

    # Blueprints
    app.register_blueprint(health_bp)

    # Errores JSON
    register_error_handlers(app)

    return app
