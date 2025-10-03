# Fullstack Challenge – Monorepo (V2) [![API Docs](https://img.shields.io/badge/Swagger-OpenAPI%203-blue?logo=swagger)](http://localhost:5000/apidocs)

> **Estado:** V2 completado (endpoints, manejo de errores, paginación, Swagger y colección Postman).  
> **Meta de proyecto:** llegar hasta V7 con API, UI, extras y deploy.  
> **Stack:** Monorepo (npm workspaces) · Frontend (React + TypeScript + Vite + Bootstrap, React Router 7) · Backend (Flask + SQLAlchemy + Flask-Migrate + Flasgger) · Calidad (Ruff) · DX (ESLint/Prettier, concurrently).

---

## ¿Qué incluye la V2?

- ✅ **Endpoints** implementados:
  - `POST /users` (crear usuario)
  - `GET /users` (listar con paginación)
  - `GET /users/<id>/orders` (pedidos de un usuario)
  - `POST /orders` (crear pedido)
  - `GET /orders` (listar con paginación e **incluye datos del usuario**)
- ✅ **Manejo de errores JSON** consistente (`{"error": {"code","message","details?"}}`) con códigos `400/404/409/422/500`.
- ✅ **Paginación** común (`page`, `limit`, tope 100) y metadatos `{ total, pages }` en listados.
- ✅ **Swagger UI** accesible en **`/apidocs`** (via **Flasgger**)
- ✅ **Colección Postman** + **Environment local** (variable `baseUrl`).

> **Importante:** en `Order`, el campo **`amount`** es **importe** (no cantidad). Está definido como `Numeric(10,2)` y debe ser **> 0** (mín. sugerido `0.01`).

---

## Requisitos (sin cambios)

- **Node** ≥ 18 (ideal 20)
- **npm** ≥ 9
- **Python** 3.11 (o 3.10+)
- **Git**

---

## Estructura de carpetas (actualizada en V2)

```
/ (repo raíz)
├─ frontend/                            # React + TS + Vite + Bootstrap + React Router 7
│  ├─ src/
│  │  ├─ App.tsx                        # Layout (Navbar/Footer) + <Outlet/>
│  │  ├─ main.tsx                       # Router declarativo
│  │  └─ pages/
│  │     ├─ Users.tsx
│  │     └─ Orders.tsx
│  ├─ .env.example
│  └─ package.json
├─ backend/                             # Flask app factory + CORS + /health + API V2
│  ├─ app/
│  │  ├─ __init__.py                    # + Swagger(app) (UI en /apidocs)
│  │  ├─ config.py                      # Dev/Test/Prod
│  │  ├─ extensions.py                  # db, migrate, cors
│  │  ├─ errors.py                      # helpers y handlers JSON
│  │  ├─ api/
│  │  │  ├─ health.py                   # GET /health
│  │  │  ├─ users.py                    # POST/GET users, GET users/:id/orders
│  │  │  └─ orders.py                   # POST/GET orders (incl. user)
│  │  ├─ models/
│  │  │  ├─ __init__.py
│  │  │  ├─ user.py
│  │  │  └─ order.py
│  │  ├─ seeds/seed_basic.py            # comando CLI: seed básico
│  │  └─ cli.py                         # register_cli(app): agrega comandos (seed)
│  ├─ migrations/
│  ├─ .env.example
│  ├─ pyproject.toml
│  ├─ requirements.txt                  # incluye flasgger
│  ├─ wsgi.py
│  └─ package.json
├─ infra/
│  └─ postman/                          # colección y environment
│     ├─ fullstack-challenge.postman_collection.json
│     └─ fullstack-challenge-local.postman_environment.json
├─ package.json                         # workspaces + scripts raíz (dev, lint, format)
├─ .gitignore
└─ README.md
```

---

## Instalación

1. **Instalar dependencias del monorepo**

```bash
npm install
```

2. **Frontend**

```bash
cp frontend/.env.example frontend/.env.local
# Ajusta VITE_API_BASE_URL si cambias el puerto o la URL del backend
```

3. **Backend**

```bash
cd backend
python -m venv .venv
# macOS/Linux
source .venv/bin/activate
# Windows (Git Bash)
source .venv/Scripts/activate

pip install -r requirements.txt   # Asegúrate de tener flasgger instalado
cp .env.example .env
cd ..
```

> ⚠️ **Windows**: activa siempre el _venv_ antes de ejecutar la API o scripts que invoquen `flask`.

