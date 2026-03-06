import { handleGetFormParticipant, parseEventoCard } from "@/services/form-service";
import { useQuery } from "@tanstack/react-query";

export function useEvents() {
  const { data: evento, isLoading } = useQuery({
    queryKey: ["evento_congresso"],
    queryFn: async () => handleGetFormParticipant({ documentId: import.meta.env.VITE_FORM_EVENTO as string }),
  });
  console.log(import.meta.env.VITE_FORM_EVENTO);

  console.log("evento: ", evento);
  const formatedDataEvento = evento?.items?.map(parseEventoCard);
  console.log("formatedDataEvento: ", formatedDataEvento);

  return { formatedDataEvento, isLoading };
}
