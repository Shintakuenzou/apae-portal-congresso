/**
 * @module hooks/useAtividade
 * @description Hook para buscar atividades do congresso via dataset Fluig.
 *
 * @example
 * ```tsx
 * const { atividades } = useAtividade("123");
 * console.log(atividades?.items); // ActivityFields[]
 * ```
 */
import { fetchDataset, type DatasetConstraint } from "@/services/fetch-dataset";
import type { ActivityFields } from "@/types";
import { useQuery } from "@tanstack/react-query";

/**
 * Busca as atividades do congresso, opcionalmente filtradas por lote.
 *
 * @param id_lote - ID do lote para filtrar as atividades (opcional).
 * @returns Objeto contendo `atividades` com os dados retornados.
 */
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
    queryKey: ["evento_atividade"],

    queryFn: async () =>
      fetchDataset<ActivityFields>({
        datasetId: "cadAtividadeCN",
        constraints: constraint,
      }),
  });

  return { atividades };
}
