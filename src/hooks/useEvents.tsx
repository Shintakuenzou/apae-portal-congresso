import { handleGetFormParticipant, parseEventoCard } from "@/services/form-service";
import { useQuery } from "@tanstack/react-query";

export function useEvents() {
  const { data: evento, isLoading } = useQuery({
    queryKey: ["evento_congresso"],
    queryFn: async () => handleGetFormParticipant({ documentId: import.meta.env.VITE_FORM_EVENTO as string }),
  });

  const formatedDataEvento = evento?.items?.map(parseEventoCard);

  return { formatedDataEvento, isLoading };
}
