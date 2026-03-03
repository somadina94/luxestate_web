import { LucideIcon } from "lucide-react";

interface SettingsItemProps {
  title: string;
  description: string;
  Icon: LucideIcon;
  onClick: () => void;
}

export default function SettingsItem({
  title,
  description,
  Icon,
  onClick,
}: SettingsItemProps) {
  return (
    <div
      className="flex flex-row items-center justify-start bg-primary/20 gap-12 shadow-sm  gap-4 cursor-pointer hover:bg-primary/50 p-4 rounded-lg"
      onClick={onClick}
    >
      <Icon className="h-8 w-8 text-gray-500" />
      <div className="flex flex-col">
        <h1 className="text-lg font-bold">{title}</h1>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}
