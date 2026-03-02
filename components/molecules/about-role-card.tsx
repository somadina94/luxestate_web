"use client";

import { type LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface AboutRoleCardProps {
  icon: LucideIcon;
  role: string;
  description: string;
  className?: string;
}

export default function AboutRoleCard({
  icon: Icon,
  role,
  description,
  className,
}: AboutRoleCardProps) {
  return (
    <Card
      className={cn(
        "border-primary/20 bg-gradient-to-b from-card to-card/80 transition-all hover:border-primary/40 hover:shadow-lg",
        className,
      )}
    >
      <CardHeader>
        <div className="flex size-14 items-center justify-center rounded-xl bg-primary/20 text-primary">
          <Icon className="size-7" aria-hidden />
        </div>
        <CardTitle className="text-xl">{role}</CardTitle>
        <CardDescription className="text-muted-foreground leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0" />
    </Card>
  );
}
