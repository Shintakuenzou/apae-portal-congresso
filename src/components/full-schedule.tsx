"use client";

import { useState } from "react";
import { Clock, User, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const days = [
  { id: "dia1", label: "15 de Agosto", shortLabel: "Dia 1" },
  { id: "dia2", label: "16 de Agosto", shortLabel: "Dia 2" },
  { id: "dia3", label: "17 de Agosto", shortLabel: "Dia 3" },
  { id: "dia4", label: "18 de Agosto", shortLabel: "Dia 4" },
];

const schedule: Record<
  string,
  Array<{
    time: string;
    title: string;
    speaker: string;
    location: string;
    category: string;
  }>
> = {
  dia1: [
    {
      time: "08:00 - 09:00",
      title: "Credenciamento e Recepção",
      speaker: "Equipe de Organização",
      location: "Hall Principal",
      category: "Credenciamento",
    },
    {
      time: "09:00 - 10:30",
      title: "Abertura Oficial do Congresso",
      speaker: "Presidente da Federação Nacional das APAEs",
      location: "Auditório Principal",
      category: "Cerimônia",
    },
    {
      time: "11:00 - 12:30",
      title: "Políticas Públicas e Inclusão Social",
      speaker: "Ministério da Cidadania",
      location: "Auditório Principal",
      category: "Palestra Magna",
    },
    {
      time: "14:00 - 15:30",
      title: "Inovações em Educação Especial",
      speaker: "Dra. Maria Santos",
      location: "Sala 1",
      category: "Palestra",
    },
    {
      time: "16:00 - 17:30",
      title: "Tecnologias Assistivas: Tendências e Aplicações",
      speaker: "Prof. João Silva",
      location: "Sala 2",
      category: "Workshop",
    },
  ],
  dia2: [
    {
      time: "09:00 - 10:30",
      title: "Saúde Mental e Bem-estar",
      speaker: "Dr. Carlos Mendes",
      location: "Auditório Principal",
      category: "Palestra",
    },
    {
      time: "11:00 - 12:30",
      title: "Empregabilidade e Inclusão no Mercado de Trabalho",
      speaker: "Ana Paula Ferreira",
      location: "Auditório Principal",
      category: "Palestra Magna",
    },
    {
      time: "14:00 - 15:30",
      title: "Práticas Pedagógicas Inclusivas",
      speaker: "Profª. Lúcia Oliveira",
      location: "Sala 1",
      category: "Workshop",
    },
    {
      time: "16:00 - 17:30",
      title: "Direitos da Pessoa com Deficiência",
      speaker: "Dr. Roberto Almeida",
      location: "Sala 2",
      category: "Palestra",
    },
  ],
  dia3: [
    {
      time: "09:00 - 10:30",
      title: "Família e Rede de Apoio",
      speaker: "Psicóloga Fernanda Costa",
      location: "Auditório Principal",
      category: "Palestra",
    },
    {
      time: "11:00 - 12:30",
      title: "Gestão de APAEs: Desafios e Soluções",
      speaker: "Conselho Administrativo",
      location: "Auditório Principal",
      category: "Painel",
    },
    {
      time: "14:00 - 15:30",
      title: "Arte e Cultura como Ferramentas de Inclusão",
      speaker: "Artistas Convidados",
      location: "Espaço Cultural",
      category: "Apresentação",
    },
    {
      time: "16:00 - 17:30",
      title: "Esporte Paralímpico: Histórias de Superação",
      speaker: "Atletas Paralímpicos",
      location: "Auditório Principal",
      category: "Painel",
    },
  ],
  dia4: [
    {
      time: "09:00 - 10:30",
      title: "Acessibilidade Digital",
      speaker: "Especialistas em TI",
      location: "Sala 1",
      category: "Workshop",
    },
    {
      time: "11:00 - 12:30",
      title: "Futuro da Inclusão no Brasil",
      speaker: "Painel de Especialistas",
      location: "Auditório Principal",
      category: "Painel",
    },
    {
      time: "14:00 - 15:30",
      title: "Assembleia Geral da Federação",
      speaker: "Membros Federados",
      location: "Auditório Principal",
      category: "Assembleia",
    },
    {
      time: "16:00 - 17:30",
      title: "Encerramento e Premiações",
      speaker: "Diretoria Executiva",
      location: "Auditório Principal",
      category: "Cerimônia",
    },
  ],
};

export function FullSchedule() {
  const [selectedDay, setSelectedDay] = useState("dia1");

  return (
    <section id="programacao" className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Programação Completa</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Quatro dias de palestras, workshops e networking para transformar a inclusão no Brasil</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {days.map((day) => (
            <Button
              key={day.id}
              variant={selectedDay === day.id ? "default" : "outline"}
              onClick={() => setSelectedDay(day.id)}
              className={selectedDay === day.id ? "bg-violet-600 text-white" : ""}
            >
              <span className="hidden sm:inline">{day.label}</span>
              <span className="sm:hidden">{day.shortLabel}</span>
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {schedule[selectedDay].map((event, index) => (
            <Card key={index} className="bg-card border-border hover:border-violet-600/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="md:w-32 shrink-0">
                    <div className="flex items-center gap-2 text-violet-600 font-semibold">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{event.time}</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Badge variant="outline" className="mb-2 text-xs border-violet-600 text-violet-600">
                          {event.category}
                        </Badge>
                        <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{event.speaker}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
