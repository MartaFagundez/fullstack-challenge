from flask import Blueprint, jsonify, request
from decimal import Decimal
from ..models.user import User
from ..models.order import Order
from ..extensions import db
from ..errors import make_error
from flasgger import swag_from

bp = Blueprint("io", __name__)

def serialize_user(u: User) -> dict:
    return {
        "id": u.id,
        "name": u.name,
        "email": u.email,
        "created_at": u.created_at.isoformat(),
    }

def serialize_order(o: Order) -> dict:
    # asegura serialización de Decimal
    amount = float(o.amount) if isinstance(o.amount, Decimal) else o.amount
    return {
        "id": o.id,
        "user_id": o.user_id,
        "product_name": o.product_name,
        "amount": amount,
        "created_at": o.created_at.isoformat(),
    }

# -------- EXPORT --------

@bp.get("/export/users")
def export_users():
    """Exportar todos los usuarios
    ---
    tags:
      - Export
    summary: Exportar todos los usuarios de la base de datos
    description: Retorna una lista de todos los usuarios ordenados por ID de forma ascendente
    responses:
      200:
        description: Lista de usuarios exportada exitosamente
        content:
          application/json:
            schema:
              type: object
              properties:
                items:
                  type: array
                  items:
                    type: object
                    properties:
                      id:
                        type: integer
                        description: ID del usuario
                      name:
                        type: string
                        description: Nombre del usuario
                      email:
                        type: string
                        description: Email del usuario
                      created_at:
                        type: string
                        format: date-time
                        description: Fecha y hora de creación del usuario
    """
    users = User.query.order_by(User.id.asc()).all()
    return jsonify({"items": [serialize_user(u) for u in users]})

@bp.get("/export/orders")
def export_orders():
    """Exportar todas las órdenes
    ---
    tags:
      - Export
    summary: Exportar todas las órdenes de la base de datos
    description: Retorna una lista de todas las órdenes ordenadas por ID de forma ascendente
    responses:
      200:
        description: Lista de órdenes exportada exitosamente
        content:
          application/json:
            schema:
              type: object
              properties:
                items:
                  type: array
                  items:
                    type: object
                    properties:
                      id:
                        type: integer
                        description: ID de la orden
                      user_id:
                        type: integer
                        description: ID del usuario que realizó la orden
                      product_name:
                        type: string
                        description: Nombre del producto ordenado
                      amount:
                        type: number
                        format: float
                        description: Monto de la orden
                      created_at:
                        type: string
                        format: date-time
                        description: Fecha y hora de creación de la orden
    """
    orders = Order.query.order_by(Order.id.asc()).all()
    return jsonify({"items": [serialize_order(o) for o in orders]})

@bp.get("/export/all")
def export_all():
    """Exportar todos los usuarios y órdenes
    ---
    tags:
      - Export
    summary: Exportar todos los usuarios y órdenes de la base de datos
    description: Retorna tanto usuarios como órdenes en una sola respuesta, útil para exportación completa de datos
    responses:
      200:
        description: Todos los datos exportados exitosamente
        content:
          application/json:
            schema:
              type: object
              properties:
                users:
                  type: array
                  items:
                    type: object
                    properties:
                      id:
                        type: integer
                        description: ID del usuario
                      name:
                        type: string
                        description: Nombre del usuario
                      email:
                        type: string
                        description: Email del usuario
                      created_at:
                        type: string
                        format: date-time
                        description: Fecha y hora de creación del usuario
                orders:
                  type: array
                  items:
                    type: object
                    properties:
                      id:
                        type: integer
                        description: ID de la orden
                      user_id:
                        type: integer
                        description: ID del usuario que realizó la orden
                      product_name:
                        type: string
                        description: Nombre del producto ordenado
                      amount:
                        type: number
                        format: float
                        description: Monto de la orden
                      created_at:
                        type: string
                        format: date-time
                        description: Fecha y hora de creación de la orden
    """
    users = User.query.order_by(User.id.asc()).all()
    orders = Order.query.order_by(Order.id.asc()).all()
    return jsonify({
        "users": [serialize_user(u) for u in users],
        "orders": [serialize_order(o) for o in orders],
    })

# -------- IMPORT --------
# Diseño minimalista: espera {"items":[...]}.
# - /import/users: crea usuarios nuevos; ignora "id"; saltea duplicados por email.
# - /import/orders: requiere user_id existente; "amount" > 0 (number); ignora "id".

