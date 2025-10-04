import { useState } from "react";
import { exportOrders, importOrders } from "../../services/api";
import { downloadJson, timestamp } from "../../utils/download";
import { useNotify } from "../../hooks/useNotify";

export default function OrdersIO({ onImported }: { onImported?: () => void }) {
  const notify = useNotify();
  const [busy, setBusy] = useState(false);

  async function handleExport() {
    try {
      setBusy(true);
      const data = await exportOrders();
      downloadJson(data, `orders-${timestamp()}.json`);
      notify.success("Órdenes exportadas");
    } catch {
      notify.error("No se pudo exportar");
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
      const res = await importOrders(items);
      notify.success(`Importadas: ${res.created}, omitidas: ${res.skipped}`);
      onImported?.();
    } catch {
      notify.error("JSON inválido o import fallida");
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
          Exportar órdenes (JSON)
        </button>
        <label className="btn btn-outline-primary mb-0">
          Importar órdenes (JSON)
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
