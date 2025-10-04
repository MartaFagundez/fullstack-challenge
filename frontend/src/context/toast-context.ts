import { createContext } from "react";

export type ToastVariant = "success" | "danger" | "info" | "warning";
export type Toast = {
  id: number;
  title?: string;
  message: string;
  variant?: ToastVariant;
  timeout?: number;
};

export type ToastCtx = {
  toasts: Toast[];
  push: (t: Omit<Toast, "id">) => void;
  remove: (id: number) => void;
};

// Exporta SOLO el contexto
export const ToastContext = createContext<ToastCtx | null>(null);
