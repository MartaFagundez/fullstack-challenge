import { useContext } from "react";
import { UsersContext, type UsersCtx } from "../context/users-context";

export function useUsers(): UsersCtx {
  const ctx = useContext(UsersContext);
  if (!ctx) throw new Error("useUsers must be used within UsersProvider");
  return ctx;
}
