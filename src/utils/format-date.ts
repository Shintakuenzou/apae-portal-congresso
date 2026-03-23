/**
 * @module utils/format-date
 * @description Utilitário para formatação de datas no padrão brasileiro (pt-BR).
 */

/**
 * Formata uma data string ISO para o formato brasileiro abreviado.
 *
 * @param dateString - String ISO de data (ex.: "2026-03-15T10:00:00Z")
 * @returns Data formatada como "15 de mar. de 2026"
 *
 * @example
 * ```ts
 * formatDateBR("2026-03-15T10:00:00Z") // "15 de mar. de 2026"
 * ```
 */
export function formatDateBR(dateString: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}
