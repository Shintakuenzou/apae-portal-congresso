/**
 * @module routes/_authenticated/painel.evento
 * @description Página do painel de compra de evento/ingresso.
 * Exibe lotes disponíveis e detalhes do evento com seleção de atividades.
 */
import { useMemo, useState } from "react";
import { eachDayOfInterval, isWithinInterval, parseISO } from "date-fns";
import { createFileRoute } from "@tanstack/react-router";
import { handlePostFormParticipant, handleUpdateFormParticipant, type ActivityFields, type EventoFields, type LoteFields } from "@/services/form-service";
import type { ClassFields, VagasFields, VinculoFields } from "@/types";
import { fetchDataset } from "@/services/fetch-dataset";
import { useAuth } from "@/context/auth-context";
import { LoadingScreen } from "@/components/loading";
import { AvailableEvents } from "@/components/painel/evento/available-events";
import { EventDetails } from "@/components/painel/evento/event-details";
import { toast } from "sonner";
import type { Payment } from "@/types/payment-type";
import type { Purchase } from "@/types/purchase.types";
import { validarHorariosPreenchidos } from "@/utils/validation-helper";
import { parseAtividades } from "@/utils/parse-atividades";
import { useQuery } from "@tanstack/react-query";

/** Dados carregados pelo loader da rota. */
interface LoaderData {
  // atividade: { items: ActivityFields[]; hasNext?: boolean };
  vinculo_palestra_atividade: { items: VinculoFields[]; hasNext?: boolean };
  evento: { items: EventoFields[]; hasNext?: boolean };
  activeLote: LoteFields[];
  orders: { items: Purchase[]; hasNext?: boolean };
  availableVacancies: { items: VagasFields[]; hasNext?: boolean };
  eventClasses: { items: ClassFields[]; hasNext?: boolean };
}

const defaultLoaderData: LoaderData = {
  // atividade: { items: [] },
  vinculo_palestra_atividade: { items: [] },
  evento: { items: [] },
  activeLote: [],
  orders: { items: [] },
  availableVacancies: { items: [] },
  eventClasses: { items: [] },
};

