import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";

interface PendingTicketProps {
  status: "pending" | string;
}

export function PendingTicket({ status }: PendingTicketProps) {
  return (
    <div className="text-center py-12">
      <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <Ticket className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">Ingresso Indisponível</h3>
      <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
        {status === "pending" ? "Seu ingresso estará disponível assim que o pagamento for confirmado." : "É necessário realizar o pagamento para ter acesso ao ingresso."}
      </p>
      <Button variant="outline" className="mt-4">
        Ver Status do Pagamento
      </Button>
    </div>
  );
}
