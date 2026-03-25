import { createFileRoute, Link } from "@tanstack/react-router";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, Instagram, Linkedin, ExternalLink } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { useMemo, useState } from "react";
import { SkeletonSpeakersGrid } from "@/components/skeleton-speaker-card";
import { fetchDataset } from "@/services/fetch-dataset";
import type { PalestranteFields } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/palestrantes")({
  head: () => ({
    meta: [
      { title: "Palestras | APAE BRASIL" },
      {
        name: "description",
        content: "Palestras sobre inclusão social, educação, saúde e cidadania.",
      },
      {
        name: "keywords",
        content: "APAE, APAE BRASIL, inclusão social, educação, saúde, cidadania",
      },
      {
        property: "og:title",
        content: "Palestras | APAE BRASIL",
      },
      {
        property: "og:description",
        content: "Palestras sobre inclusão social, educação, saúde e cidadania.",
      },
      {
        property: "og:type",
        content: "website",
      },
    ],
  }),
  loader: async () => {
    try {
      const palestrantes = await fetchDataset<PalestranteFields>({
        datasetId: import.meta.env.VITE_DATASET_PALESTRANTE as string,
      });
      return { palestrantes };
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      return { palestrantes: null };
    }
  },
  component: PalestrantesPage,
});

function PalestrantesPage() {
  const { palestrantes } = Route.useLoaderData();

  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedPalestrante, setSelectedPalestrante] = useState<PalestranteFields | null>(null);

  const categoriaPalestrante = useMemo(() => {
    if (!palestrantes?.items?.length) return [];

    return [...new Set(palestrantes.items.map((palestrante) => palestrante.eixo))];
  }, [palestrantes]);

  const filtrarPalestrantes = useMemo(() => {
    if (selectedCategory == "Todos") return palestrantes?.items;

    return palestrantes?.items.filter((palestrante) => palestrante.eixo === selectedCategory);
  }, [selectedCategory]);

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-12 bg-violet-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Palestrantes</h1>
            <p className="text-lg text-white/80">Conheça os especialistas que compartilharão conhecimentos e experiências no Congresso Nacional APAE Brasil 2026.</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        {/* Carregando: exibe grid de skeletons no lugar dos cards */}
        {palestrantes == null ? (
          <div className="mx-auto max-w-full px-10 sm:px-6 lg:px-8">
            <SkeletonSpeakersGrid />
          </div>
        ) : palestrantes?.items?.length == 0 ? (
          <div className="px-5">
            <EmptyState
              type="no-users"
              variant="card"
              size="default"
              title="Nenhum palestrarnte definido ainda."
              description="Ainda não há palestrantes definidos para este evento."
              className="bg-transparent border-none shadow-none"
            />
          </div>
        ) : (
          <div className="mx-auto max-w-full px-10 sm:px-6 lg:px-8">
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
              {categoriaPalestrante.map((category) => (
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

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtrarPalestrantes?.map((palestrante, index) => (
                <Card
                  key={index}
                  className="group flex flex-col h-full border-border hover:border-violet-600/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedPalestrante(palestrante)}
                >
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex flex-col items-center text-center flex-1 w-full">
                      <div className="w-24 h-24 rounded-full bg-violet-600/10 flex items-center justify-center mb-4 group-hover:bg-violet-600/15 transition-colors shrink-0">
                        <img src={palestrante.url_foto} alt={palestrante.nome} className="rounded-full object-cover size-full" />
                      </div>

                      <Badge variant="secondary" className="mb-3 bg-violet-600/10 text-violet-600 hover:bg-violet-600/20">
                        {palestrante.empresa_faculdade}
                      </Badge>

                      <h3 className="font-semibold text-foreground mb-1">{palestrante.nome}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{palestrante.empresa_faculdade}</p>

                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 text-justify line-clamp-4 w-full">{palestrante.descricao}</p>
                    </div>

                    <div className="mt-auto pt-4 border-t border-border flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <Link
                          to={palestrante.linkedin}
                          className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-violet-600 hover:text-white transition-colors"
                          aria-label={`LinkedIn de ${palestrante.nome}`}
                          onClick={(e) => e.stopPropagation()}
                          target="_blank"
                        >
                          <Linkedin className="h-4 w-4" />
                        </Link>

                        <Link
                          to={palestrante.instagram}
                          className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-violet-600 hover:text-white transition-colors"
                          aria-label={`Instagram de ${palestrante.nome}`}
                          onClick={(e) => e.stopPropagation()}
                          target="_blank"
                        >
                          <Instagram className="h-4 w-4" />
                        </Link>
                      </div>

                      <span className="text-xs font-medium text-violet-600 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        Ver detalhes <ExternalLink className="h-3 w-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </section>

      <Dialog
        open={!!selectedPalestrante}
        onOpenChange={(open) => {
          if (!open) setSelectedPalestrante(null);
        }}
      >
        <DialogContent className="sm:max-w-3xl border-none shadow-2xl p-0 overflow-hidden">
          {selectedPalestrante && (
            <div className="flex flex-col md:flex-row max-h-[85vh]">
              <div className="bg-violet-950 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-violet-800/50 w-full md:w-1/3 shrink-0">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-violet-400/30 shadow-xl mb-6">
                  <img src={selectedPalestrante.url_foto} alt={selectedPalestrante.nome} className="w-full h-full object-cover" />
                </div>

                <h2 className="text-2xl font-bold text-white text-center mb-2">{selectedPalestrante.nome}</h2>
                <p className="text-violet-200 text-center text-sm font-medium mb-6">{selectedPalestrante.empresa_faculdade}</p>

                <div className="flex items-center justify-center gap-4 mt-auto">
                  {selectedPalestrante.linkedin && (
                    <Link
                      to={selectedPalestrante.linkedin}
                      className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-violet-600 hover:scale-110 transition-all shadow-sm"
                      aria-label={`LinkedIn de ${selectedPalestrante.nome}`}
                      target="_blank"
                    >
                      <Linkedin className="h-5 w-5" />
                    </Link>
                  )}
                  {selectedPalestrante.instagram && (
                    <Link
                      to={selectedPalestrante.instagram}
                      className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-violet-600 hover:scale-110 transition-all shadow-sm"
                      aria-label={`Instagram de ${selectedPalestrante.nome}`}
                      target="_blank"
                    >
                      <Instagram className="h-5 w-5" />
                    </Link>
                  )}
                </div>
              </div>

              <div className="p-8 flex-1 overflow-y-auto">
                <DialogHeader className="mb-6 text-left border-b border-border pb-4">
                  <DialogTitle className="text-xl font-semibold text-foreground">Sobre o Palestrante</DialogTitle>
                  <DialogDescription className="sr-only">Detalhes e biografia de {selectedPalestrante.nome}</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {selectedPalestrante.eixo && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Eixo Temático</h4>
                      <Badge className="bg-violet-100 text-violet-800 hover:bg-violet-200 border-none px-3 py-1">{selectedPalestrante.eixo}</Badge>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Biografia / Resumo</h4>
                    <p className="text-foreground/90 leading-relaxed text-justify whitespace-pre-line text-[15px]">{selectedPalestrante.descricao}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  );
}
