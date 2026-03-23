/**
 * @module hooks/useVinculo
 * @description Hook para buscar vínculos entre palestrantes e atividades do congresso.
 *
 * @example
 * ```tsx
 * const { vinculo } = useVinculo();
 * console.log(vinculo?.items); // VinculoFields[]
 * ```
 */
import { fetchDataset } from "@/services/fetch-dataset";
import type { VinculoFields } from "@/types";
import { useQuery } from "@tanstack/react-query";

/**
 * Busca os vínculos entre palestrantes e atividades via dataset.
 *
 * @returns Objeto contendo `vinculo` com a lista de vínculos.
 */
export function useVinculo() {
  const { data: vinculo } = useQuery({
    queryKey: ["vincPalestraAtividadeCN"],
    queryFn: async () =>
      await fetchDataset<VinculoFields>({
        datasetId: "vincPalestraAtividadeCN",
      }),
  });

  return { vinculo };
}
