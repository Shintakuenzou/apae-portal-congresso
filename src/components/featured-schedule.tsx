import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, ArrowRight, Star } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { Link } from "@tanstack/react-router";

export function FeaturedSchedule() {
  const { formatedDataEvento } = useEvents();

  return (
    <section className="py-24 bg-violet-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <Badge className="bg-violet-100/10 text-white mb-4">
              <Star className="h-3 w-3 mr-1" />
              Destaque
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Programação em Destaque</h2>
            <p className="mt-3 text-white/80 max-w-xl">Confira os principais eventos do primeiro dia do congresso</p>
          </div>
          <Button asChild variant="outline" className="self-start sm:self-auto group bg-transparent">
            <Link to="/palestras" className="text-white">
              Ver programação completa
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {formatedDataEvento?.map((event, index) => (
            <Card key={index} className={`group hover:shadow-xl transition-all duration-300 overflow-hidden hover:scale-105 cursor-pointer bg-muted`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-semibold text-secondary">{event.fields.hora_inicio}</span>
                </div>

                <Badge variant="outline" className={`mb-3 border-muted-foreground/30 text-muted-foreground`}>
                  {event.fields.tipo_evento}
                </Badge>

                <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-violet-600 transition-colors leading-snug">{event.fields.titulo}</h3>

                <p className="text-sm text-muted-foreground mb-4">{event.fields.tipo_evento}</p>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{event.fields.local_evento}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
