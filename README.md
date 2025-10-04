# Fullstack Challenge – Monorepo (V5) [![API Docs](https://img.shields.io/badge/Swagger-OpenAPI%203-blue?logo=swagger)](http://localhost:5000/apidocs)

> **Estado:** V5 completado (**Export/Import JSON** desde UI y API + **seeds con Faker 37.8.0**).  
> **Stack:** Monorepo (npm workspaces) · Frontend (React + TypeScript + Vite + Bootstrap, React Router 7) · Backend (Flask + SQLAlchemy + Flask‑Migrate + Flasgger) · Calidad (Ruff) · DX (ESLint/Prettier, concurrently).

---

## Tabla de contenidos

- [¿Qué incluye la V5?](#qué-incluye-la-v5)
- [Enfoque y buenas prácticas](#enfoque-y-buenas-prácticas)
- [Estructura de carpetas](#estructura-de-carpetas)
- [Instalación / Actualización](#instalación--actualización)
- [Ejecutar en desarrollo](#ejecutar-en-desarrollo)
- [Export / Import (UI + API)](#export--import-ui--api)
- [Seeds con Faker](#seeds-con-faker)
- [Documentación de API (Swagger)](#documentación-de-api-swagger)
- [Colección Postman](#colección-postman)
- [Scripts útiles](#scripts-útiles)
- [Changelog](#changelog)
- [Solución de problemas (FAQ)](#solución-de-problemas-faq)
- [Licencia](#licencia)

---

## ¿Qué incluye la V5?

- ✅ **Export/Import JSON**:
  - **UI**: botones para exportar/importar **Usuarios** y **Órdenes** (descarga JSON y selector de archivo).
  - **API**:
    - `GET /export/users`, `GET /export/orders`, `GET /export/all`
    - `POST /import/users` (omite duplicados por email), `POST /import/orders` (requiere `user_id` válido y `amount > 0`)
- ✅ **Seeds con Faker 37.8.0** (CLI `seed-faker`) para poblar datos de prueba en segundos.
- ✅ Se mantiene todo lo de **V4**:
  - Context de notificaciones (**react-hot-toast**), formularios con **React Hook Form + Zod** (modo `onTouched`), búsqueda `?q=` en listados y UI responsive con Bootstrap.

---

## Enfoque y buenas prácticas

- **Desarrollo iterativo y versionado**: V0→V5 con **tags** (`v0.0`, `v1.0`, …) y ramas **feature** → PR → `dev` (por defecto) → `main` (protegida).
- **Simplicidad primero**: fetch nativo, Context mínimo, sin optimizaciones prematuras.
- **Coherencia de errores**: backend responde `{"error":{code,message}}`.
- **DX**: `npm run dev` lanza API+Web; linters (Ruff/ESLint), scripts claros, README por versión.
- **UI**: interfaz responsive, componentes accesibles; formularios con feedback y toasts.

---

## Estructura de carpetas

```
/ (repo raíz)
├─ frontend/
│  ├─ src/
│  │  ├─ App.tsx                        # Layout
│  │  ├─ main.tsx                       # Router declarativo + NotificationsProvider
│  │  ├─ types/
│  │  │  └─ api.ts                      # Tipos compartidos de la API
│  │  ├─ services/
│  │  │  └─ api.ts                      # Cliente fetch tipado
│  │  ├─ utils/
│  │  │  ├─ number.ts                   # parse/format del importe
│  │  │  └─ download.ts                 # downloadJson + timestamp
│  │  ├─ validation/
│  │  │  └─ schemas.ts                  # Esquemas de Zod para forms
│  │  ├─ context/
│  │  │  ├─ Notifications.tsx           # Provider + <Toaster />
│  │  │  └─ notifications-context.ts    # createContext + tipos
│  │  ├─ hooks/
│  │  │  └─ useNotify.ts                # hook que consume el contexto
│  │  ├─ components/
│  │  │  ├─ io/
│  │  │  │  ├─ UsersIO.tsx              # Export/Import usuarios (UI)
│  │  │  │  └─ OrdersIO.tsx             # Export/Import órdenes (UI)
│  │  │  ├─ inputs/
│  │  │  │  └─ DebouncedInput.tsx       # input con debounce
│  │  │  ├─ feedback/
│  │  │  │  ├─ InlineError.tsx
│  │  │  │  └─ SmallSpinner.tsx
│  │  │  ├─ forms/
│  │  │  │  ├─ CreateUserForm.tsx       # React Hook Form + Zod
│  │  │  │  └─ CreateOrderForm.tsx      # React Hook Form + Zod
│  │  │  └─ tables/
│  │  │     ├─ UsersTable.tsx           # lista paginada + búsqueda
│  │  │     └─ OrdersTable.tsx          # lista paginada + búsqueda
│  │  └─ pages/
│  │     ├─ Users.tsx
│  │     └─ Orders.tsx
│  ├─ .env.example
│  ├─ package.json
│  └─ ...
├─ backend/
│  ├─ app/
│  │  ├─ __init__.py                    # Swagger en /apidocs + blueprints
│  │  ├─ api/
│  │  │  ├─ users.py, orders.py         # + soporte ?q=
│  │  │  └─ io.py                       # export/import JSON
│  │  ├─ models/
│  │  │  ├─ order.py
│  │  │  └─ users.py
│  │  ├─ seeds/seed_faker.py            # Faker
│  │  └─ cli.py                         # comando seed-faker
│  └─ ...
├─ infra/postman/
│  ├─ fullstack-challenge.postman_collection.json
│  └─ fullstack-challenge-local.postman_environment.json
└─ ...
```

---

## Instalación / Actualización

1. **Instalar dependencias del monorepo**

```bash
npm install
```

2. **Variables de entorno en Frontend**

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
cd backend && source .venv/bin/activate  # Windows: source .venv/Scripts/activate
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

## Export / Import (UI + API)

### Desde la UI

- En **/users**: card **Exportar usuarios (JSON)** / **Importar usuarios (JSON)**.
  - Importa un archivo con estructura `{ "items": [ { "name": "...", "email": "..." }, ... ] }`.
  - Los usuarios con datos inválidos o emails duplicados se **omiten** y se informa `{ created, skipped }`.
- En **/orders**: card **Exportar órdenes (JSON)** / **Importar órdenes (JSON)**.
  - Importa `{ "items": [ { "user_id": 1, "product_name": "...", "amount": 12.5 }, ... ] }`.
  - Requiere `user_id` existente y `amount > 0`. Los inválidos se **omiten**.

---

## Seeds con Faker

Genera datos en segundos (no borra existentes):

```bash
flask --app app:create_app seed-faker --users 30 --orders 100
```

- Nombres/emails realistas (`es_ES`), `product_name` variados, `amount` entre 5.00 y 200.00 (2 decimales).

---

## Documentación de API (Swagger)

- Abre **`http://localhost:5000/apidocs`** para explorar y ejecutar endpoints.

---

## Colección Postman

- **Colección:** `infra/postman/fullstack-challenge.postman_collection.json`
- **Environment local:** `infra/postman/fullstack-challenge-local.postman_environment.json`

Uso:

- `{{baseUrl}}` apunta a `http://localhost:5000`.
- Requests de búsqueda traen `q=` vacío para que lo completes manualmente.

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

- **V5**
  - **Export/Import JSON** (UI + API) para usuarios y órdenes.
  - **Faker**: comando `seed-faker` para generar datos.
- **V4**
  - Context de notificaciones (react-hot-toast), RHF + Zod, búsqueda `?q=`.
- **V3**
  - UI de formularios y tablas (usuarios/órdenes), `fetch` tipado, estados de carga/errores.
- **V2**
  - Endpoints Users/Orders con paginación, errores JSON y Swagger. Postman.
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
