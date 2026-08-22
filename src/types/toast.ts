import { type LucideIcon } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastConfig {
  icon: LucideIcon;
  border: string;
  iconColor: string;
}