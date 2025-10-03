# app/errors.py
from flask import jsonify

def make_error(status: int, code: str, message: str, details=None):
    payload = {"error": {"code": code, "message": message}}
    if details is not None:
        payload["error"]["details"] = details
    return jsonify(payload), status

def register_error_handlers(app):
    @app.errorhandler(400)
    def bad_request(e):
        return make_error(400, "bad_request", getattr(e, "description", "Bad request"))

    @app.errorhandler(404)
    def not_found(e):
        return make_error(404, "not_found", "Not found")

    @app.errorhandler(500)
    def server_error(e):
        return make_error(500, "server_error", "Internal server error")
    
# En los endpoints devolveremos 422 para validaciones de negocio.
