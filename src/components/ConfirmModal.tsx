import type { ConfirmModalProps, ConfirmModalVariant, ConfirmModalVariantProps } from "@/types/confirmModal";

export default function ConfirmModal({title, message, confirmText, variant, onClose, onConfirm}: ConfirmModalProps) {

  const variants: Record<ConfirmModalVariant, ConfirmModalVariantProps> = {
    danger: {
      button: "bg-red-600 hover:bg-red-500",
      text: "text-red-400",
    },
    warning: {
      button: "bg-amber-600 hover:bg-amber-500",
      text: "text-amber-400",
    },
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="w-full max-w-md rounded-xl bg-gray-800 border border-gray-700 p-6">
        <h2 className="text-lg font-semibold mb-2">
          {title}
        </h2>

        <p className="text-gray-400">
          {message}
        </p>

        <p className={`text-sm mt-3 ${variants[variant].text}`}>
          {confirmText}
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="
              px-4 py-2
              rounded-lg
              bg-gray-700
              hover:bg-gray-600
              cursor-pointer
            "
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className={`
              px-4 py-2
              rounded-lg
              cursor-pointer
              ${variants[variant].button}
            `}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}