import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import type { EventoFields, FluigEntity } from "@/types";
import { formatThreeDayRangeSimple } from "@/utils/formatThreeDayRange";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { Card, CardContent, CardHeader } from "./ui/card";
import LogoCN from "/public/logoCN.png";

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
  let firstTitle;
  let lastTitle;
  let description;
  let date;
  let location;

  if (formatedDataEvento && formatedDataEvento.length > 0) {
    const idx = formatedDataEvento.length - 1;
    const tituloRaw = formatedDataEvento[idx]?.fields?.titulo ?? "";

    firstTitle = tituloRaw.replaceAll(" ", ",").split(",").slice(0, 2).join(" ") as string;
    lastTitle = tituloRaw.replaceAll(" ", ",").split(",").slice(2).join(" ") as string;

    description = formatedDataEvento[idx].fields.descricao;
    date = formatThreeDayRangeSimple(formatedDataEvento[idx].fields.data_inicio, formatedDataEvento[idx].fields.data_fim);

    location = `${formatedDataEvento[idx].fields.cidade}-${formatedDataEvento[idx].fields.estado}`;
  } else {
    firstTitle = "" as string;
    lastTitle = "" as string;
    description = "" as string;
  }

  return (
    <section className="relative min-h-screen flex items-center bg-muted overflow-hidden">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 w-full">
        <img src={LogoCN} alt="" className="absolute size-1/2 object-contain -right-72 top-20" />
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-violet-950 leading-[1.1] font-playfair">
            <span className="font-cormorant font-bold text-4xl">XVII</span>
            <br />
            {firstTitle}
            <br />
            <span className="font-cormorant font-light text-violet-950">das </span>
            <span className="font-cormorant font-light text-violet-600">{lastTitle}</span>
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-violet-950/75 max-w-2xl leading-relaxed">{description}</p>

          <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
            <Button asChild size="lg" className="bg-violet-600 hover:bg-violet-600/90 text-white text-lg px-8 h-14 font-semibold shadow-lg hover:shadow-xl transition-all group">
              <Link to={isAuthenticated ? "/painel" : "/login"}>
                Garanta sua vaga
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-6 text-violet-950/70">
            <div className="flex items-center gap-2 bg-violet-950/5 px-4 py-2 rounded-full">
              <Calendar className="h-5 w-5 text-violet-600" />
              <span className="font-medium">{date}</span>
            </div>
            <div className="flex items-center gap-2 bg-violet-950/5 px-4 py-2 rounded-full">
              <MapPin className="h-5 w-5 text-violet-600" />
              <span className="font-medium">{location}</span>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto max-w-7xl">
          {info.map((stat, index) => (
            <Card key={index} className="cursor-auto hover:scale-105 transition-all w-full">
              <CardHeader>
                <DynamicIcon name={stat.icon} className="h-6 w-6 text-violet-600 mb-3" />
              </CardHeader>

              <CardContent>
                <div className="text-3xl sm:text-4xl font-bold text-violet-600">{stat.value}</div>
                <div className="text-sm text-violet-600/60 mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
