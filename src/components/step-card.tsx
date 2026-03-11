"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  isActive?: boolean;
  isCompleted?: boolean;
  children?: React.ReactNode;
}

export function StepCard({ number, title, description, isActive = false, isCompleted = false, children }: StepCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg border p-6 transition-all duration-300",
        isActive && "border-accent bg-secondary/50",
        isCompleted && "border-accent/50 bg-secondary/30",
        !isActive && !isCompleted && "border-border bg-card",
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-medium transition-colors",
            isCompleted && "border-accent bg-accent text-accent-foreground",
            isActive && "border-accent text-accent",
            !isActive && !isCompleted && "border-border text-muted-foreground",
          )}
        >
          {isCompleted ? <Check className="h-5 w-5" /> : number}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{description}</p>
          {children && <div className="mt-4">{children}</div>}
        </div>
      </div>
    </div>
  );
}
