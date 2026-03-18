import { Field, FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import type { VinculoFields } from "@/hooks/useVinculo";
import { format, isSameDay, type EachDayOfIntervalResult } from "date-fns";
import { Clock, User } from "lucide-react";
import { Badge } from "./ui/badge";
import type { User as UserType } from "@/types/user";
import { toast } from "sonner";

interface SwitchChoiceCardProps {
  palestrantes: VinculoFields[];
  documentId: string;
  descricao: string;
  titulo: string;
  hora_inicio: string;
  hora_fim: string;
  data_inicio: string;
  eixo: string;
  eventoDatas: EachDayOfIntervalResult<{ start: Date; end: Date }, undefined>;
  user: UserType | null;
  updateUser: (user: UserType) => void;
  todasAtividades: any[];
  selectedDate: Date | null;
}

// Converte "HH:mm" para minutos para comparar horários
function toMinutes(hora: string): number {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

// Verifica se dois intervalos de tempo se sobrepõem
function hasTimeConflict(inicio1: string, fim1: string, inicio2: string, fim2: string): boolean {
  const start1 = toMinutes(inicio1);
  const end1 = toMinutes(fim1);
  const start2 = toMinutes(inicio2);
  const end2 = toMinutes(fim2);
  return start1 < end2 && end1 > start2;
}

export function SwitchChoiceCard({
  titulo,
  descricao,
  eixo,
  hora_inicio,
  hora_fim,
  data_inicio,
  palestrantes,
  documentId,
  eventoDatas,
  user,
  updateUser,
  todasAtividades,
  selectedDate,
}: SwitchChoiceCardProps) {
  const raw = user?.atividades as any;

  const parsedAtividades: string[] = (() => {
    try {
      if (!raw) return [];
      if (Array.isArray(raw)) return raw.map(String);
      if (typeof raw === "string") {
        const trimmed = raw.trim();
        if (trimmed.startsWith("[")) return JSON.parse(trimmed).map(String);
        return trimmed.split(",").filter(Boolean).map(String);
      }
      return [];
    } catch (e) {
      return [];
    }
  })();

  const isSelected = parsedAtividades.some((id) => id == documentId);

  function handleCheckedChange(checked: boolean) {
    if (checked) {
      const atividadesSelecionadas = todasAtividades.filter((a) => parsedAtividades.includes(String(a.documentid)));

      const conflito = atividadesSelecionadas.find((atividade) => {
        const mesmodia = isSameDay(new Date(data_inicio), new Date(atividade.data_inicio));
        return mesmodia && hasTimeConflict(hora_inicio, hora_fim, atividade.hora_inicio, atividade.hora_fim);
      });

      if (conflito) {
        toast.error(`Conflito de horário com a atividade "${conflito.titulo}" (${conflito.hora_inicio} - ${conflito.hora_fim})`, {
          position: "top-center",
          style: { width: "550px", height: "auto", fontSize: "0.85rem" },
        });
        return;
      }

      updateUser({ ...user!, atividades: [...parsedAtividades, documentId] });
    } else {
      const diaAtual = new Date(data_inicio);

      const atividadesDoDia = todasAtividades.filter(
        (atividade) => isSameDay(new Date(atividade.data_inicio), diaAtual) && parsedAtividades.includes(String(atividade.documentid)),
      );

      if (atividadesDoDia.length <= 1) {
        toast.warning(`Você precisa ter pelo menos uma atividade no dia ${format(diaAtual, "dd/MM/yyyy")}.`, { position: "top-right" });
      }

      updateUser({
        ...user!,
        atividades: parsedAtividades.filter((id) => id != documentId),
      });
    }
  }

  return (
    <FieldGroup className="w-full">
      <FieldLabel htmlFor={documentId}>
        <Field orientation="horizontal">
          <FieldContent className="cursor-pointer">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-48 bg-muted p-6 flex flex-col justify-center items-center">
                <div className="flex flex-col items-center gap-2 text-violet-600 font-semibold mb-1">
                  <Clock className="h-4 w-4" />
                  <span>{format(selectedDate!.toString(), "dd/MM/yyyy")}</span>
                  <span className="leading-relaxed text-sm font-medium">
                    {hora_inicio} até {hora_fim}
                  </span>
                </div>
                <Badge className="w-fit mt-2 border-violet-600/50 text-white">{eixo}</Badge>
              </div>

              <div className="flex-1 p-6 space-y-2">
                <h3 className="text-xl font-semibold text-foreground mb-2">{titulo}</h3>
                <p className="text-muted-foreground mb-4 text-sm">{descricao}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    {palestrantes?.map((palestrante, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <User className="h-4 w-4 text-violet-600" />
                        <span>{palestrante.palestrante}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FieldContent>
          <Switch id={documentId} checked={isSelected} onCheckedChange={handleCheckedChange} />
        </Field>
      </FieldLabel>
    </FieldGroup>
  );
}