---

## Ejecutar en desarrollo

### Opción A — Un solo comando (recomendado)

1. Activa el virtualenv del backend en la **misma terminal** que usarás para `npm run dev`:

```bash
cd backend
# macOS/Linux
source .venv/bin/activate
# Windows (Git Bash)
source .venv/Scripts/activate
cd ..
```

2. En la **raíz del repo**:

```bash
npm run dev
```

- **API**: `http://localhost:5000`
- **Web**: `http://localhost:5173`

### Opción B — Dos terminales

- Backend:
  ```bash
  cd backend
  source .venv/Scripts/activate      # o source .venv/bin/activate
  npm run api
  ```
- Frontend:
  ```bash
  cd frontend
  npm run dev
  ```

---

## Documentación de API (Swagger)

- Accede con el badge (arriba) o abre **`http://localhost:5000/apidocs`**.
- Verás los grupos **Users** y **Orders** con parámetros, cuerpos y respuestas.
- Podés ejecutar requests desde la UI.
- **Deploy:** si publicas tu backend, cambia el enlace del badge a la URL pública (`https://tu-backend/apidocs`).

---

## Colección Postman (V2)

### Archivos en el repo

- **Colección:** [`infra/postman/fullstack-challenge.postman_collection.json`](infra/postman/fullstack-challenge.postman_collection.json)
- **Environment local:** [`infra/postman/fullstack-challenge-local.postman_environment.json`](infra/postman/fullstack-challenge-local.postman_environment.json)

### Importación en Postman

1. **File → Import** y selecciona ambos archivos.
2. En **Environments**, elige **“Fullstack Challenge – Local”** (define `{{baseUrl}}` = `http://localhost:5000`).

### Orden sugerido de requests

1. `Health / GET /health`
2. `Users / POST /users (create)` → guarda `lastUserId` como variable de colección
3. `Orders / POST /orders (create)` → usa `{{lastUserId}}` y **amount** (decimal), ej. `12.50`
4. `Orders / GET /orders`
5. `Users / GET /users/:id/orders`

> **Notas:**
>
> - `POST /orders` valida que `amount` sea **número > 0**.
> - Los listados aceptan `?page=` y `?limit=` (máx. 100).
> - Los errores se devuelven con estructura `{"error": {"code","message"}}`.

---

## Verificación rápida (V2)

- `GET /health` → `{"status": "ok"}`
- `POST /users` → 201 con `{id, name, email, created_at}`
- `POST /orders` → 201 con `{id, user_id, product_name, amount, created_at}` (`amount` **decimal**)
- `GET /orders` → 200 con `items[]` que **incluyen `user`**
- `GET /users/:id/orders` → 200 con `items[]` del usuario

---

## Scripts útiles

**Raíz – `package.json`**

```jsonc
{
  "scripts": {
    "dev": "concurrently -n api,web -c auto \"npm:api -w backend\" \"npm:dev -w frontend\"",
    "lint": "npm run -w backend lint && npm run -w frontend lint",
    "format": "prettier -w .",
  },
}
```

**Frontend – `frontend/package.json`**

```jsonc
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .ts,.tsx",
  },
}
```

**Backend – `backend/package.json`**

```jsonc
{
  "scripts": {
    "api": "flask --app app:create_app run --debug --port 5000",
    "lint": "ruff check app",
    "fmt": "ruff format app",
  },
}
```

---

## Changelog

- **V2**
  - Endpoints Users/Orders con paginación y errores JSON.
  - `amount` como **importe decimal** (`Numeric(10,2)`) con validación `> 0`.
  - Swagger UI en `/apidocs` + **badge** en README.
  - Colección Postman y Environment local en `infra/postman/`.
- **V1**
  - Modelos, migraciones, validaciones básicas y seed.
- **V0**
  - Setup monorepo, front y back mínimos, Ruff, `/health`.

---

## Solución de problemas (FAQ)

- **Flask no se encuentra / API no arranca** → activa el virtualenv antes de `npm run dev` o `npm run api -w backend`.
- **CORS** → revisa `CORS_ORIGINS` en `backend/.env` (por defecto `http://localhost:5173`).
- **Puertos ocupados** → cambia `--port` en el script de backend o el puerto de Vite (`--port 5174`).
- **Recrear DB en dev** → `rm backend/app.db && flask --app app:create_app db upgrade && flask --app app:create_app seed-basic`.

---

## Licencia

ISCL (Internet Systems Consortium License).
