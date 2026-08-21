import FeatureBadge from "./FeatureBadge"
import type { FeatureStatus } from "@/types/feature";

type FeatureCardProps = {
  title: string;
  description: string;
  status: FeatureStatus;
};

export default function FeatureCard({ title, description, status }: FeatureCardProps) {
  return(
    <div className="rounded-2xl p-6 shadow-md border border-slate-900 bg-slate-800">
      <FeatureBadge status={status} />
      <h3 className="text-xl text-white font-semibold mt-3">{title}</h3>
      <p className="text-slate-400 text-sm mt-1">{description}</p>
    </div>
  )
}