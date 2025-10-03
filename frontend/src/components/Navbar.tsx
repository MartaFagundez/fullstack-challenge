import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";

const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export default function Navbar() {
  const [apiStatus, setApiStatus] = useState<"ok" | "down" | "pending">(
    "pending"
  );

  useEffect(() => {
    // Ping simple al backend para verificar V0
    fetch(`${API}/health`)
      .then(async (r) => {
        setApiStatus(r.ok ? "ok" : "down");
      })
      .catch(() => setApiStatus("down"));
  }, []);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom">
      <div className="container">
        <Link to="/" className="navbar-brand fw-semibold">
          Fullstack Challenge
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div id="nav" className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink to="/users" className="nav-link">
                Usuarios
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/orders" className="nav-link">
                Pedidos
              </NavLink>
            </li>
          </ul>
          <span
            className={`badge text-bg-${apiStatus === "ok" ? "success" : apiStatus === "pending" ? "secondary" : "danger"}`}
          >
            API {apiStatus}
          </span>
        </div>
      </div>
    </nav>
  );
}
