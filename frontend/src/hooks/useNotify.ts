import { useContext } from "react";
import { NotificationsContext } from "../context/notifications-context";

export function useNotify() {
  const ctx = useContext(NotificationsContext);
  if (!ctx)
    throw new Error("useNotify must be used within NotificationsProvider");
  return ctx;
}
