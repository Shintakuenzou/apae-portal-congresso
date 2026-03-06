import { useMemo, useState } from "react";
import { eachDayOfInterval, format, isSameDay, isWithinInterval, parseISO } from "date-fns";
import { useLotes } from "@/hooks/useLotes";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Calendar, Filter, Hourglass, ShoppingCart, Users } from "lucide-react";
import type { LoteFields } from "@/services/form-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAtividade } from "@/hooks/useAtividade";
import { Separator } from "@/components/ui/separator";
import { useVinculo } from "@/hooks/useVinculo";
import { useEvents } from "@/hooks/useEvents";
import { Badge } from "@/components/ui/badge";
import { ptBR } from "date-fns/locale";
import { SwitchChoiceCard } from "@/components/switch-choice-event-card";
import { SkeletonCard } from "@/components/skelton-card";
import { fetchDataset } from "@/services/fetch-dataset";

export const Route = createFileRoute("/painel/evento")({
  component: RouteComponent,
});

function RouteComponent() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const { formatedDataLote } = useLotes();
  const [eventoSelecionado, setEventoSelecionado] = useState<LoteFields | null>();
  const id_lote = formatedDataLote ? formatedDataLote[formatedDataLote.length - 1].fields.documentId : "";
  const { atividades } = useAtividade(id_lote);
  const { vinculo } = useVinculo();

  const { formatedDataEvento } = useEvents();

  const eventoDatas = useMemo(() => {
    if (!formatedDataEvento || formatedDataEvento.length === 0) return [];

    const evento = formatedDataEvento[0];
    const dates = eachDayOfInterval({
      start: parseISO(`${evento.fields.data_inicio}`),
      end: parseISO(`${evento.fields.data_fim}`),
    });

    return dates;
  }, [formatedDataEvento]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    if (!eventoDatas[0]) {
      return null;
    }

    return eventoDatas[0];
  });

  const atividadeComPalestrantes = useMemo(() => {
    if (!atividades?.items || !vinculo?.items) return [];

    return atividades?.items.map((atividade) => ({ ...atividade, palestrantes: vinculo.items.filter((v) => v.id_atividade === atividade.documentid) }));
  }, [atividades, vinculo]);

  const atividadesFiltradas = useMemo(() => {
    if (!atividadeComPalestrantes.length) return [];

    return atividadeComPalestrantes.filter((atividade) => {
      const mesmaData = selectedDate ? isWithinInterval(selectedDate, { start: `${atividade.data_inicio}`, end: `${atividade.data_fim}T${atividade.hora_fim}` }) : true;

      const mesmaCategoria = selectedCategory === "Todos" || atividade.eixo === selectedCategory;

      return mesmaData && mesmaCategoria;
    });
  }, [atividadeComPalestrantes, selectedDate, selectedCategory]);

  const atividadeCategorias = useMemo(() => {
    if (!atividadeComPalestrantes.length) return [];

    return [...new Set(atividadeComPalestrantes.map((atividade) => atividade.eixo))];
  }, [atividadeComPalestrantes]);

  async function handlePayment() {
    console.log("handlePayment: ");

    const response = await fetchDataset({
      datasetId: "pagCN",
      constraints: [
        {
          fieldName: "email",
          initialValue: "desenvolvedor3@apaebrasil.org.br",
          finalValue: "desenvolvedor3@apaebrasil.org.br",
          constraintType: "MUST",
        },
        {
          fieldName: "titulo",
          initialValue: "congresso nacional das apaes",
          finalValue: "congresso nacional das apaes",
          constraintType: "MUST",
        },
        {
          fieldName: "preco",
          initialValue: "200",
          finalValue: "200",
          constraintType: "MUST",
        },
        {
          fieldName: "ref_id",
          initialValue: "1",
          finalValue: "1",
          constraintType: "MUST",
        },
      ],
    });

    console.log("response payment: ", response.items);
  }

  return (
    <div className="space-y-6 col-span-4 lg:col-span-3">
      {eventoSelecionado ? (
        <div className="space-y-6">
          <Button variant="ghost" className="cursor-pointer" onClick={() => setEventoSelecionado(null)}>
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            Voltar aos eventos
          </Button>

          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h2 className="text-2xl font-bold text-foreground">{eventoSelecionado?.nome}</h2>
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
                      className={`cursor-pointer ${estaSelecionado ? "bg-primary text-primary-foreground" : ""}`}
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
                  className={`cursor-pointer transition-colors ${selectedCategory === "Todos" ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" : "hover:bg-muted"}`}
                  onClick={() => setSelectedCategory("Todos")}
                >
                  Todos
                </Badge>
                {atividadeCategorias.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${selectedCategory === category ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" : "hover:bg-muted"}`}
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

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Valor do ingresso</p>
                  <p className="text-3xl font-bold text-secondary">{eventoSelecionado?.preco}</p>
                  <p className="text-sm text-muted-foreground">{eventoSelecionado?.quantidade} vagas disponiveis</p>
                </div>
                <Button size="lg" className="w-full sm:w-auto" onClick={handlePayment}>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Comprar Ingresso
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Eventos Disponiveis</CardTitle>
            <p className="text-sm text-muted-foreground">Selecione um evento para ver detalhes e realizar a compra</p>
          </CardHeader>
          <CardContent className="space-y-4 cursor-pointer">
            {formatedDataLote?.map((evento) => (
              <div key={evento.cardId} className="border rounded-xl p-4 transition-all" onClick={() => setEventoSelecionado(evento.fields)}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{evento.fields.nome}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{evento.fields.descricao}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>{format(evento.fields.data_inicio_vendas, "dd/MM/yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Hourglass className="h-4 w-4" />
                        <span>
                          {evento.fields.hora_inicio_vendas} - {evento.fields.hora_fim_vendas}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                    <p className="text-xl font-bold text-secondary">{evento.fields.preco}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{evento.fields.quantidade} vagas</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
