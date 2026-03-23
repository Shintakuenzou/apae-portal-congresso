/**
 * @module hooks/useEvents
 * @description Hook para buscar os eventos/congressos cadastrados no Fluig.
 *
 * @example
 * ```tsx
 * const { formatedDataEvento, isLoading } = useEvents();
 * ```
 */
import { handleGetFormParticipant, parseEventoCard } from "@/services/form-service";
import { useQuery } from "@tanstack/react-query";

/**
 * Busca e parseia os eventos do congresso.
 *
 * @returns Objeto contendo `formatedDataEvento` (eventos parseados) e `isLoading`.
 */
export function useEvents() {
  const { data: evento, isLoading } = useQuery({
    queryKey: ["evento_congresso"],
    queryFn: async () => handleGetFormParticipant({ documentId: import.meta.env.VITE_FORM_EVENTO as string }),
  });

  const formatedDataEvento = evento?.items?.map(parseEventoCard);

  return { formatedDataEvento, isLoading };
}
