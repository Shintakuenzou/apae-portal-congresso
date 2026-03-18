import { useMemo, useState } from "react";
import { eachDayOfInterval, isWithinInterval, parseISO } from "date-fns";
import { createFileRoute } from "@tanstack/react-router";
import { handlePostFormParticipant, handleUpdateFormParticipant, type ActivityFields, type EventoFields, type LoteFields } from "@/services/form-service";
import { type VinculoFields } from "@/hooks/useVinculo";
import { fetchDataset } from "@/services/fetch-dataset";
import { useAuth } from "@/context/auth-context";
import { LoadingScreen } from "@/components/loading";
import { AvailableEvents } from "@/components/painel/evento/available-events";
import { EventDetails } from "@/components/painel/evento/event-details";
import { toast } from "sonner";
import type { Payment } from "@/types/payment-type";
import type { Purchase } from "@/components/purchase-history-card";
import { validarHorariosPreenchidos } from "@/utils/validation-helper";
import type { FluigPostResponse } from "@/types";

interface LoaderData {
  atividade: { items: ActivityFields[]; hasNext?: boolean };
  vinculo_palestra_atividade: { items: VinculoFields[]; hasNext?: boolean };
  evento: { items: EventoFields[]; hasNext?: boolean };
  activeLote: LoteFields[];
  orders: { items: Purchase[]; hasNext?: boolean };
}

const defaultLoaderData: LoaderData = {
  atividade: { items: [] },
  vinculo_palestra_atividade: { items: [] },
  evento: { items: [] },
  activeLote: [],
  orders: { items: [] },
};

// ✅ Helper: garante que atividades seja sempre string[]
function parseAtividades(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
}

export const Route = createFileRoute("/_authenticated/painel/evento")({
  loader: async (): Promise<LoaderData> => {
    try {
      const lote = await fetchDataset<LoteFields>({ datasetId: import.meta.env.VITE_DATASET_LOTE as string });

      const activeLote = lote.items.filter((lote) => lote.status === "ATIVO");

      const evento = await fetchDataset<EventoFields>({
        datasetId: import.meta.env.VITE_DATASET_EVENTO as string,
      });

      const atividade = await fetchDataset<ActivityFields>({
        datasetId: import.meta.env.VITE_DATASET_ATIVIDADE as string,
        constraints: [
          {
            fieldName: "id_evento",
            initialValue: evento.items[0].documentid,
            finalValue: evento.items[0].documentid,
            constraintType: "MUST",
          },
        ],
      });

      const vinculo_palestra_atividade = await fetchDataset<VinculoFields>({
        datasetId: import.meta.env.VITE_DATASET_VINCULO_PALESTRA_ATIVIDADE as string,
      });

      const orders = await fetchDataset<Purchase>({
        datasetId: import.meta.env.VITE_DATASET_PEDIDO as string,
      });

      return {
        atividade,
        vinculo_palestra_atividade,
        evento,
        activeLote,
        orders,
      };
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      return defaultLoaderData;
    }
  },

  pendingComponent: LoadingScreen,
  component: RouteComponent,
});

