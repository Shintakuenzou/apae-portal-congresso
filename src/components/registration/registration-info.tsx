import { Calendar, MapPin, Ticket } from "lucide-react";

export function RegistrationInfo() {
  return (
    <div>
      <h2 className="text-3xl sm:text-4xl font-bold mb-6">Garanta sua Vaga</h2>
      <p className="text-lg text-white/80 mb-8">Faça sua inscrição agora e participe do maior evento do movimento apaeano brasileiro. Vagas limitadas!</p>

      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-violet-800 rounded-lg">
            <Ticket className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Inscrição Antecipada</h3>
            <p className="text-white/70 text-sm">Garanta seu lugar com desconto até 30 de Junho de 2026</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-violet-800 rounded-lg">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">4 Dias de Evento</h3>
            <p className="text-white/70 text-sm">Acesso completo a todas as palestras, workshops e atividades</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-violet-800 rounded-lg">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Local Acessível</h3>
            <p className="text-white/70 text-sm">Centro de Convenções com total acessibilidade</p>
          </div>
        </div>
      </div>

      <div className="mt-10 p-6 bg-white/10 rounded-lg">
        <div className="text-sm text-white/70 mb-2">Investimento</div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold">R$ 350</span>
          <span className="text-white/70 line-through">R$ 500</span>
        </div>
        <div className="text-sm text-violet-400 mt-1">Desconto de 30% até 30/06/2026</div>
      </div>
    </div>
  );
}
