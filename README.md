# Fullstack Challenge – Monorepo (V1)

> **Estado:** V1 completado (modelos, migraciones, validaciones y seed básico).  
> **Meta de proyecto:** llegar hasta V7 con API, UI, extras y deploy.  
> **Stack:** Monorepo (npm workspaces) · Frontend (React + TypeScript + Vite + Bootstrap, React Router 7) · Backend (Flask + SQLAlchemy + Flask‑Migrate) · Calidad (Ruff) · DX (ESLint/Prettier, concurrently).

---

## ¿Qué incluye la V1?

- ✅ **Modelos** `User` y `Order` con relación **1—N**.
- ✅ **Validaciones** de negocio:
  - `User.email` **único**, **normalizado a lowercase** y validado por **regex**.
  - `Order.amount > 0` mediante **CheckConstraint**.
- ✅ **Timestamps** (`created_at`) con `server_default=func.now()`.
- ✅ **Migraciones** iniciales creadas y aplicadas (Flask‑Migrate).
- ✅ **Seed básico** (CLI) con 2 usuarios y 3 pedidos.
- ✅ Mantiene todo lo de **V0** (app factory, `/health`, CORS, Bootstrap en el front, Ruff, ESLint/Prettier, scripts de DX).

> **No incluido todavía:** endpoints de negocio, Swagger, UI con formularios/listas, tests. Se agregará desde V2 en adelante.

---

## Requisitos

- **Node** ≥ 18 (ideal 20)
- **npm** ≥ 9
- **Python** 3.11 (o 3.10+)
- **Git**
- **Backend deps** (pinned):
  - Flask **3.1.2**
  - Flask‑SQLAlchemy **3.1.1** (SQLAlchemy **2.0.43**)
  - Flask‑Migrate **4.1.0**
  - Flask‑Cors **6.0.1**
  - python‑dotenv **1.1.1**
  - ruff **0.13.3**

---

## Estructura de carpetas (actualizada)

```
/ (repo raíz)
├─ frontend/                            # React + TS + Vite + Bootstrap + React Router 7
│  ├─ src/
│  │  ├─ App.tsx                        # Layout + <Outlet/>
│  │  ├─ main.tsx                       # Router en modo declarativo
│  │  └─ pages/
│  │     ├─ Users.tsx
│  │     └─ Orders.tsx
│  ├─ .env.example
│  └─ package.json
├─ backend/                             # Flask app factory + CORS + /health + modelos V1
│  ├─ app/
│  │  ├─ __init__.py                    # create_app() + registro CLI / errores
│  │  ├─ config.py                      # Dev/Test/Prod
│  │  ├─ extensions.py                  # db, migrate, cors
│  │  ├─ errors.py                      # handlers JSON 404/500
│  │  ├─ api/health.py                  # GET /health
│  │  ├─ models/
│  │  │  ├─ __init__.py                 # exporta User/Order
│  │  │  ├─ user.py
│  │  │  └─ order.py
│  │  ├─ seeds/seed_basic.py            # comando CLI: seed básico
│  │  └─ cli.py                         # register_cli(app): agrega comandos (seed)
│  ├─ migrations/                       # (autogenerado por Flask-Migrate)
│  ├─ .env.example
│  ├─ pyproject.toml                    # Configuración de Ruff
│  ├─ requirements.txt
│  ├─ wsgi.py
│  └─ package.json                      # scripts npm para backend
├─ package.json                         # workspaces + scripts raíz (dev, lint, format)
├─ .gitignore
└─ README.md                            # este archivo
```

---

## Instalación (sin cambios respecto a V0)

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

pip install -r requirements.txt
cp .env.example .env
cd ..
```

> ⚠️ **Windows**: activa siempre el _venv_ antes de ejecutar la API o scripts que invoquen `flask`.

---

## Migraciones y base de datos (V1)

> Ejecuta todo **dentro** del directorio `backend/` con el **venv activo**.

### Inicializar (solo la primera vez)

```bash
flask --app app:create_app db init
```

### Generar migración de V1 y aplicar

```bash
flask --app app:create_app db migrate -m "V1: users & orders models, constraints"
flask --app app:create_app db upgrade
```

> Se crea `app.db` (SQLite en dev) y las tablas `users` / `orders` con sus índices y restricciones.

---

## Seed básico (V1)

Comando CLI para insertar datos mínimos (idempotente simple):

```bash
flask --app app:create_app seed-basic
```

Qué crea:

- Usuarios: **Ada Lovelace**, **Alan Turing** (emails únicos).
- Pedidos: 3 registros de ejemplo asociados a esos usuarios.

Verificación rápida en shell interactiva:

```bash
flask --app app:create_app shell
>>> from app.models import User, Order
>>> User.query.count(), Order.query.count()
```

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

## Verificación rápida

- `http://localhost:5000/health` → `{"status":"ok"}`
- DB con tablas: `users`, `orders` (y `migrations` creada).
- Seed ejecutado (opcional): conteos > 0.

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

## Decisiones y validaciones (detalle técnico)

- **Email único + formato**
  - `unique=True` e `index=True` en columna `email`.
  - Normalización a **lowercase** y regex básica (`^[^@\s]+@[^@\s]+\.[^@\s]+$`) en `@validates("email")`.
- **Precio (amount) positivo**
  - `CheckConstraint("amount > 0", name="ck_orders_amount_positive")` en `Order`.
- **Relación y borrado**
  - `User.orders` con `cascade="all, delete-orphan"` y FK `ondelete="CASCADE"` en `Order`.
- **Timestamps**
  - `server_default=func.now()` en `created_at` (seteado por la base de datos).
- **Ruff (0.13.3)**
  - Config en `pyproject.toml` usando bloques `[tool.ruff]` y `[tool.ruff.lint]`.
  - `ruff check app` y `ruff format app` como comandos principales.

---

## Roadmap (siguientes versiones)

- **V2**: endpoints requeridos (CRUDs mínimos), manejo de errores global y **Swagger/OpenAPI** + colección Postman/HTTP.
- **V3**: UI mínima (forms/listas) con `fetch` nativo, loading/errors, responsive completo.
- **V4**: Context API, React Hook Form + Zod, búsquedas y detalle de usuario.
- **V5**: seeds ricos (Faker), export/import JSON.
- **V6**: tests (pytest + Vitest/RTL) y CI (GitHub Actions).
- **V7**: deploy (Render/Heroku + Vercel) y correlación simple de logs.

---

## Solución de problemas (FAQ)

- **Flask no se encuentra / API no arranca** → activa el virtualenv antes de `npm run dev` o `npm run api -w backend`.
- **CORS** → revisa `CORS_ORIGINS` en `backend/.env` (por defecto `http://localhost:5173`).
- **Puertos ocupados** → cambia `--port` en el script de backend o el puerto de Vite (`--port 5174`).
- **Recrear DB en dev** → `rm backend/app.db && flask --app app:create_app db upgrade && flask --app app:create_app seed-basic`.

---

## Licencia

ISCL (Internet Systems Consortium License).
