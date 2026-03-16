import { createFileRoute, Link } from "@tanstack/react-router";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, Instagram, Linkedin } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { useMemo, useState } from "react";
import { SkeletonSpeakersGrid } from "@/components/skeleton-speaker-card";
import { fetchDataset } from "@/services/fetch-dataset";
import type { PalestranteFields } from "@/types";

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
                <Card key={index} className="group border-border hover:border-violet-600/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-24 h-24 rounded-full bg-violet-600/10 flex items-center justify-center mb-4 group-hover:bg-violet-600/15 transition-colors">
                        <img src={palestrante.url_foto} alt={palestrante.nome} className="rounded-full object-cover size-full" />
                      </div>

                      <Badge variant="secondary" className="mb-3 bg-violet-600/10 text-violet-600 hover:bg-violet-600/20">
                        {palestrante.empresa_faculdade}
                      </Badge>

                      <h3 className="font-semibold text-foreground mb-1">{palestrante.nome}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{palestrante.empresa_faculdade}</p>

                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 text-justify lowercase">{palestrante.descricao}</p>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <Link
                        to={palestrante.linkedin}
                        className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-violet-600 hover:text-white transition-colors"
                        aria-label={`LinkedIn de ${palestrante.nome}`}
                      >
                        <Linkedin className="h-4 w-4" />
                      </Link>

                      <Link
                        to={palestrante.instagram}
                        className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-violet-600 hover:text-white transition-colors"
                        aria-label={`LinkedIn de ${palestrante.nome}`}
                      >
                        <Instagram className="h-4 w-4" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
