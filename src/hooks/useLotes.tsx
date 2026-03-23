/**
 * @module hooks/useLotes
 * @description Hook para buscar os lotes de ingressos disponíveis no Fluig.
 *
 * @example
 * ```tsx
 * const { formatedDataLote } = useLotes();
 * ```
 */
import { handleGetFormParticipant, parseLoteCard } from "@/services/form-service";
import { useQuery } from "@tanstack/react-query";

/**
 * Busca e parseia os lotes de ingressos do congresso.
 *
 * @returns Objeto contendo `formatedDataLote` (lotes parseados).
 */
export function useLotes() {
  const { data: evento } = useQuery({
    queryKey: ["lotes_evento"],
    queryFn: async () => handleGetFormParticipant({ documentId: import.meta.env.VITE_FORM_LOTES as string }),
  });

  const formatedDataLote = evento?.items?.map(parseLoteCard);

  return { formatedDataLote };
}
