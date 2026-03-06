import type { AxiosError } from "axios";
import { axiosApi } from "./api-root";
import axios from "axios";
import type { FluigCardsResponse, FluigPostResponse, SendFormData, PalestranteFields, EventoFields, LoteFields, ActivityFields } from "@/types";
import { parseFluigEntity } from "./fluig-parser";

// ── Re-exports para retrocompatibilidade ─────────────────────────
// Permite que os imports antigos continuem funcionando durante a migração.
export type { PalestranteFields, EventoFields, LoteFields, ActivityFields };
export type { FluigEntity as Palestrante } from "@/types";
export type { FluigCardsResponse, SendFormData };

// Aliases de parse para retrocompatibilidade
export const parsePalestrante = parseFluigEntity;
export const parsePalestranteCard = (card: Parameters<typeof parseFluigEntity>[0]) => parseFluigEntity<PalestranteFields>(card);
export const parseEventoCard = (card: Parameters<typeof parseFluigEntity>[0]) => parseFluigEntity<EventoFields>(card);
export const parseLoteCard = (card: Parameters<typeof parseFluigEntity>[0]) => parseFluigEntity<LoteFields>(card);
export const parseAtividadeCard = (card: Parameters<typeof parseFluigEntity>[0]) => parseFluigEntity<ActivityFields>(card);
export { parseFluigCard } from "./fluig-parser";

// ── CRUD de Cards do Fluig ───────────────────────────────────────
// form-service.ts — remove a lógica de proxy, usa só o fluigPath
export async function handlePostFormParticipant({ documentId, values }: SendFormData): Promise<FluigPostResponse> {
  if (!documentId || documentId === "undefined") {
    throw new Error("documentId é obrigatório e não pode ser undefined");
  }

  try {
    // ✅ Sempre o path puro — o interceptor cuida do proxy em produção
    const fluigPath = `/ecm-forms/api/v2/cardindex/${documentId}/cards`;
    const response = await axiosApi.post<FluigPostResponse>(fluigPath, { values });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error as AxiosError;
    }
    throw error;
  }
}

export async function handleGetFormParticipant({ documentId, queryParams }: SendFormData): Promise<FluigCardsResponse> {
  if (!documentId || documentId === "undefined") {
    throw new Error("documentId é obrigatório e não pode ser undefined");
  }

  try {
    const baseUrl = `/ecm-forms/api/v2/cardindex/${documentId}/cards`;
    // ✅ Path puro com query string embutida — o interceptor preserva
    const fluigPath = queryParams ? `${baseUrl}?filter=id_evento eq ${queryParams}` : baseUrl;
    const response = await axiosApi.get<FluigCardsResponse>(fluigPath);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorData = error.response?.data;
      switch (status) {
        case 404:
          throw new Error(`Documento ${documentId} não encontrado`);
        case 403:
          throw new Error(`Sem permissão para acessar o documento ${documentId}`);
        case 500:
          if (errorData?.code === "java.lang.NullPointerException") {
            throw new Error(`Documento ${documentId} corrompido ou sem dados obrigatórios`);
          }
          throw new Error(`Erro interno ao buscar documento ${documentId}`);
        default:
          throw new Error(`Erro ao buscar documento: ${error.message}`);
      }
    }
    throw error;
  }
}

export async function handleUpdateFormParticipant({ documentId, cardId, values }: SendFormData): Promise<FluigPostResponse> {
  if (!documentId || documentId === "undefined") {
    throw new Error("documentId é obrigatório e não pode ser undefined");
  }
  if (!cardId || cardId === "undefined") {
    throw new Error("cardId é obrigatório e não pode ser undefined");
  }

  try {
    // ✅ Path puro — interceptor cuida do proxy
    const fluigPath = `/ecm-forms/api/v2/cardindex/${documentId}/cards/${cardId}`;
    const response = await axiosApi.put<FluigPostResponse>(fluigPath, { values });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorData = error.response?.data;
      switch (status) {
        case 404:
          throw new Error(`Documento ${documentId} não encontrado`);
        case 403:
          throw new Error(`Sem permissão para acessar o documento ${documentId}`);
        case 500:
          if (errorData?.code === "java.lang.NullPointerException") {
            throw new Error(`Documento ${documentId} corrompido ou sem dados obrigatórios`);
          }
          throw new Error(`Erro interno ao buscar documento ${documentId}`);
        default:
          throw new Error(`Erro ao buscar documento: ${error.message}`);
      }
    }
    throw error;
  }
}
