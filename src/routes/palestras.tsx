import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { Clock, User, MapPin, Calendar, ArrowRight, Filter } from "lucide-react";
import { eachDayOfInterval, format, isSameDay, isWithinInterval, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LoadingScreen } from "@/components/loading";
import { useAuth } from "@/context/auth-context";
import { fetchDataset } from "@/services/fetch-dataset";
import type { ActivityFields, EventoFields } from "@/types";
import type { VinculoFields } from "@/hooks/useVinculo";

export const Route = createFileRoute("/palestras")({
  component: PalestrasPage,

  loader: async () => {
    const [atividade, vinculo_palestra_atividade, evento] = await Promise.all([
      fetchDataset<ActivityFields>({ datasetId: import.meta.env.VITE_DATASET_ATIVIDADE as string }),
      fetchDataset<VinculoFields>({ datasetId: import.meta.env.VITE_DATASET_VINCULO_PALESTRA_ATIVIDADE as string }),
      fetchDataset<EventoFields>({ datasetId: import.meta.env.VITE_DATASET_EVENTO as string }),
    ]);

    return {
      atividade,
      vinculo_palestra_atividade,
      evento,
    };
  },
});

function PalestrasPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const { atividade, vinculo_palestra_atividade, evento } = Route.useLoaderData();
  const { isAuthenticated } = useAuth();

  const eventoDatas = useMemo(() => {
    if (!evento || evento.items.length === 0) {
      return [];
    }

    if (!evento.items[0].data_inicio || !evento.items[0].data_fim) {
      return [];
    }

    try {
      const dates = eachDayOfInterval({
        start: parseISO(`${evento.items[0].data_inicio}`),
        end: parseISO(`${evento.items[0].data_fim}`),
      });

      return dates;
    } catch {
      return [];
    }
  }, [evento]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(eventoDatas[0]);

  const atividadeComPalestrantes = useMemo(() => {
    if (!atividade?.items || !vinculo_palestra_atividade?.items) return [];

    return atividade?.items.map((atividade) => ({ ...atividade, palestrantes: vinculo_palestra_atividade.items.filter((v) => v.id_atividade === atividade.documentid) }));
  }, [atividade, vinculo_palestra_atividade]);

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

  if (atividadesFiltradas.length == 0) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-violet-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">Programacao Completa</h1>
            <p className="text-xl text-white/80 leading-relaxed">Quatro dias de palestras, workshops e networking para transformar a inclusao no Brasil.</p>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Day Tabs */}
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

          {/* Category Filter */}
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

          {/* Schedule List */}
          <div className="space-y-4">
            {atividadesFiltradas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhuma atividade encontrada para este filtro.</p>
              </div>
            ) : (
              atividadesFiltradas.map((atividade, index) => {
                return (
                  <Card key={index} className="border-border hover:border-violet-600/50 hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-48 flex-shrink-0 bg-muted p-6 flex flex-col justify-center">
                          <div className="flex items-center gap-2 text-violet-600 font-semibold mb-1">
                            <Clock className="h-4 w-4" />
                            <span>{format(`${selectedDate || atividade.data_inicio}`, "dd/MM/yyyy")}</span>
                          </div>
                          <Badge variant="outline" className="w-fit mt-2 border-violet-600/50 text-violet-600">
                            {atividade.eixo}
                          </Badge>
                        </div>

                        <div className="flex-1 p-6">
                          <h3 className="text-xl font-semibold text-foreground mb-2">{atividade.titulo}</h3>
                          <p className="text-muted-foreground mb-4 text-sm">{atividade.descricao}</p>

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              {atividade.palestrantes?.map((palestrante) => (
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-violet-600" />
                                  <span>{palestrante.palestrante}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-violet-600" />
                              <span>{atividade.sala}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-6">Garanta sua vaga e participe de todas as atividades do congresso.</p>
            <Button asChild size="lg" className="group">
              <Link to={isAuthenticated ? "/painel" : "/login"}>
                Inscreva-se Agora
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
