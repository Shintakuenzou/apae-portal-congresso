/**
 * Tipos base do Fluig (TOTVS) — estrutura de cards genérica.
 */

export interface FluigCardField {
  fieldId: string;
  value: string | null;
}

export interface FluigCardRaw {
  activeVersion: boolean;
  cardId: number;
  children: FluigCardRaw[];
  companyId: number;
  parentDocumentId: number;
  values: FluigCardField[];
  version: number;
}

export interface FluigCardsResponse {
  items: FluigCardRaw[];
  hasNext: boolean;
}

/**
 * Entidade genérica parseada do Fluig.
 * Substitui o tipo "Palestrante<T>" antigo que era usado para tudo.
 */
export interface FluigEntity<T> {
  cardId: number;
  parentDocumentId: number;
  activeVersion: boolean;
  companyId: number;
  version: number;
  fields: T;
}

export interface FluigPostResponse {
  activeVersion: boolean;
  cardId: number;
  children: [];
  companyId: number;
  parentDocumentId: number;
  values: [];
}

export interface SendFormData {
  documentId: string;
  cardId?: string;
  values?: { fieldId: string; value: string | null }[] | string;
  queryParams?: string;
}
