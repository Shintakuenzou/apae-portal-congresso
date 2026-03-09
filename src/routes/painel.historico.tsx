/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { OrderCard } from "@/components/painel/historico/order-card";

export const Route = createFileRoute("/painel/historico")({
  component: RouteComponent,
});

const historicoCompras: any = [];

function RouteComponent() {
  const [compraSelecionada, setCompraSelecionada] = useState<any>();

  return (
    <>
      {!compraSelecionada && (
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-xl">Histórico de Compras</CardTitle>
            <p className="text-sm text-muted-foreground">Acompanhe todas as suas compras e status de pagamento</p>
          </CardHeader>

          <CardContent className="space-y-4">
            {historicoCompras.length === 0 ? (
              <div className="text-center py-12">
                <EmptyState title="Nenhum histórico de compras no momento" description="" type="no-data" />
              </div>
            ) : (
              historicoCompras.map((compra: any) => <OrderCard key={compra.id} compra={compra} onClick={setCompraSelecionada} />)
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
