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

export interface AboutFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export default function AboutFeatureCard({
  icon: Icon,
  title,
  description,
  className,
}: AboutFeatureCardProps) {
  return (
    <Card
      className={cn(
        "border-border/80 bg-card/80 backdrop-blur-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      <CardHeader>
        <div className="flex size-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Icon className="size-6" aria-hidden />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0" />
    </Card>
  );
}
