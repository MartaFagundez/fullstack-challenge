import { useState } from "react";
import { ApiError, createUser } from "../../services/api";
import InlineError from "../feedback/InlineError";

export default function CreateUserForm({
  onCreated,
}: {
  onCreated?: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim()) {
      setError("Name y email son obligatorios");
      return;
    }

    try {
      setSubmitting(true);
      await createUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
      });
      setName("");
      setEmail("");
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
      <h5 className="mb-3">Crear usuario</h5>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Nombre</label>
          <input
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ada Lovelace"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ada@example.com"
            required
          />
        </div>
      </div>

      {error && <InlineError message={error} />}

      <div className="mt-3">
        <button className="btn btn-primary" disabled={submitting}>
          {submitting ? "Creando…" : "Crear usuario"}
        </button>
      </div>
    </form>
  );
}
