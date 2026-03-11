import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import type { EventoFields, FluigEntity } from "@/types";
import { formatThreeDayRangeSimple } from "@/utils/formatThreeDayRange";
import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { type IconName } from "lucide-react/dynamic";
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
    description = formatedDataEvento[idx].fields.descricao ?? "";
    date = formatThreeDayRangeSimple(formatedDataEvento[idx].fields.data_inicio, formatedDataEvento[idx].fields.data_fim);
    location = `${formatedDataEvento[idx].fields.cidade}/${formatedDataEvento[idx].fields.estado}`;
  }

  const nomeEvento = "Congresso Nacional das Apaes";

  return (
    <section className="w-full bg-white">
      <div className=" mx-auto px-8 sm:px-12 lg:px-16">
        <div className="flex flex-col md:flex-row items-center gap-16 py-48">
          {/* Coluna esquerda — Imagem */}
          <div className="w-full md:w-2/5 flex-shrink-0">
            <img src={LogoCN} alt="Congresso Nacional das Apaes" className="w-full object-contain bg-gray-100 rounded-sm " />
          </div>

          {/* Coluna direita — Conteúdo */}
          <div className="w-full md:w-3/5 flex flex-col gap-10">
            {/* Título */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-violet-700 text-center leading-tight">{nomeEvento}</h1>

            {/* Descrição */}
            {description && <p className="text-base sm:text-lg md:text-xl text-gray-800 font-semibold text-justify leading-relaxed tracking-wide lowercase">{description}</p>}

            {/* Citação */}
            <p className="text-end text-gray-700 italic text-base sm:text-lg md:text-xl">"Inclusão que inspira, inovação que transforma."</p>

            {/* Badge data + local */}
            {(date || location) && (
              <div className="flex items-center justify-center border-2 border-violet-600 rounded-sm px-6 py-4 w-full gap-3">
                {date && <span className="text-violet-700 font-semibold text-base sm:text-lg text-center">{date}</span>}
                {date && location && <MapPin className="h-5 w-5 text-violet-700 flex-shrink-0" />}
                {location && <span className="text-violet-700 font-semibold text-base sm:text-lg">{location}</span>}
              </div>
            )}

            {/* Botão */}
            <div className="flex justify-end pt-2">
              <Button asChild size="lg" className="bg-violet-700 hover:bg-violet-800 text-white text-lg sm:text-xl px-10 h-16 font-semibold rounded-xl shadow-md">
                <Link to={isAuthenticated ? "/painel" : "/login"}>
                  Garanta sua vaga
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
