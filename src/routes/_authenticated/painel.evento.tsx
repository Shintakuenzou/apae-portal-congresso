import { useMemo, useState } from "react";
import { eachDayOfInterval, isWithinInterval, parseISO } from "date-fns";
import { useLotes } from "@/hooks/useLotes";
import { createFileRoute } from "@tanstack/react-router";
import { handleUpdateFormParticipant, type ActivityFields, type EventoFields, type LoteFields } from "@/services/form-service";
import { type VinculoFields } from "@/hooks/useVinculo";
import { fetchDataset } from "@/services/fetch-dataset";
import { useAuth } from "@/context/auth-context";
import { LoadingScreen } from "@/components/loading";
import { AvailableEvents } from "@/components/painel/evento/available-events";
import { EventDetails } from "@/components/painel/evento/event-details";
import { toast } from "sonner";
import type { Payment } from "@/types/payment-type";

export const Route = createFileRoute("/_authenticated/painel/evento")({
  component: RouteComponent,
  pendingComponent: LoadingScreen,
  loader: async () => {
    const lote = await fetchDataset<LoteFields>({ datasetId: import.meta.env.VITE_FORM_LOTES as string });

    if (lote.items.length < 0) {
      throw new Error("Lote não encontrado");
    }

    const loteId: string = lote.items[0]?.documentId;

    const [atividade, vinculo_palestra_atividade, evento] = await Promise.all([
      fetchDataset<ActivityFields>({
        datasetId: import.meta.env.VITE_DATASET_ATIVIDADE as string,
        constraints: [
          {
            fieldName: "id_lote",
            initialValue: loteId,
            finalValue: loteId,
            constraintType: "MUST",
          },
        ],
      }),
      fetchDataset<VinculoFields>({ datasetId: import.meta.env.VITE_DATASET_VINCULO_PALESTRA_ATIVIDADE as string }),
      fetchDataset<EventoFields>({ datasetId: import.meta.env.VITE_DATASET_EVENTO as string }),
    ]);

    return {
      atividade,
      vinculo_palestra_atividade,
      evento,
    };
  },
});

function RouteComponent() {
  const { user, updateUser } = useAuth();
  const { atividade, evento, vinculo_palestra_atividade } = Route.useLoaderData();
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const { formatedDataLote } = useLotes();
  const [eventoSelecionado, setEventoSelecionado] = useState<LoteFields | null>(null);

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const eventoDatas = useMemo(() => {
    if (!evento.items || evento.items.length === 0) return [];

    if (!evento.items[0].data_inicio || !evento.items[0].data_fim) return [];

    try {
      const dates = eachDayOfInterval({
        start: parseISO(`${evento.items[0].data_inicio}`),
        end: parseISO(`${evento.items[0].data_fim}`),
      });
      return dates;
    } catch {
      return [];
    }
  }, [evento]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    if (!eventoDatas[0]) {
      return null;
    }

    return eventoDatas[0];
  });

  const atividadeComPalestrantes = useMemo(() => {
    if (!atividade?.items || !vinculo_palestra_atividade?.items) return [];

    return atividade?.items?.map((atividade) => ({
      ...atividade,
      palestrantes: vinculo_palestra_atividade.items.filter((vinculo) => vinculo.id_atividade === atividade.documentid),
    }));
  }, [atividade, vinculo_palestra_atividade]);

  const atividadesFiltradas = useMemo(() => {
    if (!atividadeComPalestrantes.length) return [];

    return atividadeComPalestrantes.filter((atividade) => {
      const mesmaData = selectedDate ? isWithinInterval(selectedDate, { start: `${atividade.data_inicio}`, end: `${atividade.data_fim}T${atividade.hora_fim}` }) : true;

      const mesmaCategoria = selectedCategory === "Todos" || atividade.eixo === selectedCategory;

      return mesmaData && mesmaCategoria;
    });
  }, [atividadeComPalestrantes, selectedDate, selectedCategory]);

  const atividadeCategorias = useMemo(() => {
    if (!atividadeComPalestrantes?.length) return [];

    return [...new Set(atividadeComPalestrantes?.map((atividade) => atividade.eixo))];
  }, [atividadeComPalestrantes]);

  async function handlePayment() {
    setIsProcessingPayment(true);
    const email = user?.email ?? "";
    const titulo = eventoSelecionado?.nome ?? "";
    const preco = 0.01;

    const refId = (eventoSelecionado as any)?.documentid ?? eventoSelecionado?.documentId ?? "";

    const rawPayload = `${email}|${titulo}|${preco}|${refId}`;
    const payload = btoa(unescape(encodeURIComponent(rawPayload)));

    try {
      const response = await fetchDataset<Payment>({
        datasetId: "pagCN",
        constraints: [
          {
            fieldName: "ref_id",
            initialValue: payload,
            finalValue: payload,
            constraintType: "MUST",
          },
        ],
      });

      const item = response.items[0];

      if (item?.status === "SUCCESS") {
        handleToggleAtividade([...user?.atividades!]);
        toast.success("Compra processada com sucesso!");

        window.open(item.init_point);
      } else {
        toast.error("Erro no pagamento, tente novamente ou entre em contato com o suporte");
      }
    } catch (error) {
      console.error("Erro no pagamento:", error);
      toast.error("Erro no pagamento, tente novamente ou entre em contato com o suporte");
    } finally {
      setIsProcessingPayment(false);
    }
  }

  const handleToggleAtividade = async (novasAtividades: string[]) => {
    await handleUpdateFormParticipant({
      documentId: import.meta.env.VITE_FORM_PARTICIPANTE as string,
      cardId: user!.documentid,
      values: [{ fieldId: "atividades", value: JSON.stringify(novasAtividades) }],
    });
  };

  return (
    <div className="space-y-6 col-span-4 lg:col-span-3">
      {eventoSelecionado ? (
        <EventDetails
          user={user}
          evento={eventoSelecionado}
          onBack={() => setEventoSelecionado(null)}
          isProcessingPayment={isProcessingPayment}
          onPayment={handlePayment}
          eventoDatas={eventoDatas}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          atividadeCategorias={atividadeCategorias}
          atividadesFiltradas={atividadesFiltradas}
          updateUser={updateUser}
        />
      ) : (
        <AvailableEvents eventos={formatedDataLote} onSelectEvent={setEventoSelecionado} />
      )}
    </div>
  );
}
