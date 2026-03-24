import { ArrowRight, Calendar, Circle, Filter, ShoppingCart, AlertCircle } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SwitchChoiceCard } from "@/components/switch-choice-event-card";
import { SkeletonCard } from "@/components/skelton-card";
import type { LoteFields } from "@/services/form-service";
import type { User } from "@/types/user";

interface EventDetailsProps {
  user: User | null;
  evento: LoteFields;
  onBack: () => void;
  onPayment: () => void;
  eventoDatas: Date[];
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  atividadeCategorias: string[];
  atividadesFiltradas: any[];
  isProcessingPayment: boolean;
  updateUser: (user: User) => void;
  validacaoHorarios: { valido: boolean; mensagem: string };
}

export function EventDetails({
  user,
  evento,
  onBack,
  onPayment,
  eventoDatas,
  selectedDate,
  setSelectedDate,
  selectedCategory,
  setSelectedCategory,
  atividadeCategorias,
  atividadesFiltradas,
  isProcessingPayment,
  updateUser,
  validacaoHorarios,
}: EventDetailsProps) {
  return (
    <div className="space-y-6">
      <Button variant="ghost" className="cursor-pointer" onClick={onBack}>
        <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
        Voltar aos eventos
      </Button>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h2 className="text-2xl font-bold text-foreground">{evento.nome}</h2>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {eventoDatas?.map((data, index) => {
              const estaSelecionado = selectedDate ? isSameDay(data, selectedDate) : false;
              return (
                <Button
                  key={index}
                  variant={estaSelecionado ? "default" : "outline"}
                  onClick={() => setSelectedDate(data)}
                  className={`cursor-pointer ${estaSelecionado ? "bg-violet-600 text-white" : ""}`}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{format(data, "PPP", { locale: ptBR })}</span>
                  <span className="sm:hidden">{format(data, "PPP", { locale: ptBR })}</span>
                </Button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-10 pb-6 border-b border-border">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground mr-2">Filtrar:</span>
            <Badge
              variant={selectedCategory === "Todos" ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${selectedCategory === "Todos" ? "bg-violet-600 text-white hover:bg-violet-600/90" : "hover:bg-muted"}`}
              onClick={() => setSelectedCategory("Todos")}
            >
              Todos
            </Badge>
            {atividadeCategorias.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${selectedCategory === category ? "bg-violet-600 text-white hover:bg-violet-600/90" : "hover:bg-muted"}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          <div className="space-y-4">
            {atividadesFiltradas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhuma atividade encontrada para este filtro.</p>
              </div>
            ) : (
              atividadesFiltradas.map((atividade, index) => {
                return (
                  <div key={atividade.documentid}>
                    {eventoDatas.length > 0 ? (
                      <SwitchChoiceCard
                        todasAtividades={atividadesFiltradas}
                        key={index}
                        titulo={atividade.titulo}
                        documentId={atividade.documentid}
                        descricao={atividade.descricao}
                        eixo={atividade.eixo}
                        hora_inicio={atividade.hora_inicio}
                        palestrantes={atividade.palestrantes}
                        data_inicio={atividade.data_inicio}
                        hora_fim={atividade.hora_fim}
                        eventoDatas={eventoDatas}
                        user={user}
                        updateUser={updateUser}
                        selectedDate={selectedDate}
                        esgotado={atividade.esgotado}
                      />
                    ) : (
                      <SkeletonCard />
                    )}
                  </div>
                );
              })
            )}
          </div>

          <Separator />

          {/* ✅ NOVO: Alerta de validação */}
          {!validacaoHorarios.valido && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900">Horários incompletos</p>
                <p className="text-sm text-amber-800">{validacaoHorarios.mensagem}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Valor do ingresso</p>
              <p className="text-3xl font-bold text-violet-600">{evento.preco}</p>
              <p className="text-sm text-muted-foreground">{evento.quantidade} vagas disponiveis</p>
            </div>
            {/* ✅ BOTÃO DESABILITADO SE HORÁRIOS NÃO ESTÃO PREENCHIDOS */}
            <Button size="lg" className="w-full sm:w-auto cursor-pointer" onClick={onPayment} disabled={isProcessingPayment}>
              {isProcessingPayment ? (
                <>
                  <Circle className="h-5 w-5 mr-2 animate-spin" />
                  Processando
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {validacaoHorarios.valido ? "Comprar Ingresso" : "Complete os horários"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
