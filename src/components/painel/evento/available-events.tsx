/**
 * @module components/painel/evento/available-events
 * @description Lista de eventos/lotes disponíveis para compra.
 * Filtra lotes do tipo PORTAL e verifica se o usuário já possui cortesia ou pagamento ativo.
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Hourglass, Ticket, Users } from "lucide-react";
import { format } from "date-fns";
import type { LoteFields } from "@/services/form-service";
import type { Purchase } from "@/types/purchase.types";
import { EmptyState } from "@/components/empty-state";
import { useNavigate } from "@tanstack/react-router";

interface AvailableEventsProps {
  eventos: LoteFields[];
  filterOrderByUserId: Purchase[];
  onSelectEvent: (evento: LoteFields) => void;
}

export function AvailableEvents({ eventos, filterOrderByUserId, onSelectEvent }: AvailableEventsProps) {
  const filteredEventsPortal = eventos.filter((lote) => lote.tipo_lote.includes("PORTAL"));

  const hasCortesia = filterOrderByUserId.some((order) => order.metodo_pagamento?.includes("CORTESIA"));

  const hasActivePayment = filterOrderByUserId.some((order) => {
    // Considera ativo tudo que não for cancelado, rejeitado, estornado ou reembolsado
    return !["cancelled", "reject", "refunded", "charged_back"].includes(order.status);
  });

  const navigate = useNavigate();

  if (hasCortesia || hasActivePayment) {
    return (
      <EmptyState
        title="Você já possui um evento inscrito ou em andamento"
        description="Você já possui uma inscrição ativa ou pendente de pagamento. Clique no botão abaixo para visualizar seus ingressos."
        icon={Ticket}
        action={{ label: "Meus Ingressos", onClick: () => navigate({ to: "/painel/historico" }) }}
        variant="card"
        size="default"
        className="w-full h-full"
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Eventos Disponiveis</CardTitle>
        <p className="text-sm text-muted-foreground">Selecione um evento para ver detalhes e realizar a compra</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {filteredEventsPortal.map((event) => (
          <div key={event?.documentid} className="border rounded-xl p-4 transition-all hover:bg-muted/50 cursor-pointer" onClick={() => onSelectEvent(event!)}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-foreground">{event?.nome}</h3>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{event?.descricao}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(event!.data_inicio_vendas), "dd/MM/yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Hourglass className="h-4 w-4" />
                    <span>
                      {event?.hora_inicio_vendas} - {event?.hora_fim_vendas}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                <p className="text-xl font-bold text-violet-600">{event?.preco}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{event?.quantidade} vagas</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
