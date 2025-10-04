import CreateOrderForm from "../components/forms/CreateOrderForm";
import OrdersTable from "../components/tables/OrdersTable";
import { useState } from "react";

export default function Orders() {
  const [refresh, setRefresh] = useState(0);
  return (
    <div className="container py-4">
      <h2 className="mb-3">Órdenes</h2>
      <CreateOrderForm onCreated={() => setRefresh((n) => n + 1)} />
      <div key={`orders-table-${refresh}`}>
        <OrdersTable />
      </div>
    </div>
  );
}
