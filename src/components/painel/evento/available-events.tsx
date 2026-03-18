import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Hourglass, Users } from "lucide-react";
import { format } from "date-fns";
import type { LoteFields } from "@/services/form-service";

interface AvailableEventsProps {
  eventos: LoteFields[];

  onSelectEvent: (evento: LoteFields) => void;
}

export function AvailableEvents({ eventos, onSelectEvent }: AvailableEventsProps) {
  const FILTERED_EVENTS_PORTAL = eventos.filter((lote) => lote.tipo_lote.includes("PORTAL"));
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Eventos Disponiveis</CardTitle>
        <p className="text-sm text-muted-foreground">Selecione um evento para ver detalhes e realizar a compra</p>
      </CardHeader>

      {FILTERED_EVENTS_PORTAL.map((event) => (
        <CardContent className="space-y-4 cursor-pointer">
          <div key={event?.documentid} className="border rounded-xl p-4 transition-all" onClick={() => onSelectEvent(event!)}>
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
        </CardContent>
      ))}
    </Card>
  );
}
