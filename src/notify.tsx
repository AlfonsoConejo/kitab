import { toast } from "sonner";
import { AppToast } from "./components/AppToast";
import type{ ToastType } from "@/types/toast";

export function notify (type: ToastType, message: string) {
  toast.custom(() => (
    <AppToast type={type} message={message} />
  ));
}