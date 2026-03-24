import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TicketCard } from "@/components/painel/ticket-card";
import { fetchDataset } from "@/services/fetch-dataset";
import { useMutation, useQuery, type UseMutationResult } from "@tanstack/react-query";
import { EmptyState } from "@/components/empty-state";
import { Separator } from "@/components/ui/separator";
import { Clock, MapPin, ArrowRightLeft, AlertCircle, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// ✅ Importar parseISO
import { format, isSameDay, parseISO } from "date-fns";
import type { ActivityFields, FluigPostResponse } from "@/types";
import { useMemo, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { handleUpdateFormParticipant } from "@/services/form-service";
import { queryClient } from "@/lib/queryClient";
import { toast } from "sonner";
import type { AvailableVacanciesFields } from "@/types/entities.types";
import { LoadingScreen } from "@/components/loading";

interface ActivitiesRelationParticipant {
  VERSAO_ATIVA: string;
  criado_em: string;
  criado_por: string;
  data_fim: string;
  data_inicio: string;
  descricao: string;
  documentid: string;
  eixo: string;
  hora_fim: string;
  hora_inicio: string;
  id_atividade: string;
  id_evento: string;
  id_participante: string;
  sala: string;
  status: string;
  tipo_atividade: string;
  titulo: string;
}

interface RouteLoaderData {
  resopnseTicketUserInfo: { items: ActivitiesRelationParticipant[]; hasNext: boolean };
  userId: string;
  activities: { items: ActivityFields[]; hasNext: boolean };
  availableVacancies: { items: AvailableVacanciesFields[]; hasNext: boolean };
}

export const Route = createFileRoute("/_authenticated/painel/ingresso")({
  head: () => ({
    meta: [
      {
        title: "Meu Ingresso - Congresso",
      },
      {
        name: "description",
        content: "Meu Ingresso - Congresso",
      },
    ],
  }),
  loader: async ({ context }): Promise<RouteLoaderData | null> => {
    try {
      const userId = context.auth.user?.documentid;

      if (!userId) {
        return {
          resopnseTicketUserInfo: { items: [], hasNext: false },
          userId: "",
          activities: { items: [], hasNext: false },
          availableVacancies: { items: [], hasNext: false },
        };
      }

      const resopnseTicketUserInfo = await fetchDataset<ActivitiesRelationParticipant>({
        datasetId: import.meta.env.VITE_DATASET_BUSCA_ATIVIDADE_VINCULADAS_PARTICIPANTE as string,
        constraints: [
          {
            fieldName: "id_participante",
            initialValue: userId,
            finalValue: userId,
            constraintType: "MUST",
          },
        ],
      });

      const availableVacancies = await fetchDataset<AvailableVacanciesFields>({
        datasetId: import.meta.env.VITE_DATASET_VAGAS_DISPONIVEL as string,
      });

      const activities = await fetchDataset<ActivityFields>({
        datasetId: import.meta.env.VITE_DATASET_ATIVIDADE as string,
      });

      return { resopnseTicketUserInfo, userId, activities, availableVacancies };
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      return {
        resopnseTicketUserInfo: { items: [], hasNext: false },
        userId: "",
        activities: { items: [], hasNext: false },
        availableVacancies: { items: [], hasNext: false },
      };
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  const data = Route.useLoaderData();

  if (!data) {
    return <LoadingScreen />;
  }

  const { resopnseTicketUserInfo, userId, activities } = data;

  const { data: activities_vinc_participant, refetch: refetchActivitiesVincParticipant } = useQuery({
    queryKey: ["activities_vinc_participant"],
    queryFn: async () =>
      await fetchDataset<ActivitiesRelationParticipant>({
        datasetId: import.meta.env.VITE_DATASET_BUSCA_ATIVIDADE_VINCULADAS_PARTICIPANTE as string,
      }),
    initialData: resopnseTicketUserInfo,
  });

  const navigate = useNavigate();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const filteredMyActivities = activities_vinc_participant.items.filter((activitie) => activitie.id_participante == userId);
  const [activityToExchange, setActivityToExchange] = useState<ActivityFields | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // ✅ CORRIGIDO: Comparar dia E hora corretamente
  const sameDayActivities = useMemo(() => {
    if (!selectedActivity) return [];

    return activities.items.filter((otherActivities) => {
      if (selectedActivity.id_atividade == otherActivities.documentid) {
        return false;
      }

      // ✅ Comparar dia com parseISO
      const isSameDays = isSameDay(parseISO(selectedActivity.data_inicio), parseISO(otherActivities.data_inicio));

      // ✅ Comparar hora como string (hora_inicio é "14:30", não data)
      const isSameTime = selectedActivity.hora_inicio === otherActivities.hora_inicio;

      // ✅ Status não aprovado
      const notApproved = selectedActivity.status != "approved";

      return isSameDays && isSameTime && notApproved;
    });
  }, [selectedActivity, activities.items]);

  const status = useMemo(() => {
    if (filteredMyActivities.length === 0) {
      return "";
    }

    const approved = filteredMyActivities.every((activitie) => activitie.status == "approved");
    const pending = filteredMyActivities.every((activitie) => activitie.status == "pending");
    const cancelled = filteredMyActivities.every((activitie) => activitie.status == "cancelled");

    if (approved) {
      return "aprovado";
    }

    if (pending) {
      return "pendente";
    }

    if (cancelled) {
      return "cancelado";
    }

    return "";
  }, [filteredMyActivities]);

  const mutation = useMutation<FluigPostResponse, Error>({
    mutationFn: async () => {
      if (!selectedActivity || !activityToExchange) {
        throw new Error("Selecione uma atividade para trocar");
      }

      return await handleUpdateFormParticipant({
        documentId: import.meta.env.VITE_FORM_VINCULO_PARTICIPANTE_ATIVIDADE as string,
        cardId: selectedActivity.documentid,
        values: [
          { fieldId: "id_atividade", value: activityToExchange.documentid },
          { fieldId: "id_evento", value: selectedActivity.id_evento },
          { fieldId: "id_participante", value: user?.documentid as string },
          { fieldId: "modificado_em", value: new Date().toISOString() },
          { fieldId: "modificado_por", value: user?.nome + " " + user?.sobrenome },
        ],
      });
    },
    onSuccess: () => {
      queryClient.setQueryData(["activities_vinc_participant"], (oldData: any) => {
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,
          items: oldData.items.map((item: ActivitiesRelationParticipant) => {
            if (item.documentid === selectedActivity?.documentid) {
              return {
                ...item,
                id_atividade: activityToExchange?.documentid,
              };
            }
            return item;
          }),
        };
      });

      setIsOpen(false);
      setSelectedActivity(null);
      setActivityToExchange(null);

      refetchActivitiesVincParticipant();

      toast.success("Atividade substituida com sucesso!");
    },
    onError: (error: Error) => {
      console.error("Erro ao trocar atividade:", error);
      toast.error(error.message || "Erro ao trocar atividade");
    },
  });

  function handleSelectActivity(activity: Activity) {
    setSelectedActivity(activity);
  }

  function handleActivityToExchange(activity: ActivityFields) {
    setActivityToExchange(activity);
  }

  return (
    <>
      {status == "pendente" || status == "aprovado" ? (
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-xl">Meu Ingresso</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              <TicketCard
                user={{
                  nome: user!.nome,
                  sobrenome: user!.sobrenome,
                  cpf: user!.cpf,
                  inscricao: user!.inscricao,
                }}
              />
            </div>

            <div className="w-full">
              <section className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Minhas Atividades</h2>
                  <span className="text-sm text-muted-foreground">{filteredMyActivities.length} atividades inscritas</span>
                </div>

                <div className="flex flex-col gap-3">
                  {filteredMyActivities.map((activity) => (
                    <ActivityCard
                      key={activity.documentid}
                      activity={activity}
                      OtherActivities={sameDayActivities}
                      onRequestChange={handleSelectActivity}
                      onActivityToExchange={handleActivityToExchange}
                      activityToExchange={activityToExchange}
                      isOpen={isOpen}
                      setIsOpen={setIsOpen}
                      mutation={mutation}
                      selectedActivity={selectedActivity}
                    />
                  ))}
                </div>
              </section>

              {status == "pendente" && <p className="text-sm text-muted-foreground mt-6 text-center">Clique em "Trocar" para substituir uma atividade por outra disponível.</p>}
            </div>
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          variant="card"
          className="col-span-4 lg:col-span-3"
          title={status == "cancelado" ? "Seu ingresso foi cancelado" : "Nenhum ingresso encontrado"}
          description={
            status == "cancelado"
              ? "Seu ingresso foi cancelado"
              : "Você ainda não realizou a compra de um ingresso. Clique no botão abaixo para adquirir seu ingresso e participar do congresso."
          }
          action={{
            label: "Comprar Ingresso",
            onClick: () => navigate({ to: "/painel/evento" }),
            variant: "default",
          }}
        />
      )}
    </>
  );
}

export interface Activity extends ActivitiesRelationParticipant {}

interface ActivityCardProps {
  activity: Activity;
  onRequestChange?: (activity: Activity) => void;
  onActivityToExchange?: (activity: ActivityFields) => void;
  OtherActivities: ActivityFields[];
  activityToExchange: ActivityFields | null;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  mutation: UseMutationResult<FluigPostResponse, Error, void, unknown>;
  selectedActivity: Activity | null;
}

export function ActivityCard({
  activity,
  onRequestChange,
  onActivityToExchange,
  OtherActivities,
  activityToExchange,
  isOpen,
  setIsOpen,
  mutation,
  selectedActivity,
}: ActivityCardProps) {
  // ✅ CORRIGIDO: Usar parseISO ao invés de concatenação
  const formatedDateInit = format(parseISO(activity.data_inicio), "dd/MM/yyyy");

  function handleSelectActivity() {
    onRequestChange?.(activity);
  }

  function handleActivityToExchange(activity: ActivityFields) {
    onActivityToExchange?.(activity);
  }

  const isActivitySelected = activityToExchange?.documentid !== null;

  function handleOpenModel() {
    setIsOpen(!isOpen);
  }

  async function handlePutActivity() {
    mutation.mutate();
  }

  return (
    <div className="bg-card border rounded-lg p-4 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-violet-800 text-white">{activity.eixo}</Badge>
          </div>

          <h3 className="font-semibold text-foreground mb-2">{activity.titulo}</h3>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>
                {formatedDateInit} às {activity.hora_inicio}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{activity.sala}</span>
            </div>
          </div>
        </div>

        {activity.status !== "approved" && (
          <Dialog open={isOpen} onOpenChange={handleOpenModel}>
            <DialogTrigger asChild>
              <Button variant="outline" className="cursor-pointer bg-violet-600 hover:bg-violet-700 text-white hover:text-white transition-colors" onClick={handleSelectActivity}>
                <ArrowRightLeft className="w-4 h-4" />
                Substituir
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-5xl!">
              <DialogHeader>
                <DialogTitle>Trocar Atividade</DialogTitle>
              </DialogHeader>

              <Separator orientation="horizontal" />

              <div className="space-y-3.5">
                {(mutation.error as Error) && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erro ao trocar atividade</AlertTitle>
                    <AlertDescription>{(mutation.error as Error).message}</AlertDescription>
                  </Alert>
                )}

                {mutation.isSuccess && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Sucesso!</AlertTitle>
                    <AlertDescription className="text-green-700">Atividade trocada com sucesso!</AlertDescription>
                  </Alert>
                )}

                <p className="text-base text-zinc-800 font-medium" role="heading" aria-level={3}>
                  Atividade atual
                </p>

                <Card>
                  <CardHeader className="flex flex-col items-start justify-center gap-2.5 px-5">
                    <CardTitle className="space-y-1.5">
                      <Badge variant="default" className="text-sm bg-violet-900">
                        {selectedActivity?.eixo}
                      </Badge>
                      <div className="text-xl">{selectedActivity?.titulo}</div>
                    </CardTitle>

                    <CardDescription className="space-x-5">
                      <span>
                        {selectedActivity?.data_inicio ? format(parseISO(selectedActivity.data_inicio), "dd/MM/yyyy") : ""} às {selectedActivity?.hora_inicio}
                      </span>
                      <span>{selectedActivity?.sala}</span>
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Separator orientation="horizontal" />

                <p className="text-base text-zinc-800 font-medium" role="heading" aria-level={3}>
                  Atividades disponíveis para troca:
                </p>

                <div className="overflow-y-scroll h-96 space-y-2">
                  {OtherActivities.length > 0 ? (
                    OtherActivities.map((otherActivity) => (
                      <Label
                        key={otherActivity.documentid}
                        htmlFor={otherActivity.documentid}
                        className="cursor-pointer"
                        onClick={() => handleActivityToExchange(otherActivity)}
                        aria-label={otherActivity.titulo}
                      >
                        <Card className="w-full hover:bg-accent transition-colors">
                          <CardHeader className="flex justify-between gap-2.5 px-5">
                            <div className="flex flex-col flex-1">
                              <CardTitle className="space-y-1.5">
                                <Badge variant="default" className="text-sm bg-violet-900">
                                  {otherActivity.eixo}
                                </Badge>
                                <div className="text-xl">{otherActivity.titulo}</div>
                              </CardTitle>

                              <CardDescription className="space-x-5">
                                <span>
                                  {format(parseISO(otherActivity.data_inicio), "dd/MM/yyyy")} às {otherActivity.hora_inicio}
                                </span>
                                <span>{otherActivity.sala}</span>
                              </CardDescription>
                            </div>

                            <Switch
                              id={otherActivity.documentid}
                              checked={activityToExchange?.documentid === otherActivity.documentid}
                              onCheckedChange={() => handleActivityToExchange(otherActivity)}
                              onClick={(e) => e.stopPropagation()}
                              disabled={mutation.isPending}
                            />
                          </CardHeader>
                        </Card>
                      </Label>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <EmptyState title="Nenhuma atividade disponível" description="Nenhuma atividade disponível para troca." className="h-full w-full" />
                    </div>
                  )}
                </div>

                {OtherActivities.length > 0 && (
                  <div className="flex justify-end mt-5 w-full gap-3">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={mutation.isPending} className="cursor-pointer">
                      Cancelar
                    </Button>

                    <Button
                      type="button"
                      className="w-auto bg-violet-600 hover:bg-violet-700 text-white hover:text-white transition-colors cursor-pointer"
                      disabled={!isActivitySelected || mutation.isPending}
                      onClick={handlePutActivity}
                    >
                      <span className="px-5">{mutation.isPending ? "Trocando..." : isActivitySelected ? "Trocar" : "Selecione uma atividade"}</span>
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