function RouteComponent() {
  const { user, updateUser } = useAuth();
  const { atividade, evento, vinculo_palestra_atividade, activeLote, orders } = Route.useLoaderData();
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [eventoSelecionado, setEventoSelecionado] = useState<LoteFields | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const filterOrderByUserId = orders.items.filter((order) => order.id_participante == user?.documentid);

  console.log("filterOrderByUserId: ", filterOrderByUserId);

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
    return eventoDatas[0] ?? null;
  });

  const atividadeComPalestrantes = useMemo(() => {
    if (!atividade?.items || !vinculo_palestra_atividade?.items) return [];

    return atividade.items.map((atividade) => ({
      ...atividade,
      palestrantes: vinculo_palestra_atividade.items.filter((vinculo) => vinculo.id_atividade == atividade.documentid),
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
    return [...new Set(atividadeComPalestrantes.map((atividade) => atividade.eixo))];
  }, [atividadeComPalestrantes]);

  // ✅ NOVA VALIDAÇÃO: Verifica se todos os horários do dia estão preenchidos
  const validacaoHorarios = useMemo(() => {
    const atividadesAtuais = parseAtividades(user?.atividades);

    // Filtra apenas as atividades selecionadas do dia atual
    const atividadesDoDiaSelecionado = atividadeComPalestrantes.filter((atividade) => {
      const estaNoIntervalo = selectedDate
        ? isWithinInterval(selectedDate, {
            start: `${atividade.data_inicio}`,
            end: `${atividade.data_fim}T${atividade.hora_fim}`,
          })
        : false;
      return estaNoIntervalo && atividadesAtuais.includes(String(atividade.documentid));
    });

    // Define horários do evento (você pode ajustar conforme necessário)
    const horaInicio = "08:00"; // Ajuste conforme seu evento
    const horaFim = "18:00"; // Ajuste conforme seu evento

    return validarHorariosPreenchidos(atividadesDoDiaSelecionado, horaInicio, horaFim);
  }, [user?.atividades, atividadeComPalestrantes, selectedDate]);

  async function handlePayment() {
    // ✅ VALIDAÇÃO ANTES DO PAGAMENTO
    // if (!validacaoHorarios.valido) {
    //   toast.error(validacaoHorarios.mensagem, {
    //     position: "top-center",
    //     style: { width: "550px", height: "auto", fontSize: "0.85rem" },
    //   });
    //   return;
    // }

    setIsProcessingPayment(true);

    try {
      const atividadesAtuais = parseAtividades(user?.atividades);

      let responsePedido: FluigPostResponse | null = null;

      for (const atividade of atividadesAtuais) {
        const activity_id_to_string = String(atividade);

        responsePedido = await handlePostFormParticipant({
          documentId: import.meta.env.VITE_FORM_PEDIDO as string,
          values: [
            { fieldId: "id_participante", value: user?.documentid as string },
            { fieldId: "id_lote", value: eventoSelecionado?.documentid as string },
            { fieldId: "id_evento", value: evento.items[0].documentid as string },
            { fieldId: "nome_evento", value: evento.items[0].titulo as string },
            { fieldId: "data_compra", value: new Date().toISOString() },
            { fieldId: "atividades", value: JSON.stringify(atividadesAtuais) },
            { fieldId: "status", value: "pending" },
          ],
        });

        const responseVinculo = await handlePostFormParticipant({
          documentId: import.meta.env.VITE_FORM_VINCULO_PARTICIPANTE_ATIVIDADE as string,
          values: [
            { fieldId: "id_participante", value: user?.documentid as string },
            { fieldId: "id_atividade", value: activity_id_to_string },
            { fieldId: "id_pedido", value: String(responsePedido.cardId) },
            { fieldId: "criado_em", value: new Date().toISOString() },
            { fieldId: "criado_por", value: user?.nome as string },
            { fieldId: "id_evento", value: evento.items[0].documentid as string },
            { fieldId: "status", value: "pending" },
          ],
        });

        console.log("responseVinculo: ", responseVinculo);
      }

      if (responsePedido) {
        const email = user?.email ?? "";
        const titulo = eventoSelecionado?.nome ?? "";
        const preco = eventoSelecionado?.preco;
        const refId = responsePedido.cardId;

        const rawPayload = `${email}|${titulo}|${preco}|${refId}`;
        const payload = btoa(unescape(encodeURIComponent(rawPayload)));

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
          // ✅ Passa array limpo para o toggle
          await handleToggleAtividade(atividadesAtuais);
          toast.success("Compra processada com sucesso!");
          window.open(item.init_point);
        } else {
          toast.error("Erro no pagamento, tente novamente ou entre em contato com o suporte");
        }
      }
    } catch (error) {
      console.error("Erro no pagamento:", error);
      toast.error("Erro no pagamento, tente novamente ou entre em contato com o suporte");
    } finally {
      setIsProcessingPayment(false);
    }
  }

  // ✅ Recebe string[] limpo, faz stringify apenas uma vez
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
          validacaoHorarios={validacaoHorarios}
        />
      ) : (
        <AvailableEvents eventos={activeLote} onSelectEvent={setEventoSelecionado} />
      )}
    </div>
  );
}