@bp.post("/import/users")
@swag_from({
  "tags": ["Import"],
  "summary": "Importar usuarios desde datos JSON",
  "description": "Crea nuevos usuarios desde los datos proporcionados. Omite duplicados basados en email e ignora entradas inválidas.",
  "consumes": ["application/json"],
  "parameters": [{
    "in": "body",
    "name": "body",
    "required": True,
    "schema": {
      "type": "object",
      "required": ["items"],
      "properties": {
        "items": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["name", "email"],
            "properties": {
              "name": {
                "type": "string",
                "description": "Nombre del usuario (requerido, no vacío)",
                "example": "Juan Pérez"
              },
              "email": {
                "type": "string",
                "format": "email",
                "description": "Email del usuario (requerido, único)",
                "example": "juan.perez@example.com"
              },
              "id": {
                "type": "integer",
                "description": "ID del usuario (ignorado durante la importación)"
              },
              "created_at": {
                "type": "string",
                "format": "date-time",
                "description": "Fecha de creación (ignorada durante la importación)"
              }
            }
          }
        }
      }
    }
  }],
  "responses": {
    "201": {
      "description": "Usuarios importados exitosamente",
      "schema": {
        "type": "object",
        "properties": {
          "created": {
            "type": "integer",
            "description": "Número de usuarios creados"
          },
          "skipped": {
            "type": "integer",
            "description": "Número de usuarios omitidos (duplicados o inválidos)"
          }
        }
      }
    },
    "400": {
      "description": "Formato JSON inválido",
      "schema": {
        "type": "object",
        "properties": {
          "error": {
            "type": "string",
            "description": "Tipo de error"
          },
          "message": {
            "type": "string",
            "description": "Descripción del error"
          }
        }
      }
    }
  }
})
def import_users():
    data = request.get_json(silent=True) or {}
    items = data.get("items")
    if not isinstance(items, list):
        return make_error(400, "invalid_json", "Se esperaba { items: [] }")

    created, skipped = 0, 0
    for it in items:
        name = (it.get("name") or "").strip()
        email = (it.get("email") or "").strip().lower()
        if not name or not email:
            skipped += 1
            continue
        # saltear si email existe
        if User.query.filter_by(email=email).first():
            skipped += 1
            continue
        u = User(name=name, email=email)
        db.session.add(u)
        created += 1
    db.session.commit()
    return jsonify({"created": created, "skipped": skipped}), 201

@bp.post("/import/orders")
@swag_from({
  "tags": ["Import"],
  "summary": "Importar órdenes desde datos JSON",
  "description": "Crea nuevas órdenes desde los datos proporcionados. Requiere user_id existente y monto positivo. Omite entradas inválidas.",
  "consumes": ["application/json"],
  "parameters": [{
    "in": "body",
    "name": "body",
    "required": True,
    "schema": {
      "type": "object",
      "required": ["items"],
      "properties": {
        "items": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["user_id", "product_name", "amount"],
            "properties": {
              "user_id": {
                "type": "integer",
                "description": "ID del usuario existente (requerido)",
                "example": 1
              },
              "product_name": {
                "type": "string",
                "description": "Nombre del producto (requerido, no vacío)",
                "example": "Laptop"
              },
              "amount": {
                "type": "number",
                "format": "float",
                "minimum": 0.01,
                "description": "Monto de la orden (requerido, debe ser > 0)",
                "example": 999.99
              },
              "id": {
                "type": "integer",
                "description": "ID de la orden (ignorado durante la importación)"
              },
              "created_at": {
                "type": "string",
                "format": "date-time",
                "description": "Fecha de creación (ignorada durante la importación)"
              }
            }
          }
        }
      }
    }
  }],
  "responses": {
    "201": {
      "description": "Órdenes importadas exitosamente",
      "schema": {
        "type": "object",
        "properties": {
          "created": {
            "type": "integer",
            "description": "Número de órdenes creadas"
          },
          "skipped": {
            "type": "integer",
            "description": "Número de órdenes omitidas (user_id inválido, monto inválido, o datos inválidos)"
          }
        }
      }
    },
    "400": {
      "description": "Formato JSON inválido",
      "schema": {
        "type": "object",
        "properties": {
          "error": {
            "type": "string",
            "description": "Tipo de error"
          },
          "message": {
            "type": "string",
            "description": "Descripción del error"
          }
        }
      }
    }
  }
})
def import_orders():
    data = request.get_json(silent=True) or {}
    items = data.get("items")
    if not isinstance(items, list):
        return make_error(400, "invalid_json", "Se esperaba { items: [] }")

    created, skipped = 0, 0
    for it in items:
        try:
            user_id = int(it.get("user_id"))
            product_name = (it.get("product_name") or "").strip()
            amount = float(it.get("amount"))
        except Exception:
            skipped += 1
            continue

        if not product_name or amount <= 0:
            skipped += 1
            continue

        user = User.query.get(user_id)
        if not user:
            skipped += 1
            continue

        o = Order(user_id=user_id, product_name=product_name, amount=amount)
        db.session.add(o)
        created += 1

    db.session.commit()
    return jsonify({"created": created, "skipped": skipped}), 201
