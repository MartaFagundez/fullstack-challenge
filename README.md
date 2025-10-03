# Fullstack Challenge – Monorepo (V0)

> **Estado:** V0 completado (base de desarrollo).  
> **Meta de proyecto:** llegar hasta V7 con API, UI, extras y deploy.  
> **Stack:** Monorepo (npm workspaces) · Frontend (React + TypeScript + Vite + Bootstrap) · Backend (Flask + SQLAlchemy + Flask‑Migrate) · Calidad (Ruff) · DX (ESLint/Prettier, concurrently).

---

## Contenido de V0

- ✅ **Monorepo** con `npm workspaces` (carpetas `frontend/` y `backend/`).
- ✅ **Frontend** creado con **Vite + React + TS** y **Bootstrap** (CSS + JS).
- ✅ **Backend** con **Flask app factory**, CORS, manejadores de error JSON y endpoint `GET /health`.
- ✅ **Ruff** como **único** linter/formatter para backend.
- ✅ ESLint + Prettier en el frontend.
- ✅ Scripts centralizados y **concurrency** (levanta API y Web con un solo comando).
- ✅ Archivos `.env.example` (front y back).

> **No incluido a propósito en V0:** modelos/migraciones, endpoints de negocio, tests. Se agregan en versiones posteriores.

---

## Requisitos

- **Node** ≥ 18 (ideal 20)
- **npm** ≥ 9
- **Python** 3.11 (o 3.10+)
- **Git**

---

## Estructura de carpetas

```
/ (repo raíz)
├─ frontend/                  # React + TS + Vite + Bootstrap
│  ├─ src/
│  │  ├─ App.tsx              # Layout base
│  │  ├─ main.tsx             # Router + import Bootstrap
│  │  └─ pages/
│  │     ├─ Users.tsx
│  │     └─ Orders.tsx
│  ├─ .env.example
│  └─ package.json
├─ backend/                   # Flask app factory + CORS + /health
│  ├─ app/
│  │  ├─ __init__.py          # create_app()
│  │  ├─ config.py            # Dev/Test/Prod
│  │  ├─ extensions.py        # db, migrate, cors
│  │  ├─ errors.py            # handlers JSON 404/500
│  │  └─ api/health.py        # GET /health
│  ├─ .env.example
│  ├─ pyproject.toml          # Configuración de Ruff
│  ├─ requirements.txt
│  ├─ wsgi.py
│  └─ package.json            # scripts npm para backend
├─ package.json               # workspaces + scripts raiz (dev, lint, format)
├─ .gitignore
└─ README.md                  # este archivo
```

---

## Instalación

1. **Clonar e instalar dependencias del monorepo**

   ```bash
   npm install
   ```

2. **Frontend**
   - Variables de entorno:
     ```bash
     cp frontend/.env.example frontend/.env.local
     # Ajusta si cambia el puerto o la URL del backend
     ```

3. **Backend**
   - Crear **virtualenv** e instalar dependencias:

     ```bash
     cd backend
     python -m venv .venv
     # macOS/Linux
     source .venv/bin/activate
     # Windows con Git Bash
     source .venv/Scripts/activate

     pip install -r requirements.txt
     cp .env.example .env
     cd ..
     ```

> ⚠️ **Importante (Windows):** activa siempre el _venv_ antes de ejecutar la API o los scripts npm que invoquen `flask`.

---

## Ejecutar en desarrollo

### Opción A — Un solo comando (recomendado)

1. Activa el virtualenv del backend en la **misma terminal** que usarás para `npm run dev`:

```bash
cd backend
# macOS/Linux
source .venv/bin/activate
# Windows con Git Bash
source .venv/Scripts/activate
cd ..
```

2. En la **raíz del repo** ejecuta:

```bash
npm run dev
```

Esto lanza:

- **API** en `http://localhost:5000`
- **Web** en `http://localhost:5173`

### Opción B — Dos terminales

- Terminal 1 (backend):

  ```bash
  cd backend
  source .venv/Scripts/activate      # o source .venv/bin/activate
  npm run api
  ```

- Terminal 2 (frontend):
  ```bash
  cd frontend
  npm run dev
  ```

---

## Verificación rápida

- Abre `http://localhost:5173` → verás el layout base con Navbar y el estado de la API.
- La _badge_ “API” debería indicar **ok** (hace ping a `GET /health`).
- `http://localhost:5000/health` → responde `{"status":"ok"}`.

---

## Scripts útiles

**Raíz (monorepo) – `package.json`**

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

## Explicación de la configuración (el “por qué”)

- **npm workspaces**: gestionan _multi‑paquetes_ en un solo repo. Permiten ejecutar scripts con `-w <workspace>` y compartir `node_modules` en la raíz → menos fricción.
- **`private: true`**: evita publicar accidentalmente el monorepo a npm.
- **`concurrently`**: lanza **API** y **Web** con un único `npm run dev` desde la raíz.
- **Bootstrap sin react‑bootstrap**: importamos CSS y el **bundle JS** nativo (`bootstrap.bundle.min.js`) para que funcionen los componentes interactivos (collapse, dropdown, etc.). El marcado se maneja con **clases** de Bootstrap.
- **Flask app factory**: `create_app()` configura extensiones y blueprints por entorno (Dev/Test/Prod). Facilita testing y deploy.
- **CORS**: habilitado mediante `Flask-Cors` con origen por defecto `http://localhost:5173` (ajustable vía `CORS_ORIGINS`).
- **Ruff**: única herramienta de estilo/calidad en backend.
  - En `pyproject.toml` se establecen:
    - `select = ["E","F","I"]` → reglas de **pycodestyle**, **Pyflakes** y **isort** (import sorting).
    - `ruff check app` para **linting**, `ruff format app` para **formatear**.
- **Variables de entorno**:
  - **Frontend**: `VITE_API_BASE_URL` para apuntar al backend en dev/prod.
  - **Backend**: `FLASK_ENV`, `DATABASE_URL`, `CORS_ORIGINS`, `SECRET_KEY`.
- **Endpoint `/health`**: verificación rápida de disponibilidad del backend (usado por la UI en la Navbar).

---

## Roadmap (próximas versiones)

- **V1**: modelos `User`/`Order`, migraciones, validaciones (`email` único/regex, `amount > 0`), seeds.
- **V2**: endpoints CRUD requeridos + errores globales + Swagger.
- **V3**: UI mínima (forms/listas) con `fetch` nativo, loading/errors, responsive completo.
- **V4**: Context API, React Hook Form + Zod, búsquedas y detalle de usuario.
- **V5**: seeds ricos (Faker), export/import JSON.
- **V6**: tests (pytest + Vitest/RTL) y CI (GitHub Actions).
- **V7**: deploy (Render/Heroku + Vercel) y correlación simple de logs.

---

## Solución de problemas (FAQ)

- **La API no arranca / Flask no se encuentra** → activa el virtualenv antes de `npm run dev` o `npm run api -w backend`.
- **CORS al llamar la API** → verifica `CORS_ORIGINS` en el `.env` del backend y que apunte al origen de tu frontend (`http://localhost:5173`).
- **Puertos ocupados** → cambia `--port` en el script del backend o el puerto de Vite (`--port 5174`).

---

## Licencia

ISCL (Internet Systems Consortium License).
