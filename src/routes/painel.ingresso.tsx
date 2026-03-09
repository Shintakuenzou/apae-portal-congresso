import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { createFileRoute } from "@tanstack/react-router";
import { TicketCard } from "@/components/painel/ticket-card";
import { PendingTicket } from "@/components/painel/pending-ticket";

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
              <TicketCard
                user={{
                  nome: user!.nome,
                  sobrenome: user!.sobrenome,
                  cpf: user!.cpf,
                  inscricao: user!.inscricao,
                }}
              />
            </div>
          ) : (
            <PendingTicket status={mockPagamento.status} />
          )}
        </CardContent>
      </Card>
    </>
  );
}
