import { useEffect, useState } from "react";
import { ApiError, createOrder, listUsers } from "../../services/api";
import InlineError from "../feedback/InlineError";
import { parseAmount } from "../../utils/number";
import type { User } from "../../types/api";

export default function CreateOrderForm({
  onCreated,
}: {
  onCreated?: () => void;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState<number | "">("");
  const [productName, setProductName] = useState("");
  const [amountStr, setAmountStr] = useState(""); // aceptará coma o punto
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Traemos la primera página de usuarios para el select (en V4 cachearemos)
    (async () => {
      setLoadingUsers(true);
      try {
        const res = await listUsers({ page: 1, limit: 50 });
        setUsers(res.items);
      } catch (error) {
        console.error("Failed to load users:", error);
        setError("Unable to load users. Please refresh the page.");
      } finally {
        setLoadingUsers(false);
      }
    })();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const amount = parseAmount(amountStr);
    if (!userId || !productName.trim() || amount === null) {
      setError(
        "Todos los campos son obligatorios y el importe debe ser un número válido."
      );
      return;
    }
    if (amount <= 0) {
      setError("El importe debe ser mayor a 0.");
      return;
    }

    try {
      setSubmitting(true);
      await createOrder({
        user_id: Number(userId),
        product_name: productName.trim(),
        amount: amount, // number
      });
      setUserId("");
      setProductName("");
      setAmountStr("");
      onCreated?.();
    } catch (err) {
      if (err instanceof ApiError)
        setError(err.payload?.error?.message ?? err.message);
      else setError("Error inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card p-3 mb-4">
      <h5 className="mb-3">Crear orden</h5>

      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label">Usuario</label>
          <select
            className="form-select"
            value={userId}
            onChange={(e) =>
              setUserId(e.target.value ? Number(e.target.value) : "")
            }
            disabled={loadingUsers}
            required
          >
            <option value="">Selecciona un usuario…</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} — {u.email}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-5">
          <label className="form-label">Producto</label>
          <input
            className="form-control"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Cuaderno A4"
            required
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Importe</label>
          <input
            inputMode="decimal"
            className="form-control"
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
            placeholder="12.50"
            // sin 'type=number' para permitir coma; parseamos a mano
            required
          />
          <div className="form-text">
            Usa coma o punto para decimales (p. ej., 12,50 o 12.50)
          </div>
        </div>
      </div>

      {error && <InlineError message={error} />}

      <div className="mt-3">
        <button className="btn btn-primary" disabled={submitting}>
          {submitting ? "Creando…" : "Crear orden"}
        </button>
      </div>
    </form>
  );
}
