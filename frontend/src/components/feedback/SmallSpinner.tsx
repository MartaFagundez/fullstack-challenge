export default function SmallSpinner() {
  return (
    <div
      className="d-inline-flex align-items-center gap-2"
      role="status"
      aria-live="polite"
    >
      <span
        className="spinner-border spinner-border-sm"
        aria-hidden="true"
      ></span>
      <span className="text-body-secondary small">Cargando…</span>
    </div>
  );
}
