import { useEffect, useState } from "react";
import { listUsers } from "../../services/api";
import type { User } from "../../types/api";
import SmallSpinner from "../feedback/SmallSpinner";
import InlineError from "../feedback/InlineError";

export default function UsersTable() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [data, setData] = useState<{
    items: User[];
    total: number;
    pages: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await listUsers({ page, limit });
        if (!cancel)
          setData({ items: res.items, total: res.total, pages: res.pages });
      } catch (e) {
        console.warn("Failed to load users:", e);
        if (!cancel) setError("No se pudo cargar la lista de usuarios.");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [page, limit]);

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h6 className="mb-0">Usuarios</h6>
        {loading && <SmallSpinner />}
      </div>
      <div className="table-responsive">
        <table className="table table-sm table-striped align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Creado</th>
            </tr>
          </thead>
          <tbody>
            {data?.items?.length
              ? data.items.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td className="text-body-secondary">
                      {new Date(u.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              : !loading && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center text-body-secondary py-4"
                    >
                      Sin resultados
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>

      {error && (
        <div className="card-body">
          <InlineError message={error} />
        </div>
      )}

      <div className="card-footer d-flex justify-content-between align-items-center">
        <span className="small text-body-secondary">
          Página {page} de {data?.pages ?? 1} — Total: {data?.total ?? 0}
        </span>
        <div className="btn-group">
          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            « Anterior
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={!data || page >= data.pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente »
          </button>
        </div>
      </div>
    </div>
  );
}
