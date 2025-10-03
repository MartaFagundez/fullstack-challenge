# app/api/orders.py
from flask import Blueprint, request, jsonify
from sqlalchemy.orm import selectinload
from ..extensions import db
from ..models import Order, User
from ..errors import make_error
from flasgger import swag_from

bp = Blueprint("orders", __name__)

def parse_pagination():
    from flask import request
    try:
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
    except ValueError:
        from ..errors import make_error
        return None, None, make_error(400, "bad_request", "page y limit deben ser enteros")
    page = max(1, page)
    limit = min(max(1, limit), 100)
    return page, limit, None

@bp.post("/orders")
@swag_from({
  "tags": ["Orders"],
  "summary": "Crear pedido",
  "consumes": ["application/json"],
  "parameters": [{
    "in": "body",
    "name": "body",
    "required": True,
    "schema": {
      "type": "object",
      "required": ["user_id", "product_name", "amount"],
      "properties": {
        "user_id": {"type": "integer"},
        "product_name": {"type": "string"},
        "amount": {"type": "number", "minimum": 0.01}
      }
    }
  }],
  "responses": {"201": {"description": "Creado"}, "422": {"description": "Validación fallida"}}
})
def create_order():
    data = request.get_json(silent=True)
    if not data:
        return make_error(400, "invalid_json", "Se esperaba JSON")

    user_id = data.get("user_id")
    product_name = (data.get("product_name") or "").strip()
    amount = data.get("amount")

    if not isinstance(user_id, int) or not product_name or not isinstance(amount, (int, float)):
        return make_error(422, "validation_error", "user_id (int), product_name y amount (number) son obligatorios")
    if amount <= 0:
        return make_error(422, "validation_error", "amount debe ser > 0")

    user = User.query.get(user_id)
    if not user:
        return make_error(422, "validation_error", "user_id no existe")

    order = Order(user_id=user_id, product_name=product_name, amount=amount)
    db.session.add(order)
    db.session.commit()

    return jsonify({
        "id": order.id,
        "user_id": order.user_id,
        "product_name": order.product_name,
        "amount": order.amount,
        "created_at": order.created_at.isoformat()
    }), 201

@bp.get("/orders")
@swag_from({
  "tags": ["Orders"],
  "summary": "Listar pedidos (paginado, incluye usuario)",
  "parameters": [
    {"in": "query", "name": "page", "type": "integer", "default": 1},
    {"in": "query", "name": "limit", "type": "integer", "default": 10}
  ],
  "responses": {"200": {"description": "OK"}}
})
def list_orders():
    page, limit, err = parse_pagination()
    if err: return err

    query = (Order.query
             .options(selectinload(Order.user))
             .order_by(Order.created_at.desc()))
    total = query.count()
    items = query.offset((page-1)*limit).limit(limit).all()

    data = [{
        "id": o.id,
        "user_id": o.user_id,
        "product_name": o.product_name,
        "amount": o.amount,
        "created_at": o.created_at.isoformat(),
        "user": {
            "id": o.user.id,
            "name": o.user.name,
            "email": o.user.email
        } if o.user else None
    } for o in items]

    return jsonify({
        "items": data,
        "page": page,
        "limit": limit,
        "total": total,
        "pages": (total + limit - 1)//limit
    }), 200
