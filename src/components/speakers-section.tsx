import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Mail, X, Award } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { usePalestrantes } from "@/hooks/usePalestrantes";

export function SpeakersSection() {
  const { palestrantes } = usePalestrantes();

  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <section className="py-24 bg-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-violet-950 text-white mb-4">Palestrantes</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">Conheça Nossos Palestrantes</h2>
            <p className="text-zinc-900 font-medium max-w-xl">Profissionais renomados que compartilharão conhecimento e experiências sobre inclusão e deficiência.</p>
          </div>
          <Button variant="outline" className="self-start md:self-auto group bg-transparent hover:bg-transparent" asChild>
            <Link to="/palestrantes">
              Ver Todos
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {palestrantes?.items?.map((speaker, index) => (
            <Card
              key={index}
              className="group border-border hover:border-violet-600/30 hover:shadow-lg transition-all duration-300 overflow-hidden hover:scale-105 cursor-pointer bg-zinc-100/10"
              onClick={() => setSelectedImage(index)}
            >
              <div className="flex flex-col items-center p-6 text-center h-full space-y-2.5">
                <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-violet-600/10 shadow-md shrink-0">
                  <img
                    src={speaker.url_foto || "/placeholder.svg"}
                    alt={speaker.nome}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Informações */}
                <div className="space-y-1 flex-1">
                  <h3 className="text-sm font-semibold text-foreground uppercase leading-tight">{speaker.nome}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{speaker.empresa_faculdade}</p>
                </div>

                <Badge variant="secondary" className="text-sm mt-auto bg-violet-950 text-white">
                  Palestrante
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        {selectedImage !== null && palestrantes && (
          <DialogContent className="max-w-3xl! overflow-hidden p-0 gap-0 [&>button]:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-muted-foreground hover:bg-black/5 rounded-full bg-white/50 backdrop-blur-sm"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-5 h-5" />
            </Button>

            <div className="relative bg-linear-to-br from-violet-600/10 via-violet-600/5 to-background p-6 pb-4">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                {/* Avatar */}
                <div className="relative w-32 h-32 shrink-0">
                  <img
                    src={palestrantes.items[selectedImage as number].url_foto || "/placeholder.svg?height=400&width=400"}
                    alt={palestrantes.items[selectedImage as number].nome}
                    className="w-full h-full object-cover rounded-2xl shadow-xl ring-4 ring-background"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-violet-600 text-white rounded-full p-2 shadow-lg">
                    <Award className="w-5 h-5" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left space-y-3">
                  <DialogHeader className="space-y-1">
                    <DialogTitle className="text-2xl font-bold tracking-tight">{palestrantes.items[selectedImage as number].nome}</DialogTitle>
                    <DialogDescription className="sr-only">Informações sobre {palestrantes.items[selectedImage as number].nome}</DialogDescription>
                  </DialogHeader>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 justify-center sm:justify-start text-muted-foreground">
                      <Building2 className="w-4 h-4 text-violet-600" />
                      <span className="text-sm font-medium">{palestrantes.items[selectedImage as number].empresa_faculdade}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Mail className="w-4 h-4 text-violet-600" />
                      <a href={`mailto:${palestrantes.items[selectedImage as number].email}`} className="text-sm hover:text-violet-600 transition-colors">
                        {palestrantes.items[selectedImage as number].email}
                      </a>
                    </div>
                  </div>

                  <Badge variant="secondary" className="mt-2">
                    Palestrante
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Conteúdo - Formação e Experiência */}
            <ScrollArea className="max-h-[50vh]">
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-foreground">
                  <Building2 className="w-5 h-5 text-violet-600" />
                  <h3 className="font-semibold text-lg">Formação & Experiência</h3>
                </div>

                <ul className="overflow-y-scroll h-44 pr-2 mt-4 text-sm text-muted-foreground space-y-4">
                  {palestrantes.items[selectedImage as number].descricao
                    .replaceAll(",", " ")
                    .split(";")
                    .map((paragraph, idx) => (
                      <p key={idx} className="list-disc list-inside text-justify">
                        {paragraph.trim()}
                      </p>
                    ))}
                </ul>
              </div>
            </ScrollArea>

            {/* Footer */}
            <Separator />
            <div className="p-4 bg-muted/30">
              <Button onClick={() => setSelectedImage(null)} className="w-full bg-transparent" variant="outline">
                Fechar
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
