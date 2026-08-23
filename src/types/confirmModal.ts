export type ConfirmModalVariant = "danger" | "warning"

export interface ConfirmModalProps {
  title: string;
  message: string;
  confirmText?: string; 
  variant: ConfirmModalVariant;
  onClose: () => void;
  onConfirm: () => void;
}

export interface ConfirmModalVariantProps {
    button: string;
    text: string;
}