# Fullstack Challenge – Monorepo (V4) [![API Docs](https://img.shields.io/badge/Swagger-OpenAPI%203-blue?logo=swagger)](http://localhost:5000/apidocs)

> **Estado:** V4 completado (Context API de notificaciones, formularios con React Hook Form + Zod, búsquedas simples y toasts).  
> **Meta de proyecto:** llegar hasta V7 con API, UI, extras y deploy.  
> **Stack:** Monorepo (npm workspaces) · Frontend (React + TypeScript + Vite + Bootstrap, React Router 7) · Backend (Flask + SQLAlchemy + Flask‑Migrate + Flasgger) · Calidad (Ruff) · DX (ESLint/Prettier, concurrently).

---

## ¿Qué incluye la V4?

- ✅ **Context API de notificaciones**
- ✅ **Formularios con React Hook Form + Zod** para validación UI
- ✅ **Búsquedas livianas**:
  - `GET /users?q=texto` (filtra por **name/email**).
  - `GET /orders?q=texto` (filtra por **product_name**).
  - Input con **debounce** sencillo.
- ✅ Se mantiene todo lo de **V3**: UI responsive con Bootstrap, tablas paginadas, `fetch` tipado, errores visibles, Swagger, etc.

---

## Requisitos (sin cambios)

- **Node** ≥ 18 (ideal 20)
- **npm** ≥ 9
- **Python** 3.11 (o 3.10+)
- **Git**

---

## Estructura de carpetas (actualizada en V4)

```
/ (repo raíz)
├─ frontend/                          # React + TS + Vite + Bootstrap + React Router 7
│  ├─ src/
│  │  ├─ App.tsx                      # Layout (Navbar/Footer) + <Outlet/>
│  │  ├─ main.tsx                     # Router declarativo + NotificationsProvider
│  │  ├─ types/
│  │  │  └─ api.ts                    # Tipos compartidos de la API
│  │  ├─ services/
│  │  │  └─ api.ts                    # Cliente fetch tipado
│  │  ├─ utils/
│  │  │  └─ number.ts                 # parse/format del importe
│  │  ├─ validation/
│  │  │  └─ schemas.ts                # Esquemas de Zod para forms
│  │  ├─ context/
│  │  │  ├─ Notifications.tsx          # Provider + <Toaster />
│  │  │  └─ notifications-context.ts   # createContext + tipos
│  │  ├─ hooks/
│  │  │  └─ useNotify.ts               # hook que consume el contexto
│  │  ├─ components/
│  │  │  ├─ inputs/
│  │  │  │  └─ DebouncedInput.tsx      # input con debounce
│  │  │  ├─ feedback/
│  │  │  │  ├─ InlineError.tsx
│  │  │  │  └─ SmallSpinner.tsx
│  │  │  ├─ forms/
│  │  │  │  ├─ CreateUserForm.tsx      # React Hook Form + Zod
│  │  │  │  └─ CreateOrderForm.tsx     # React Hook Form + Zod
│  │  │  └─ tables/
│  │  │     ├─ UsersTable.tsx          # lista paginada + búsqueda
│  │  │     └─ OrdersTable.tsx         # lista paginada + búsqueda
│  │  └─ pages/
│  │     ├─ Users.tsx
│  │     └─ Orders.tsx
│  ├─ .env.example
│  └─ package.json
├─ backend/
│  ├─ app/
│  │  ├─ __init__.py                   # Swagger en /apidocs
│  │  ├─ api/
│  │  │  ├─ users.py                   # ahora soporta ?q= (name/email)
│  │  │  └─ orders.py                  # ahora soporta ?q= (product_name)
│  │  ├─ models/
│  │  │  └─ order.py
│  │  └─ ...
├─ infra/postman/
│  ├─ fullstack-challenge.postman_collection.json
│  └─ fullstack-challenge-local.postman_environment.json
└─ ...
```

---

## Instalación / Actualización

1. **Instalar/actualizar dependencias del monorepo**

```bash
npm install
```

2. **Variables de entorno** (si aplica)

```bash
cp frontend/.env.example frontend/.env.local
# Ajusta VITE_API_BASE_URL si cambias el backend
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

### Opción A — Un solo comando

1. Activa el venv del backend en la **misma terminal** que usarás para `npm run dev`:

```bash
cd backend && source .venv/bin/activate  # Windows (Git Bash): source .venv/Scripts/activate
cd ..
```

2. En la **raíz**:

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

- Abre **`http://localhost:5000/apidocs`**.
- Grupos **Users** y **Orders** con parámetros, cuerpos y respuestas.
- Podés ejecutar requests desde la UI.

---

## Colección Postman

- **Colección:** [`infra/postman/fullstack-challenge.postman_collection.json`](infra/postman/fullstack-challenge.postman_collection.json)
- **Environment local:** [`infra/postman/fullstack-challenge-local.postman_environment.json`](infra/postman/fullstack-challenge-local.postman_environment.json)

Importación:

1. **File → Import** y selecciona ambos archivos.
2. En **Environments**, elige **“Fullstack Challenge – Local”** (`{{baseUrl}}` = `http://localhost:5000`).

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

- **V4**
  - Context API para notificaciones (Provider + hook) con **react-hot-toast**.
  - Migración a **React Hook Form + Zod** (`mode: "onTouched"`).
  - Doble esquema para órdenes: `CreateOrderFormSchema` (string) → `CreateOrderSchema` (number transform).
  - Búsquedas con `?q=` en **users** (name/email) y **orders** (product_name); debounce simple.
- **V3**
  - UI con formularios y tablas (Usuarios / Órdenes), `fetch` tipado, loading/errores, responsive.
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
