import { Loader2, type LucideIcon } from "lucide-react";
import { Button } from "../ui/button";

interface IconButtonProps {
  title: string;
  onClick?: () => void;
  isLoading?: boolean;
  Icon: LucideIcon;
  disabled?: boolean;
  type?: "button" | "submit";
  variant?: "destructive" | "secondary" | "outline";
}

export default function IconButton({
  Icon,
  isLoading,
  onClick,
  title,
  disabled,
  type,
  variant,
}: IconButtonProps) {
  return (
    <Button
      disabled={disabled}
      type={type}
      onClick={onClick}
      variant={variant}
      className="text-white hover:opacity-50 cursor-pointer"
    >
      <div className="flex flex-row items-center justify-center gap-4">
        <Icon className="h-8 w-8 text-white" />
        {title}
        {isLoading && <Loader2 className="h-8 w-8 animate-spin text-white" />}
      </div>
    </Button>
  );
}
