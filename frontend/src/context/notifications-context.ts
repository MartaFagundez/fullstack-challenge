import { createContext } from "react";

export type Notifier = {
  success: (msg: string) => void;
  error: (msg: string) => void;
  info: (msg: string) => void;
};

export const NotificationsContext = createContext<Notifier | null>(null);
