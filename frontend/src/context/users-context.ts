import { createContext } from "react";
import type { User, Paginated } from "../types/api";

export type UsersCtx = {
  getUsers: (
    page?: number,
    limit?: number,
    q?: string
  ) => Promise<Paginated<User>>;
  createUser: (data: { name: string; email: string }) => Promise<User>;
  invalidate: () => void;
  cachedOptions: User[]; // opciones para selects (primeras páginas)
};

// Exporta SOLO la instancia de contexto
export const UsersContext = createContext<UsersCtx | null>(null);
