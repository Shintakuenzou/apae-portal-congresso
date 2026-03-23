/**
 * @module utils/time-utils
 * @description Utilitários para manipulação e comparação de horários
 * no formato "HH:mm". Utilizados principalmente na validação de conflitos
 * de horário entre atividades do congresso.
 */

/**
 * Converte uma string de horário no formato "HH:mm" para o total em minutos.
 *
 * @param hora - String no formato "HH:mm" (ex.: "14:30")
 * @returns Total de minutos desde 00:00
 *
 * @example
 * ```ts
 * toMinutes("08:00") // 480
 * toMinutes("14:30") // 870
 * ```
 */
export function toMinutes(hora: string): number {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Verifica se dois intervalos de tempo se sobrepõem.
 *
 * Utiliza comparação exclusiva nos extremos: dois intervalos que
 * compartilham apenas o ponto de fronteira (ex.: 10:00–11:00 e 11:00–12:00)
 * **não** são considerados conflitantes.
 *
 * @param inicio1 - Hora de início do primeiro intervalo ("HH:mm")
 * @param fim1    - Hora de fim do primeiro intervalo ("HH:mm")
 * @param inicio2 - Hora de início do segundo intervalo ("HH:mm")
 * @param fim2    - Hora de fim do segundo intervalo ("HH:mm")
 * @returns `true` se houver sobreposição
 *
 * @example
 * ```ts
 * hasTimeConflict("08:00", "10:00", "09:00", "11:00") // true
 * hasTimeConflict("08:00", "10:00", "10:00", "12:00") // false
 * ```
 */
export function hasTimeConflict(
  inicio1: string,
  fim1: string,
  inicio2: string,
  fim2: string,
): boolean {
  const start1 = toMinutes(inicio1);
  const end1 = toMinutes(fim1);
  const start2 = toMinutes(inicio2);
  const end2 = toMinutes(fim2);
  return start1 < end2 && end1 > start2;
}
