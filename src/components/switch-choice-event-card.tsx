import { Field, FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import type { VinculoFields } from "@/hooks/useVinculo";
import { format, type EachDayOfIntervalResult } from "date-fns";
import { Clock, User } from "lucide-react";
import { Badge } from "./ui/badge";

interface SwitchChoiceCardProps {
  palestrantes: VinculoFields[];
  documentId: string;
  descricao: string;
  titulo: string;
  hora_inicio: string;
  data_inicio: string;
  eixo: string;
  hora_fim: string;
  eventoDatas: EachDayOfIntervalResult<
    {
      start: Date;
      end: Date;
    },
    undefined
  >;
}

export function SwitchChoiceCard({ titulo, descricao, eixo, hora_inicio, palestrantes, documentId, hora_fim, eventoDatas }: SwitchChoiceCardProps) {
  return (
    <FieldGroup className="w-full">
      <FieldLabel htmlFor={documentId}>
        <Field orientation="horizontal">
          <FieldContent className="cursor-pointer">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-48 flex-shrink-0 bg-muted p-6 flex flex-col justify-center items-center">
                <div className="flex flex-col items-center gap-2 text-secondary font-semibold mb-1">
                  <Clock className="h-4 w-4" />
                  <span>{format(eventoDatas[0], "dd/MM/yyyy")}</span>
                  <span className="leading-relaxed text-sm font-medium">
                    {hora_inicio} até {hora_fim}
                  </span>
                </div>
                <Badge className="w-fit mt-2 border-secondary/50 text-white">{eixo}</Badge>
              </div>

              <div className="flex-1 p-6 space-y-2">
                <h3 className="text-xl font-semibold text-foreground mb-2">{titulo}</h3>
                <p className="text-muted-foreground mb-4 text-sm">{descricao}</p>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    {palestrantes?.map((palestrante) => (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-secondary" />
                        <span>{palestrante.palestrante}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FieldContent>
          <Switch id={documentId} />
        </Field>
      </FieldLabel>
    </FieldGroup>
  );
}
