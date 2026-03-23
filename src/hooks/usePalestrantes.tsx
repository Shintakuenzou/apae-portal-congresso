/**
 * @module hooks/usePalestrantes
 * @description Hook para buscar os palestrantes do congresso via dataset Fluig.
 *
 * @example
 * ```tsx
 * const { palestrantes, isLoading } = usePalestrantes("evento-123");
 * ```
 */
import { fetchDataset, type DatasetConstraint } from "@/services/fetch-dataset";
import type { PalestranteFields } from "@/types";
import { useQuery } from "@tanstack/react-query";

/**
 * Busca palestrantes, opcionalmente filtrados por evento.
 *
 * @param event_id - ID do evento para filtrar palestrantes (opcional).
 * @returns Objeto contendo `palestrantes` e `isLoading`.
 */
export function usePalestrantes(event_id?: string) {
  const constraints: DatasetConstraint[] = [];

  if (event_id) {
    constraints.push({
      fieldName: "id_evento",
      initialValue: event_id,
      finalValue: event_id,
      constraintType: "MUST",
    });
  }

  const { data: palestrantes, isLoading } = useQuery({
    queryKey: ["palestrantes", event_id],
    queryFn: async () =>
      await fetchDataset<PalestranteFields>({
        datasetId: "cadPalestranteCN",
        constraints,
      }),
  });

  return { palestrantes, isLoading };
}
