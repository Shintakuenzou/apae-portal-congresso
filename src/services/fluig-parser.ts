import type { FluigCardRaw, FluigEntity } from "@/types";

/**
 * Converte um card bruto do Fluig em um objeto tipado com fields.
 */
/* eslint-disable  @typescript-eslint/no-explicit-any */
export function parseFluigCard<T extends Record<string, any>>(card: FluigCardRaw): T {
  const fields = {} as T;

  for (const field of card.values) {
    fields[field.fieldId as keyof T] = (field.value || "") as any;
  }

  return fields;
}

/**
 * Converte um card bruto do Fluig em uma FluigEntity tipada.
 */
export function parseFluigEntity<T extends Record<string, any>>(card: FluigCardRaw): FluigEntity<T> {
  const fields = parseFluigCard<T>(card);

  return {
    cardId: card.cardId,
    parentDocumentId: card.parentDocumentId,
    activeVersion: card.activeVersion,
    companyId: card.companyId,
    version: card.version,
    fields,
  };
}
