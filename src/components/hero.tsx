import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import type { ActivityFields, EventoFields } from "@/types";
import { formatThreeDayRangeSimple } from "@/utils/formatThreeDayRange";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { Card, CardContent, CardHeader } from "./ui/card";
import LogoCN from "/public/hero1.png";
import type { ParticipantsFields } from "@/types/entities.types";

export interface HeroProps {
  event: { items: EventoFields[]; hasNext: boolean } | undefined;
  activeEvent: { items: ActivityFields[]; hasNext: boolean } | null;
  participants: { items: ParticipantsFields[]; hasNext: boolean } | null;
}

interface Info {
  value: string;
  label: string;
  icon: IconName;
}

export function Hero({ event, activeEvent, participants }: HeroProps) {
  const { isAuthenticated } = useAuth();
  const info: Info[] = [
    { value: participants?.items.length.toString() || "0", label: "Participantes", icon: "users" },
    { value: activeEvent?.items.length.toString() || "0", label: "Palestras", icon: "mic-2" },
    { value: "3", label: "Dias de evento", icon: "calendar" },
    { value: "2.000+", label: "APAEs representadas", icon: "building" },
  ];

  let description = "";
  let date = "";
  let location = "";

  if (event && event.items.length > 0) {
    const idx = event.items.length - 1;

    date = formatThreeDayRangeSimple(event.items[idx].data_inicio, event.items[idx].data_fim);
    location = `${event.items[idx].cidade}-${event.items[idx].estado}`;
    description = event.items[idx].descricao;
  }
  return (
    <section className="relative bg-linear-to-br from-[#fdf8f2] via-white to-[#ede5fa] pt-16 pb-12 text-center overflow-hidden">
      <div className="absolute -top-16 -right-20 w-80 h-80 rounded-full bg-[#c4a8f0]/30 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-16 w-64 h-64 rounded-full bg-[#f5a623]/10 blur-3xl pointer-events-none"></div>
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center">
        {/* Logo centralizada no topo */}
        <div className="flex justify-center w-full">
          <img src={LogoCN} alt="Congresso Nacional das Apaes" className="w-48 sm:w-64 md:w-1/2 object-contain" />
        </div>

        {/* Descrição */}
        <p className="mt-6 text-base sm:text-lg text-violet-950/85 leading-relaxed text-center max-w-2xl">{description}</p>

        {/* Data e local */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
          {date && (
            <div className="flex items-center gap-2 bg-violet-950/5 px-4 py-2 rounded-full text-sm">
              <Calendar className="h-4 w-4 text-violet-600" />
              <span className="font-medium text-violet-950">{date}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-2 bg-violet-950/5 px-4 py-2 rounded-full text-sm">
              <MapPin className="h-4 w-4 text-violet-500" />
              <span className="font-medium text-violet-950">{location}</span>
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
              <CardHeader className="">
                <DynamicIcon name={stat.icon} className="h-6 w-6 text-violet-600 mb-3" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-violet-600">{stat.value}</div>
                <div className="mt-1">
                  <p className="text-xs sm:text-sm font-medium text-violet-950">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
