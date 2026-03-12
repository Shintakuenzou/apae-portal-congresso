import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import type { EventoFields, FluigEntity } from "@/types";
import { formatThreeDayRangeSimple } from "@/utils/formatThreeDayRange";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { Card, CardContent, CardHeader } from "./ui/card";
import LogoCN from "/public/hero1.png";

export interface HeroProps {
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

export function Hero({ formatedDataEvento }: HeroProps) {
  const { isAuthenticated } = useAuth();

  let description = "";
  let date = "";
  let location = "";

  if (formatedDataEvento && formatedDataEvento.length > 0) {
    const idx = formatedDataEvento.length - 1;

    date = formatThreeDayRangeSimple(formatedDataEvento[idx].fields.data_inicio, formatedDataEvento[idx].fields.data_fim);
    location = `${formatedDataEvento[idx].fields.cidade}-${formatedDataEvento[idx].fields.estado}`;
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center bg-muted overflow-hidden">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center">
        {/* Logo centralizada no topo */}
        <div className="flex justify-center w-full mb-10">
          <img src={LogoCN} alt="Congresso Nacional das Apaes" className="w-48 sm:w-64 md:w-1/2 object-contain" />
        </div>

        {/* Descrição */}
        <p className="mt-6 text-base sm:text-lg text-violet-950/75 leading-relaxed text-center max-w-2xl lowercase">{description}</p>

        {/* Data e local */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-4 text-violet-950/70">
          {date && (
            <div className="flex items-center gap-2 bg-violet-950/5 px-4 py-2 rounded-full text-sm">
              <Calendar className="h-4 w-4 text-violet-600" />
              <span className="font-medium">{date}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-2 bg-violet-950/5 px-4 py-2 rounded-full text-sm">
              <MapPin className="h-4 w-4 text-violet-600" />
              <span className="font-medium">{location}</span>
            </div>
          )}
        </div>

        {/* Botão */}
        <div className="mt-8 flex justify-end w-full">
          <Button
            asChild
            size="lg"
            className="bg-violet-600 hover:bg-violet-600/90 text-white text-base sm:text-lg px-8 h-12 sm:h-14 font-semibold shadow-lg hover:shadow-xl transition-all group rounded-2xl"
          >
            <Link to={isAuthenticated ? "/painel" : "/login"}>
              Garanta sua vaga
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Cards de stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full">
          {info.map((stat, index) => (
            <Card key={index} className="cursor-auto hover:scale-105 transition-all w-full">
              <CardHeader>
                <DynamicIcon name={stat.icon} className="h-6 w-6 text-violet-600 mb-3" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-violet-600">{stat.value}</div>
                <div className="text-xs sm:text-sm text-violet-600/60 mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
