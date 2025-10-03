import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import Users from "./pages/Users.tsx";
import Orders from "./pages/Orders.tsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Layout principal */}
        <Route path="/" element={<App />}>
          {/* Rutas hijas */}
          <Route path="users" element={<Users />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
