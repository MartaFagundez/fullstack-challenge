// frontend/src/pages/Home.tsx
import { Link } from "react-router";

const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export default function Home() {
  return (
    <div className="container py-5">
      {/* Hero */}
      <section className="p-5 mb-4 bg-body-tertiary rounded-4 shadow-sm">
        <div className="container-fluid">
          <span className="badge text-bg-primary mb-2">V6.1</span>
          <h1 className="display-5 fw-bold mb-3">Fullstack Challenge</h1>
          <p className="lead text-secondary mb-4">
            Demo full-stack con React + Flask. Crea usuarios y órdenes, busca
            por texto y exporta/importa JSON. Todo simple y responsive.
          </p>

          <div className="d-flex flex-wrap gap-2">
            <Link to="/users" className="btn btn-primary btn-lg">
              Ir a Usuarios
            </Link>
            <Link to="/orders" className="btn btn-outline-primary btn-lg">
              Ir a Órdenes
            </Link>
            <a
              href={`${API}/apidocs`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline-secondary btn-lg"
            >
              API Docs (Swagger)
            </a>
          </div>

          <div className="mt-3 small text-muted">
            API base: <code>{API}</code>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="row g-4">
        <div className="col-12 col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <div className="fs-2">👤</div>
              <h3 className="h5 mt-2">Usuarios</h3>
              <p className="text-secondary mb-3">
                Alta de usuarios con validación y listado paginado con búsqueda
                por nombre/email.
              </p>
              <Link to="/users" className="btn btn-sm btn-outline-secondary">
                Abrir Usuarios
              </Link>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <div className="fs-2">🧾</div>
              <h3 className="h5 mt-2">Órdenes</h3>
              <p className="text-secondary mb-3">
                Carga de órdenes con <em>importe</em> (decimal) y listado con
                join del usuario + búsqueda por producto.
              </p>
              <Link to="/orders" className="btn btn-sm btn-outline-secondary">
                Abrir Órdenes
              </Link>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <div className="fs-2">🔄</div>
              <h3 className="h5 mt-2">Export/Import JSON</h3>
              <p className="text-secondary mb-3">
                Desde cada sección, exportá datos a JSON o importá{" "}
                <code>{`{ items: [...] }`}</code> para poblar rápidamente.
              </p>
              <a
                href={`${API}/export/all`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-secondary"
              >
                Ver JSON de ejemplo
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
