import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-context";
import { createFileRoute } from "@tanstack/react-router";
import { Calendar, MapPin, QrCode, Ticket } from "lucide-react";
import LogoApae from "../../public/logo-transparente.png";

export const Route = createFileRoute("/painel/ingresso")({
  component: RouteComponent,
});

const mockPagamento = {
  status: "aprovado",
};
function RouteComponent() {
  const { user } = useAuth();

  return (
    <>
      <Card className="col-span-4 lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-xl">Meu Ingresso</CardTitle>
        </CardHeader>

        <CardContent>
          {mockPagamento.status === "aprovado" ? (
            <div className="space-y-6">
              {/* Ingresso Visual */}
              <div className="border-2 border-dashed border-primary/30 rounded-xl overflow-hidden">
                <div className="bg-primary text-primary-foreground p-6">
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
                          {user!.nome} {user!.sobrenome}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">CPF</p>
                          <p className="font-medium">{user!.cpf}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Inscrição</p>
                          <p className="font-medium">{user!.inscricao}</p>
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
                      <p className="font-mono text-sm font-medium">{user!.inscricao}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Ingresso Indisponível</h3>
              <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                {mockPagamento.status === "pendente"
                  ? "Seu ingresso estará disponível assim que o pagamento for confirmado."
                  : "É necessário realizar o pagamento para ter acesso ao ingresso."}
              </p>
              <Button variant="outline" className="mt-4">
                Ver Status do Pagamento
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
