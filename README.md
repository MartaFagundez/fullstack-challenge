# Fullstack Challenge – Monorepo (V3) [![API Docs](https://img.shields.io/badge/Swagger-OpenAPI%203-blue?logo=swagger)](http://localhost:5000/apidocs)

> **Estado:** V3 completado (UI mínima: formularios y listas para Usuarios y Órdenes).  
> **Meta de proyecto:** llegar hasta V7 con API, UI, extras y deploy.  
> **Stack:** Monorepo (npm workspaces) · Frontend (React + TypeScript + Vite + Bootstrap, React Router 7) · Backend (Flask + SQLAlchemy + Flask‑Migrate + Flasgger) · Calidad (Ruff) · DX (ESLint/Prettier, concurrently).

---

## ¿Qué incluye la V3?

- ✅ **UI mínima usable** (responsive, Bootstrap).
- ✅ **Usuarios**
  - Formulario para crear usuario (name, email).
  - Tabla paginada para listar usuarios.
- ✅ **Órdenes**
  - Formulario para crear orden (usuario, producto, **importe**).
  - Tabla paginada con join de usuario (muestra nombre y email).
- ✅ **Cliente HTTP con `fetch` tipado** + **tipos compartidos**.
- ✅ **Manejo de estados**: loading y errores visibles (alerts/spinners).
- ✅ Se mantiene todo lo de **V2**: endpoints, errores JSON, paginación, Swagger y Postman.

> **Importante:** en `Order`, el campo **`amount`** representa el **importe** (decimal). En la base está como `Numeric(10,2)` y debe ser **> 0**.

---

## Requisitos (sin cambios)

- **Node** ≥ 18 (ideal 20)
- **npm** ≥ 9
- **Python** 3.11 (o 3.10+)
- **Git**

---

## Estructura de carpetas (actualizada en V3)

```
/ (repo raíz)
├─ frontend/                            # React + TS + Vite + Bootstrap + React Router 7
│  ├─ src/
│  │  ├─ App.tsx                        # Layout (Navbar/Footer) + <Outlet/>
│  │  ├─ main.tsx                       # Router declarativo
│  │  ├─ types/
│  │  │  └─ api.ts                      # Tipos compartidos de la API
│  │  ├─ services/
│  │  │  └─ api.ts                      # Cliente fetch tipado
│  │  ├─ utils/
│  │  │  └─ number.ts                   # parse/format del importe
│  │  ├─ components/
│  │  │  ├─ feedback/
│  │  │  │  ├─ InlineError.tsx
│  │  │  │  └─ SmallSpinner.tsx
│  │  │  ├─ forms/
│  │  │  │  ├─ CreateUserForm.tsx
│  │  │  │  └─ CreateOrderForm.tsx
│  │  │  └─ tables/
│  │  │     ├─ UsersTable.tsx
│  │  │     └─ OrdersTable.tsx
│  │  └─ pages/
│  │     ├─ Users.tsx                   # compone form + table
│  │     └─ Orders.tsx                  # compone form + table
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
│  │  │  └─ order.py                    # amount = Numeric(10,2) (importe)
│  │  ├─ seeds/seed_basic.py
│  │  └─ cli.py
│  ├─ migrations/
│  ├─ .env.example
│  ├─ pyproject.toml
│  ├─ requirements.txt
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

pip install -r requirements.txt
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
- Grupos **Users** y **Orders** con parámetros, cuerpos y respuestas.
- Podés ejecutar requests desde la UI.

---

## Colección Postman

### Archivos en el repo

- **Colección:** [`infra/postman/fullstack-challenge.postman_collection.json`](infra/postman/fullstack-challenge.postman_collection.json)
- **Environment local:** [`infra/postman/fullstack-challenge-local.postman_environment.json`](infra/postman/fullstack-challenge-local.postman_environment.json)

### Importación en Postman

1. **File → Import** y selecciona ambos archivos.
2. En **Environments**, elige **“Fullstack Challenge – Local”** (define `{{baseUrl}}` = `http://localhost:5000`).

### Orden sugerido de requests

1. `Health / GET /health`
2. `Users / POST /users (create)` → guarda `lastUserId` como variable de colección
3. `Orders / POST /orders (create)` → usa `{{lastUserId}}` y **importe** (decimal), ej. `12.50`
4. `Orders / GET /orders`
5. `Users / GET /users/:id/orders`

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

- **V3**
  - UI con formularios y tablas (Usuarios / Órdenes), `fetch` tipado, manejo de loading/errores, responsive.
- **V2**
  - Endpoints Users/Orders con paginación y errores JSON. Swagger en `/apidocs`. Colección Postman.
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
