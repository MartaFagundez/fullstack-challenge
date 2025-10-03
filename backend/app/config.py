import os


class BaseConfig:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///app.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173")


class DevConfig(BaseConfig):
    DEBUG = True


class TestConfig(BaseConfig):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"


class ProdConfig(BaseConfig):
    DEBUG = False


def load_config(app):
    env = os.getenv("FLASK_ENV", "development").lower()
    if env == "production":
        app.config.from_object(ProdConfig)
    elif env == "testing":
        app.config.from_object(TestConfig)
    else:
        app.config.from_object(DevConfig)
