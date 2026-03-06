import { handleGetFormParticipant, parseLoteCard } from "@/services/form-service";
import { useQuery } from "@tanstack/react-query";

export function useLotes() {
  const { data: evento } = useQuery({
    queryKey: ["lotes_evento"],
    queryFn: async () => handleGetFormParticipant({ documentId: import.meta.env.VITE_FORM_LOTES as string }),
  });

  const formatedDataLote = evento?.items?.map(parseLoteCard);

  return { formatedDataLote };
}
