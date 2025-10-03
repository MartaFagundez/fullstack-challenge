import { useEffect, useState } from "react";
import { listOrders } from "../../services/api";
import type { Order } from "../../types/api";
import SmallSpinner from "../feedback/SmallSpinner";
import InlineError from "../feedback/InlineError";
import { formatAmount } from "../../utils/number";

export default function OrdersTable() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [data, setData] = useState<{
    items: Order[];
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
        const res = await listOrders({ page, limit });
        if (!cancel)
          setData({ items: res.items, total: res.total, pages: res.pages });
      } catch (e) {
        console.warn("Failed to load orders:", e);
        if (!cancel) setError("No se pudo cargar la lista de órdenes.");
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
        <h6 className="mb-0">Órdenes</h6>
        {loading && <SmallSpinner />}
      </div>

      <div className="table-responsive">
        <table className="table table-sm table-striped align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Producto</th>
              <th>Importe</th>
              <th>Creado</th>
            </tr>
          </thead>
          <tbody>
            {data?.items?.length
              ? data.items.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>
                      {o.user ? (
                        <>
                          <div>{o.user.name}</div>
                          <div className="small text-body-secondary">
                            {o.user.email}
                          </div>
                        </>
                      ) : (
                        <span className="text-body-secondary">—</span>
                      )}
                    </td>
                    <td>{o.product_name}</td>
                    <td>{formatAmount(o.amount)}</td>
                    <td className="text-body-secondary">
                      {new Date(o.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              : !loading && (
                  <tr>
                    <td
                      colSpan={5}
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
