import { Package, Calendar, Ticket } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAtividade } from "@/hooks/useAtividade";
import { EmptyState } from "./empty-state";
import type { PaymentResponse } from "@/types/payment-type";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useNavigate } from "@tanstack/react-router";

export type PurchaseStatus = "approved" | "pending" | "in_process" | "authorized" | "reject" | "cancelled" | "refunded" | "charged_back";

export interface Purchase {
  atividades: string;
  nome_evento: string;
  id_evento: string;
  id_lote: string;
  data_compra: string;
  data_pagamento: string;
  status: PurchaseStatus;
  metodo_pagamento: string;
  json_pagamento: string;
  id_participante: string;
}

interface PurchaseHistoryCardProps {
  purchase: Purchase;
  onViewDetails?: (purchase: Purchase) => void;
  className?: string;
}

const statusConfig: Record<PurchaseStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  approved: { label: "Aprovado", variant: "default" },
  pending: { label: "Pendente", variant: "secondary" },
  in_process: { label: "Em Processamento", variant: "outline" },
  authorized: { label: "Autorizado", variant: "default" },
  reject: { label: "Recusado", variant: "destructive" },
  cancelled: { label: "Cancelado", variant: "destructive" },
  refunded: { label: "Reembolsado", variant: "destructive" },
  charged_back: { label: "Estornado", variant: "destructive" },
};

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

function parseAtividades(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : (parsed?.atividades ?? []);
  } catch {
    return [];
  }
}

export function PurchaseHistoryCard({ purchase, className }: PurchaseHistoryCardProps) {
  const { atividades: atividadesData } = useAtividade();
  const atividades = parseAtividades(purchase.atividades);
  const paymentDataJson = purchase.json_pagamento ? (JSON.parse(purchase.json_pagamento) as PaymentResponse) : ({} as PaymentResponse);

  const selectedActivities = atividadesData?.items.filter((activitie) => {
    return atividades.includes(String(activitie.documentid));
  });

  return (
    <Card className={cn("group cursor-auto transition-all duration-200 hover:shadow-md hover:border-primary/20", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Ticket className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{purchase.nome_evento}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Calendar className="h-3.5 w-3.5" />
                <span suppressHydrationWarning>{formatDate(purchase.data_compra)}</span>
              </div>
            </div>
          </div>

          <Badge variant={statusConfig[purchase.status]?.variant ?? "secondary"}>{statusConfig[purchase.status]?.label ?? purchase.status}</Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {atividades.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <ul>
                  {selectedActivities?.map((activitie, index) => (
                    <li key={index} className="list-disc ml-6 font-medium">
                      {activitie.titulo}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <Separator orientation="horizontal" />

          {statusConfig[purchase.status]?.label == "Pendente" && (
            <div className="flex justify-end">
              <Button type="button" asChild className="cursor-pointer bg-violet-600 hover:bg-violet-700">
                <a href={paymentDataJson.point_of_interaction?.transaction_data?.ticket_url as string} target="_blank">
                  Voltar para o pagamento
                </a>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface PurchaseHistoryListProps {
  purchases: Purchase[];
  className?: string;
}

export function PurchaseHistoryList({ purchases, className }: PurchaseHistoryListProps) {
  const navigate = useNavigate();
  if (purchases.length === 0) {
    return (
      <EmptyState
        title="Nenhuma compra encontrada"
        description="Você ainda não realizou nenhuma compra."
        icon={Ticket}
        className="col-span-3 space-y-3.5 h-full"
        action={{ label: "Comprar Lote", onClick: () => navigate({ to: "/painel/evento" }), variant: "default" }}
      />
    );
  }

  return (
    <div className={cn("col-span-3 space-y-3.5", className)}>
      {purchases.map((purchase, index) => (
        <PurchaseHistoryCard key={index} purchase={purchase} />
      ))}
    </div>
  );
}