export const Route = createFileRoute("/_authenticated/painel/evento")({
  head: () => ({
    meta: [{ title: "Painel Compras - Evento  | APAE BRASIL" }],
  }),
  loader: async (): Promise<LoaderData> => {
    try {
      const lote = await fetchDataset<LoteFields>({ datasetId: import.meta.env.VITE_DATASET_LOTE as string });

      const activeLote = lote.items.filter((lote) => lote.status === "ATIVO");

      const evento = await fetchDataset<EventoFields>({
        datasetId: import.meta.env.VITE_DATASET_EVENTO as string,
      });

      // const atividade = await fetchDataset<ActivityFields>({
      //   datasetId: import.meta.env.VITE_DATASET_ATIVIDADE as string,
      //   constraints: [
      // {
      //   fieldName: "id_evento",
      //   initialValue: evento.items[0].documentid,
      //   finalValue: evento.items[0].documentid,
      //   constraintType: "MUST",
      // },
      //   ],
      // });

      const vinculo_palestra_atividade = await fetchDataset<VinculoFields>({
        datasetId: import.meta.env.VITE_DATASET_VINCULO_PALESTRA_ATIVIDADE as string,
      });

      const orders = await fetchDataset<Purchase>({
        datasetId: import.meta.env.VITE_DATASET_PEDIDO as string,
      });

      const availableVacancies = await fetchDataset<VagasFields>({ datasetId: import.meta.env.VITE_DATASET_VAGAS_DISPONIVEL as string });

      const eventClasses = await fetchDataset<ClassFields>({ datasetId: import.meta.env.VITE_DATASET_SALA as string });

      return {
        // atividade,
        vinculo_palestra_atividade,
        evento,
        activeLote,
        orders,
        availableVacancies,
        eventClasses,
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
  const { evento, vinculo_palestra_atividade, activeLote, orders, availableVacancies, eventClasses } = Route.useLoaderData();
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [eventoSelecionado, setEventoSelecionado] = useState<LoteFields | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  console.log("orders: ", orders);

  const { data: atividades } = useQuery({
    queryKey: ["atividades"],
    queryFn: async () =>
      await fetchDataset<ActivityFields>({
        datasetId: import.meta.env.VITE_DATASET_ATIVIDADE as string,
        constraints: [
          {
            fieldName: "id_evento",
            initialValue: evento.items[0].documentid,
            finalValue: evento.items[0].documentid,
            constraintType: "MUST",
          },
        ],
      }),
  });

  const eventClassId = useMemo(() => {
    return eventClasses.items.map((eventClass) => {
      return [String(eventClass.documentid), eventClass.qtd_vagas];
    });
  }, []);

  const convertToArrayEventClassesToObbject = Object.fromEntries(eventClassId);

  const classQuantitys = useMemo(() => {
    return availableVacancies.items.map((vacancie) => {
      return [vacancie.id_atividade, vacancie.quantidade];
    });
  }, []);

  const convertToArrayVacantieAvailableToObject = Object.fromEntries(classQuantitys);

  const atividade = useMemo(() => {
    return atividades?.items.map((activity) => {
      return {
        ...activity,
        vagas_disponiveis: Math.ceil(convertToArrayEventClassesToObbject[activity.id_sala] * 0.9),
        esgotado: convertToArrayVacantieAvailableToObject[activity.documentid] >= Math.ceil(convertToArrayEventClassesToObbject[activity.id_sala] * 0.9),
      };
    });
  }, [atividades, convertToArrayVacantieAvailableToObject, convertToArrayEventClassesToObbject]);

  const filterOrderByUserId = useMemo(() => {
    return orders.items.filter((order) => order.id_participante == user?.documentid);
  }, []);

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
    if (!atividade || !vinculo_palestra_atividade?.items) return [];

    return atividade.map((atividade) => ({
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

  /**
   * Finaliza a seleção de atividades do evento e inicia o processo de pagamento.
   * - Valida se o usuário preencheu todos os horários.
   * - Cria um registro de Pedido no dataset via API do Fluig.
   * - Cria registros de Vinculo para cada atividade selecionada no dataset via API do Fluig.
   * - Gera o link de pagamento do Mercado Pago através de uma API Gateway local.
   */
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

      const responsePedido = await handlePostFormParticipant({
        documentId: import.meta.env.VITE_FORM_PEDIDO as string,
        values: [
          { fieldId: "id_participante", value: user?.documentid as string },
          { fieldId: "id_lote", value: eventoSelecionado?.documentid as string },
          { fieldId: "id_evento", value: evento.items[0].documentid as string },
          { fieldId: "nome_evento", value: evento.items[0].titulo as string },
          { fieldId: "data_compra", value: new Date().toISOString() },
          { fieldId: "status", value: "pending" },
        ],
      });

      for (const atividade of atividadesAtuais) {
        const activity_id_to_string = String(atividade);

        await handlePostFormParticipant({
          documentId: import.meta.env.VITE_FORM_VINCULO_PARTICIPANTE_ATIVIDADE as string,
          values: [
            { fieldId: "id_participante", value: user?.documentid as string },
            { fieldId: "id_atividade", value: activity_id_to_string },
            { fieldId: "id_pedido", value: String(responsePedido.cardId) },
            { fieldId: "criado_em", value: new Date().toISOString() },
            { fieldId: "criado_por", value: user?.nome as string },
            { fieldId: "id_evento", value: String(evento.items[0].documentid) },
            { fieldId: "status", value: "pending" },
          ],
        });
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
        <AvailableEvents eventos={activeLote} filterOrderByUserId={filterOrderByUserId} onSelectEvent={setEventoSelecionado} />
      )}
    </div>
  );
}
