import { Calendar, MapPin, QrCode } from "lucide-react";
import LogoApae from "/public/logo-transparente.png";
import { Separator } from "@/components/ui/separator";

interface TicketCardProps {
  user: {
    nome: string;
    sobrenome?: string;
    cpf: string;
    inscricao: string;
  };
}

export function TicketCard({ user }: TicketCardProps) {
  return (
    <div className="border-2 border-dashed border-violet-600/30 rounded-xl overflow-hidden">
      <div className="bg-violet-950 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Congresso Nacional</p>
            <h2 className="text-2xl font-bold">APAE Brasil 2026</h2>
          </div>
          <div className="h-12 w-12 bg-white/10 rounded-lg flex items-center justify-center">
            <img src={LogoApae} alt="A" />
          </div>
        </div>
      </div>

      <div className="p-6 bg-card">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Participante</p>
              <p className="font-semibold text-lg">
                {user.nome} {user.sobrenome}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">CPF</p>
                <p className="font-medium">{user.cpf}</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">29 a 30 de Novembro até 01 de Dezembro, 2026</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">Salvador - BA</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg">
            <QrCode className="h-24 w-24 text-foreground" />
            <p className="text-xs text-muted-foreground mt-2">Código de acesso</p>
            <p className="font-mono text-sm font-medium">{user.inscricao}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
