import type { FeatureStatus } from "@/types/feature";

interface StatusConfig {
  label: string;
  className: string;
}

interface FeatureBadgeProps {
  status: FeatureStatus;
}

const statusConfig: Record<FeatureStatus, StatusConfig> = {
  implemented: {
    label: "Implementado",
    className: "bg-green-100 text-green-800",
  },
  developing: {
    label: "En desarrollo",
    className: "bg-yellow-100 text-yellow-800",
  },
  upcoming: {
    label: "Próximamente",
    className: "bg-indigo-100 text-indigo-800",
  },
};

const FeatureBadge = ({ status }: FeatureBadgeProps) => {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${config.className}`}
    >
      {config.label}
    </span>
  );
};

export default FeatureBadge;