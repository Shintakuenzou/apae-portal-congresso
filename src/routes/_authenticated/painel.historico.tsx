import { createFileRoute } from "@tanstack/react-router";
import { fetchDataset } from "@/services/fetch-dataset";
import { PurchaseHistoryList, type Purchase } from "@/components/purchase-history-card";

export const Route = createFileRoute("/_authenticated/painel/historico")({
  head: () => ({
    meta: [
      {
        title: "Histórico de Compras - Painel",
      },
    ],
  }),
  loader: async () => {
    try {
      const responsePedido = await fetchDataset<Purchase>({
        datasetId: import.meta.env.VITE_DATASET_PEDIDO as string,
      });
      console.log("responsePedido: ", responsePedido);

      return {
        historicoCompras: responsePedido.items,
      };
    } catch (error) {
      console.error("Erro ao carregar histórico de compras:", error);
      return {
        historicoCompras: [],
      };
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { historicoCompras } = Route.useLoaderData();
  console.log("historicoCompras: ", historicoCompras);

  return <PurchaseHistoryList purchases={historicoCompras} />;
}
