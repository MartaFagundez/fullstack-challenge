import { useCallback, useMemo, useState } from "react";
import { ToastContext, type Toast } from "./toast-context";

let _id = 1;
const EXIT_MS = 300; // debe coincidir con la animación CSS

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<(Toast & { closing?: boolean })[]>([]);

  const remove = useCallback(
    (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id)),
    []
  );

  const markClosing = useCallback((id: number) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, closing: true } : t))
    );
  }, []);

  const closeToast = useCallback(
    (id: number) => {
      markClosing(id);
      setTimeout(() => remove(id), EXIT_MS);
    },
    [markClosing, remove]
  );

  const push = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = _id++;
      const timeout = t.timeout ?? 4000;
      setToasts((prev) => [...prev, { id, variant: "info", ...t }]);
      if (timeout > 0) setTimeout(() => closeToast(id), timeout);
    },
    [closeToast]
  );

  const value = useMemo(
    () => ({ toasts, push, remove: closeToast }),
    [toasts, push, closeToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* contenedor Bootstrap de toasts */}
      <div
        className="toast-container position-fixed top-0 end-0 p-3"
        style={{ zIndex: 1080 }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast show text-bg-${t.variant ?? "info"} border-0 toast-anim ${t.closing ? "is-closing" : ""}`}
            role="status"
            aria-live="polite"
          >
            <div className="toast-header">
              <strong className="me-auto">{t.title ?? "Notificación"}</strong>
              <button
                type="button"
                className="btn-close"
                onClick={() => closeToast(t.id)}
              ></button>
            </div>
            <div className="toast-body">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
