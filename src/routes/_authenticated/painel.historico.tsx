import { createFileRoute } from "@tanstack/react-router";
import { fetchDataset } from "@/services/fetch-dataset";
import { PurchaseHistoryList, type Purchase } from "@/components/purchase-history-card";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/context/auth-context";

const purchaseHistory = queryOptions({
  queryKey: ["purchase-history"],
  queryFn: async () => {
    const response = await fetchDataset<Purchase>({
      datasetId: import.meta.env.VITE_DATASET_PEDIDO as string,
    });
    return response.items;
  },
});

export const Route = createFileRoute("/_authenticated/painel/historico")({
  head: () => ({
    meta: [
      {
        title: "Histórico de Compras - Painel",
      },
    ],
  }),
  loader: async () => queryClient.ensureQueryData(purchaseHistory),
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();

  const { data: historicoCompras } = useQuery<Purchase[]>({
    queryKey: ["purchase"],
    queryFn: async () => {
      const response = await fetchDataset<Purchase>({
        datasetId: import.meta.env.VITE_DATASET_PEDIDO as string,
      });
      return response.items;
    },
    refetchInterval: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
  console.log("historicoCompras: ", historicoCompras);

  return <PurchaseHistoryList purchases={historicoCompras ?? []} />;
}
