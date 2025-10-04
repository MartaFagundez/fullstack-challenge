// Estructuras de la API (coinciden con el backend)

// Errores JSON del backend
export type ApiErrorPayload = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

// Entidades
export type User = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

export type Order = {
  id: number;
  user_id: number;
  product_name: string;
  amount: number; // "importe" decimal; el backend lo maneja como Numeric, aquí lo tratamos como number
  created_at: string;
  user?: Pick<User, "id" | "name" | "email"> | null;
};

// Respuestas paginadas
export type Paginated<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  pages: number;
};
