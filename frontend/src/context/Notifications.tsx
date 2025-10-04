import type { ReactNode } from "react";
import toast, { Toaster } from "react-hot-toast";
import { NotificationsContext } from "./notifications-context";
import type { Notifier } from "./notifications-context";

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const api: Notifier = {
    success: (msg) => toast.success(msg),
    error: (msg) => toast.error(msg),
    info: (msg) => toast(msg),
  };

  return (
    <NotificationsContext.Provider value={api}>
      <Toaster position="top-center" />
      {children}
    </NotificationsContext.Provider>
  );
}
