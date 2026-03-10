import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { useAuth } from "@/context/auth-context";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { Card, CardHeader, CardContent } from "./ui/card";
import type { EventoFields, FluigEntity } from "@/types";
import { formatThreeDayRangeSimple } from "@/utils/formatThreeDayRange";

export interface EventInfoProps {
  formatedDataEvento: FluigEntity<EventoFields>[] | undefined;
}

interface Info {
  value: string;
  label: string;
  icon: IconName;
}

const info: Info[] = [
  { value: "5.000+", label: "Participantes", icon: "users" },
  { value: "50+", label: "Palestras", icon: "mic-2" },
  { value: "3", label: "Dias de evento", icon: "calendar" },
  { value: "2.000+", label: "APAEs representadas", icon: "building" },
];

export function EventInfoSection({ formatedDataEvento }: EventInfoProps) {
  const { isAuthenticated } = useAuth();
  let description = "";
  let date = "";
  let location = "";

  if (formatedDataEvento && formatedDataEvento.length > 0) {
    const idx = formatedDataEvento.length - 1;
    description = formatedDataEvento[idx].fields.descricao;
    date = formatThreeDayRangeSimple(formatedDataEvento[idx].fields.data_inicio, formatedDataEvento[idx].fields.data_fim);
    location = `${formatedDataEvento[idx].fields.cidade} - ${formatedDataEvento[idx].fields.estado}`;
  }

  return (
    <section className="relative py-24 bg-white overflow-hidden border-y border-violet-950/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Coluna de Texto */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-sm font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse" />
              Sobre o Congresso
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-violet-950 tracking-tight font-playfair">O maior encontro em prol da pessoa com deficiência</h2>

            <p className="text-lg text-muted-foreground leading-relaxed text-justify">{description}</p>

            <div className="flex flex-wrap items-center gap-4 text-violet-950/80">
              <div className="flex items-center gap-2 bg-muted px-4 py-2.5 rounded-xl border border-border">
                <Calendar className="h-5 w-5 text-violet-600" />
                <span className="font-medium">{date}</span>
              </div>
              <div className="flex items-center gap-2 bg-muted px-4 py-2.5 rounded-xl border border-border">
                <MapPin className="h-5 w-5 text-violet-600" />
                <span className="font-medium">{location}</span>
              </div>
            </div>

            <div className="pt-4">
              <Button asChild size="lg" className="bg-violet-600 hover:bg-violet-600/90 text-white text-lg px-8 h-14 font-semibold shadow-lg hover:shadow-xl transition-all group">
                <Link to={isAuthenticated ? "/painel" : "/login"}>
                  Garanta sua vaga
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Coluna de Cards */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {info.map((stat, index) => (
              <Card key={index} className="border-0 bg-muted/50 hover:bg-muted transition-colors hover:scale-[1.02] duration-300">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-xl bg-violet-600/10 flex items-center justify-center mb-2">
                    <DynamicIcon name={stat.icon} className="h-6 w-6 text-violet-600" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-violet-950">{stat.value}</div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
