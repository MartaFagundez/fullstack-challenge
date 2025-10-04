import { useCallback, useMemo, useState } from "react";
import { UsersContext } from "./users-context";
import type { User, Paginated } from "../types/api";
import {
  createUser as apiCreateUser,
  listUsers as apiListUsers,
  ApiError,
} from "../services/api";
import { useToast } from "../hooks/useToast";

type Key = string; // JSON.stringify({page,limit,q})

export default function UsersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { push } = useToast();

  const [cache, setCache] = useState<Record<Key, Paginated<User>>>({});
  const [options, setOptions] = useState<User[]>([]);

  const keyOf = (page = 1, limit = 10, q = "") =>
    JSON.stringify({ page, limit, q });

  const getUsers = useCallback(
    async (page = 1, limit = 10, q = "") => {
      const key = keyOf(page, limit, q);
      if (cache[key]) return cache[key];

      const data = await apiListUsers({ page, limit, q });
      setCache((c) => ({ ...c, [key]: data }));

      // Alimenta opciones (selects) con la primera página sin filtro
      if (!q && page === 1) {
        const merged = [...options, ...data.items].reduce<User[]>((acc, u) => {
          if (!acc.find((x) => x.id === u.id)) acc.push(u);
          return acc;
        }, []);
        setOptions(merged.slice(0, 50));
      }

      return data;
    },
    [cache, options]
  );

  const createUser = useCallback(
    async (payload: { name: string; email: string }) => {
      try {
        const u = await apiCreateUser(payload);
        push({
          variant: "success",
          title: "Usuario creado",
          message: `${u.name} (${u.email})`,
        });
        // invalidar cache para refrescar listados
        setCache({});
        setOptions((xs) => [u, ...xs].slice(0, 50));
        return u;
      } catch (e) {
        if (e instanceof ApiError) {
          push({
            variant: "danger",
            title: "Error",
            message: e.payload?.error?.message ?? e.message,
          });
        } else {
          push({
            variant: "danger",
            title: "Error",
            message: "Error inesperado",
          });
        }
        throw e;
      }
    },
    [push]
  );

  const invalidate = useCallback(() => setCache({}), []);

  const value = useMemo(
    () => ({
      getUsers,
      createUser,
      invalidate,
      cachedOptions: options,
    }),
    [getUsers, createUser, invalidate, options]
  );

  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
}
