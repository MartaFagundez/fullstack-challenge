import { useState } from "react";
import CreateUserForm from "../components/forms/CreateUserForm";
import UsersTable from "../components/tables/UsersTable";
import UsersIO from "../components/io/UsersIO";

export default function Users() {
  // Forzamos refresco de tabla tras crear, usando key simple
  // (en V4 esto lo resolveremos con Context)
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="container py-4">
      <h2 className="mb-3">Usuarios</h2>
      <UsersIO onImported={() => setRefresh((n) => n + 1)} />
      <CreateUserForm onCreated={() => setRefresh((n) => n + 1)} />
      {/* React key-based component remounting strategy */}
      <div key={`users-table-${refresh}`}>
        <UsersTable />
      </div>
    </div>
  );
}
