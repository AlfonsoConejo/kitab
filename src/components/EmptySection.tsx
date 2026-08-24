import { Link } from "react-router-dom";
import { type LucideIcon } from "lucide-react";

type EmptySectionProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export default function EmptySection({
  icon: Icon,
  title,
  description,
  buttonText,
  buttonLink
}: EmptySectionProps) {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full p-6 rounded-xl">
      <Icon
        size={48}
        className="text-zinc-400 mb-4"
      />

      <p className="text-xl font-medium text-center">
        {title}
      </p>

      <p className="mt-2 max-w-md text-center text-zinc-400">
        {description}
      </p>

      <Link
        to={buttonLink}
        className="mt-6 bg-sky-600 hover:bg-sky-500 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
      >
        {buttonText}
      </Link>
    </div>
  );
}