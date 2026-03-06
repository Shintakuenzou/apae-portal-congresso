import { fetchDataset, type DatasetConstraint } from "@/services/fetch-dataset";
import type { ActivityFields } from "@/services/form-service";
import { useQuery } from "@tanstack/react-query";

export function useAtividade(id_lote?: string) {
  const constraint: DatasetConstraint[] = [];

  if (id_lote) {
    constraint.push({
      fieldName: "id_lote",
      initialValue: id_lote,
      finalValue: id_lote,
      constraintType: "MUST",
    });
  }

  const { data: atividades } = useQuery({
    queryKey: ["evento_atividade", id_lote],

    queryFn: async () =>
      fetchDataset<ActivityFields>({
        datasetId: "cadAtividadeCN",
        constraints: constraint,
      }),
    enabled: !!id_lote,
  });

  return { atividades };
}
