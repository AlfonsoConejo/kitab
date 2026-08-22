import { CheckCircle, CircleAlert, TriangleAlert, Info } from "lucide-react";
import type{ ToastConfig, ToastType } from "@/types/toast";

const config: Record<ToastType, ToastConfig> = {
  success: {
    icon: CheckCircle,
    border: "border-slate-700",
    iconColor: "text-green-400",
  },
  error: {
    icon: CircleAlert,
    border: "border-red-500/20",
    iconColor: "text-red-400",
  },
  warning: {
    icon: TriangleAlert,
    border: "border-yellow-500/20",
    iconColor: "text-yellow-400",
  },
  info: {
    icon: Info,
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
  },
};

type AppToastProps = {
  type: ToastType;
  message: string;
}

export function AppToast({ type, message }: AppToastProps) {
  const { icon: Icon, iconColor } = config[type];

  return (
    <div
      className={`flex items-start gap-3 text-xs rounded-md bg-slate-700 px-3 py-3 min-w-3xs`}
    >
      <div className={`mt-0.5 ${iconColor}`}>
        <Icon size={16} />
      </div>

      <p className="text-slate-300 leading-snug">
        {message}
      </p>
    </div>
  );
}