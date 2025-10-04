import type { ApiErrorPayload, User, Order, Paginated } from "../types/api";

const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

// Error de red o de la API del backend
export class ApiError extends Error {
  status: number;
  payload?: ApiErrorPayload;
  constructor(message: string, status: number, payload?: ApiErrorPayload) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

async function typedFetch<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    let payload: ApiErrorPayload | undefined;
    try {
      payload = (await res.json()) as ApiErrorPayload;
    } catch (error) {
      console.error("Error parsing JSON response:", error);
    }
    const msg = payload?.error?.message || `HTTP ${res.status}`;
    throw new ApiError(msg, res.status, payload);
  }
  return res.json() as Promise<T>;
}

// Helpers de querystring
const qs = (params: Record<string, string | number | undefined>) =>
  Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(
      ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`
    )
    .join("&");

// USERS
export function createUser(data: { name: string; email: string }) {
  return typedFetch<User>(`${API}/users`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function listUsers(params: { page?: number; limit?: number } = {}) {
  const query = qs({ page: params.page ?? 1, limit: params.limit ?? 10 });
  return typedFetch<Paginated<User>>(`${API}/users?${query}`);
}

export function listOrdersByUser(userId: number) {
  return typedFetch<{ items: Order[]; total: number }>(
    `${API}/users/${userId}/orders`
  );
}

// ORDERS
export function createOrder(data: {
  user_id: number;
  product_name: string;
  amount: number;
}) {
  // amount: "importe" (decimal). Se debe enviar number.
  return typedFetch<Order>(`${API}/orders`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function listOrders(params: { page?: number; limit?: number } = {}) {
  const query = qs({ page: params.page ?? 1, limit: params.limit ?? 10 });
  return typedFetch<Paginated<Order>>(`${API}/orders?${query}`);
}
