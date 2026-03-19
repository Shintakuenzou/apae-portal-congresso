import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { SearchX, FileX, Database, AlertCircle, FolderOpen, Inbox, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const emptyStateVariants = cva("flex flex-col items-center justify-center text-center p-8 rounded-lg", {
  variants: {
    variant: {
      default: "bg-muted/30 border border-dashed border-border",
      ghost: "bg-transparent",
      card: "bg-card border border-border shadow-sm",
      destructive: "bg-destructive/5 border border-dashed border-destructive/30",
    },
    size: {
      sm: "p-4 gap-2",
      default: "p-8 gap-4",
      lg: "p-12 gap-6",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const iconContainerVariants = cva("flex items-center justify-center rounded-full", {
  variants: {
    variant: {
      default: "bg-muted text-muted-foreground",
      ghost: "bg-muted text-muted-foreground",
      card: "bg-muted text-muted-foreground",
      destructive: "bg-destructive/10 text-destructive",
    },
    size: {
      sm: "w-10 h-10",
      default: "w-14 h-14",
      lg: "w-20 h-20",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const iconSizeMap = {
  sm: "w-5 h-5",
  default: "w-7 h-7",
  lg: "w-10 h-10",
};

// Tipos de estados vazios pré-definidos
export type EmptyStateType = "not-found" | "no-data" | "no-results" | "empty-folder" | "empty-inbox" | "no-users" | "error" | "custom";

interface EmptyStatePreset {
  icon: LucideIcon;
  title: string;
  description: string;
}

const presets: Record<Exclude<EmptyStateType, "custom">, EmptyStatePreset> = {
  "not-found": {
    icon: SearchX,
    title: "Não encontrado",
    description: "O item que você está procurando não foi encontrado.",
  },
  "no-data": {
    icon: Database,
    title: "Sem dados cadastrados",
    description: "Não há dados cadastrados ainda. Comece adicionando o primeiro registro.",
  },
  "no-results": {
    icon: FileX,
    title: "Nenhum resultado",
    description: "Sua busca não retornou nenhum resultado. Tente outros termos.",
  },
  "empty-folder": {
    icon: FolderOpen,
    title: "Pasta vazia",
    description: "Esta pasta não contém nenhum arquivo.",
  },
  "empty-inbox": {
    icon: Inbox,
    title: "Caixa de entrada vazia",
    description: "Você não tem nenhuma mensagem ou notificação.",
  },
  "no-users": {
    icon: Users,
    title: "Nenhum usuário",
    description: "Não há usuários cadastrados no sistema.",
  },
  error: {
    icon: AlertCircle,
    title: "Erro ao carregar",
    description: "Ocorreu um erro ao carregar os dados. Por favor, tente novamente.",
  },
};

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof emptyStateVariants> {
  type?: EmptyStateType;
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "secondary" | "outline" | "ghost";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  type = "no-data",
  icon: CustomIcon,
  title: customTitle,
  description: customDescription,
  action,
  secondaryAction,
  variant,
  size,
  className,
  ...props
}: EmptyStateProps) {
  const preset = type !== "custom" ? presets[type] : null;

  const Icon = CustomIcon || preset?.icon || Database;
  const title = customTitle || preset?.title || "Sem dados";
  const description = customDescription || preset?.description || "";

  const iconSize = iconSizeMap[size || "default"];

  return (
    <div className={cn(emptyStateVariants({ variant, size }), className)} {...props}>
      <div className={cn(iconContainerVariants({ variant, size }))}>
        <Icon className={iconSize} />
      </div>

      <div className="space-y-1.5">
        <h3 className={cn("font-semibold text-foreground", size === "sm" && "text-sm", size === "default" && "text-base", size === "lg" && "text-xl")}>{title}</h3>
        {description && (
          <p className={cn("text-muted-foreground max-w-md", size === "sm" && "text-xs", size === "default" && "text-sm", size === "lg" && "text-base")}>{description}</p>
        )}
      </div>

      {(action || secondaryAction) && (
        <div className={cn("flex items-center gap-2", size === "sm" && "mt-1", size === "default" && "mt-2", size === "lg" && "mt-4")}>
          {action && (
            <Button
              variant={action.variant || "default"}
              size={size === "sm" ? "sm" : "default"}
              onClick={action.onClick}
              className="bg-violet-600 hover:bg-violet-700 cursor-pointer"
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="ghost" size={size === "sm" ? "sm" : "default"} onClick={secondaryAction.onClick} className="cursor-pointer">
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
