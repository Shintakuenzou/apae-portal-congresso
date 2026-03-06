import { fetchDataset, type DatasetConstraint } from "@/services/fetch-dataset";
import type { PalestranteFields } from "@/services/form-service";
import { useQuery } from "@tanstack/react-query";

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

  const { data: palestrantes } = useQuery({
    queryKey: ["palestrantes"],
    queryFn: async () =>
      await fetchDataset<PalestranteFields>({
        datasetId: "cadPalestranteCN",
        constraints,
      }),
    enabled: !!event_id,
  });

  return { palestrantes };
}
