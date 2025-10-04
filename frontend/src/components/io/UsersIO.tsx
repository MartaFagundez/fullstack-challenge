import { useState } from "react";
import { exportUsers, importUsers } from "../../services/api";
import { downloadJson, timestamp } from "../../utils/download";
import { useNotify } from "../../hooks/useNotify";

export default function UsersIO({ onImported }: { onImported?: () => void }) {
  const notify = useNotify();
  const [busy, setBusy] = useState(false);

  async function handleExport() {
    try {
      setBusy(true);
      const data = await exportUsers();
      downloadJson(data, `users-${timestamp()}.json`);
      notify.success("Usuarios exportados");
    } catch (e) {
      notify.error("No se pudo exportar");
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setBusy(true);
      const text = await file.text();
      const json = JSON.parse(text);
      const items = Array.isArray(json.items) ? json.items : json;
      const res = await importUsers(items);
      notify.success(`Importados: ${res.created}, omitidos: ${res.skipped}`);
      onImported?.();
    } catch (err) {
      notify.error("JSON inválido o import fallida");
      console.error(err);
    } finally {
      e.target.value = "";
      setBusy(false);
    }
  }

  return (
    <div className="card mb-4">
      <div className="card-body d-flex flex-wrap gap-2 align-items-center">
        <button
          className="btn btn-outline-secondary"
          onClick={handleExport}
          disabled={busy}
        >
          Exportar usuarios (JSON)
        </button>
        <label className="btn btn-outline-primary mb-0">
          Importar usuarios (JSON)
          <input
            type="file"
            accept="application/json"
            className="d-none"
            onChange={handleImport}
          />
        </label>
      </div>
    </div>
  );
}
