/**
 * @module utils/parse-atividades
 * @description Utilitário para converter atividades vindas do backend
 * (que podem vir como string JSON, array ou string separada por vírgula)
 * em um array de strings normalizado.
 */

/**
 * Converte o valor bruto de atividades em um `string[]` normalizado.
 *
 * Suporta os seguintes formatos de entrada:
 * - `string[]` → retorna como está
 * - `string` JSON array (`"[\"1\",\"2\"]"`) → faz JSON.parse
 * - `string` separada por vírgulas (`"1,2,3"`) → faz split
 * - Qualquer outro tipo → retorna `[]`
 *
 * @param raw - Valor bruto vindo do backend ou sessionStorage.
 * @returns Array de IDs de atividades como strings.
 *
 * @example
 * ```ts
 * parseAtividades("[\"123\",\"456\"]") // ["123", "456"]
 * parseAtividades("123,456")           // ["123", "456"]
 * parseAtividades(["123", "456"])       // ["123", "456"]
 * parseAtividades(undefined)            // []
 * ```
 */
export function parseAtividades(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map(String);

  if (typeof raw === "string") {
    try {
      const trimmed = raw.trim();
      if (trimmed.startsWith("[")) {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed.map(String) : [];
      }
      return trimmed.split(",").filter(Boolean).map(String);
    } catch {
      return [];
    }
  }

  return [];
}
