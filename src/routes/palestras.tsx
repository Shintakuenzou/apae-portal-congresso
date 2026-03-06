import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Link } from "@tanstack/react-router";
import { Clock, User, MapPin, Calendar, ArrowRight, Filter } from "lucide-react";
import { useAtividade } from "@/hooks/useAtividade";
import { useVinculo } from "@/hooks/useVinculo";
import { useEvents } from "@/hooks/useEvents";
import { eachDayOfInterval, format, isSameDay, isWithinInterval, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LoadingScreen } from "@/components/loading";
import { useAuth } from "@/context/auth-context";

export const Route = createFileRoute("/palestras")({
  component: PalestrasPage,
});

function PalestrasPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const { isAuthenticated } = useAuth();

  const { atividades } = useAtividade();
  const { vinculo } = useVinculo();
  const { formatedDataEvento } = useEvents();

  const eventoDatas = useMemo(() => {
    if (!formatedDataEvento || formatedDataEvento.length === 0) return [];

    const evento = formatedDataEvento[0];

    // ✅ Isso está faltando no seu código
    if (!evento.fields.data_inicio || !evento.fields.data_fim) return [];

    try {
      const dates = eachDayOfInterval({
        start: parseISO(`${evento.fields.data_inicio}`),
        end: parseISO(`${evento.fields.data_fim}`),
      });
      return dates;
    } catch {
      return [];
    }
  }, [formatedDataEvento]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(eventoDatas[0]);

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

  if (atividadesFiltradas.length == 0) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-primary-foreground mb-6">Programacao Completa</h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed">Quatro dias de palestras, workshops e networking para transformar a inclusao no Brasil.</p>
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
                  className={`cursor-pointer ${estaSelecionado ? "bg-primary text-primary-foreground" : ""}`}
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

          {/* Schedule List */}
          <div className="space-y-4">
            {atividadesFiltradas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhuma atividade encontrada para este filtro.</p>
              </div>
            ) : (
              atividadesFiltradas.map((atividade, index) => {
                return (
                  <Card key={index} className="border-border hover:border-secondary/50 hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-48 flex-shrink-0 bg-muted p-6 flex flex-col justify-center">
                          <div className="flex items-center gap-2 text-secondary font-semibold mb-1">
                            <Clock className="h-4 w-4" />
                            <span>{format(`${selectedDate}`, "dd/MM/yyyy")}</span>
                          </div>
                          <Badge variant="outline" className="w-fit mt-2 border-secondary/50 text-secondary">
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
                                  <User className="h-4 w-4 text-secondary" />
                                  <span>{palestrante.palestrante}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-secondary" />
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
