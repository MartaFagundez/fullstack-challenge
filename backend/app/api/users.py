# app/api/users.py
from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func
from ..extensions import db
from ..models import User, Order
from ..errors import make_error
from flasgger import swag_from

bp = Blueprint("users", __name__)

def parse_pagination():
    try:
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
    except ValueError:
        return None, None, make_error(400, "bad_request", "page y limit deben ser enteros")
    page = max(1, page)
    limit = min(max(1, limit), 100)
    return page, limit, None

@bp.post("/users")
@swag_from({
  "tags": ["Users"],
  "summary": "Crear usuario",
  "consumes": ["application/json"],
  "parameters": [{
    "in": "body",
    "name": "body",
    "required": True,
    "schema": {
      "type": "object",
      "required": ["name", "email"],
      "properties": {
        "name": {"type": "string"},
        "email": {"type": "string", "format": "email"}
      }
    }
  }],
  "responses": {
    "201": {"description": "Creado"},
    "400": {"description": "JSON inválido"},
    "422": {"description": "Validación fallida"},
    "409": {"description": "Email duplicado"}
  }
})
def create_user():
    data = request.get_json(silent=True)
    if not data:
        return make_error(400, "invalid_json", "Se esperaba JSON")

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()

    if not name or not email:
        return make_error(422, "validation_error", "name y email son obligatorios")
    # Validación simple de email (complementa a la del modelo)
    if "@" not in email or "." not in email:
        return make_error(422, "validation_error", "Formato de email inválido")

    try:
        user = User(name=name, email=email)
        db.session.add(user)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return make_error(409, "duplicate_email", "El email ya existe")

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "created_at": user.created_at.isoformat()
    }), 201

@bp.get("/users")
@swag_from({
  "tags": ["Users"],
  "summary": "Listar usuarios (paginado)",
  "parameters": [
    {"in": "query", "name": "page", "type": "integer", "default": 1},
    {"in": "query", "name": "limit", "type": "integer", "default": 10}
  ],
  "responses": {"200": {"description": "OK"}}
})
def list_users():
    page, limit, err = parse_pagination()
    if err: return err

    query = User.query.order_by(User.created_at.desc())
    total = query.count()
    items = query.offset((page-1)*limit).limit(limit).all()

    data = [{
        "id": u.id,
        "name": u.name,
        "email": u.email,
        "created_at": u.created_at.isoformat(),
    } for u in items]

    return jsonify({
        "items": data,
        "page": page,
        "limit": limit,
        "total": total,
        "pages": (total + limit - 1)//limit
    }), 200

@bp.get("/users/<int:user_id>/orders")
@swag_from({
  "tags": ["Users"],
  "summary": "Listar pedidos de un usuario",
  "parameters": [{"in": "path", "name": "user_id", "type": "integer", "required": True}],
  "responses": {"200": {"description": "OK"}, "404": {"description": "Usuario no encontrado"}}
})
def list_user_orders(user_id: int):
    user = User.query.get(user_id)
    if not user:
        return make_error(404, "user_not_found", "Usuario no encontrado")

    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    data = [{
        "id": o.id,
        "user_id": o.user_id,
        "product_name": o.product_name,
        "amount": o.amount,
        "created_at": o.created_at.isoformat()
    } for o in orders]
    return jsonify({"items": data, "total": len(data)}), 200
