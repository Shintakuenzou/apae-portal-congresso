/**
 * @module utils/validation-helper
 * @description Utilitário para validar se todas as faixas de horário
 * de um dia de evento estão cobertas por atividades selecionadas.
 */
import { toMinutes } from "./time-utils";

/**
 * Resultado da validação de horários.
 */
export interface ValidacaoHorariosResult {
  /** `true` se todos os horários estão cobertos. */
  valido: boolean;
  /** Mensagem descritiva do resultado. */
  mensagem: string;
}

/**
 * Valida se as atividades selecionadas cobrem todo o período do dia do evento.
 *
 * Verifica:
 * 1. Se há pelo menos uma atividade selecionada.
 * 2. Se a primeira atividade começa no horário de início do evento.
 * 3. Se a última atividade termina no horário de fim do evento.
 * 4. Se não há lacunas entre atividades consecutivas.
 *
 * @param atividadesSelecionadas - Array de atividades com `hora_inicio` e `hora_fim`.
 * @param horaInicioEvento - Horário de início do evento ("HH:mm"), padrão "08:00".
 * @param horaFimEvento - Horário de fim do evento ("HH:mm"), padrão "18:00".
 * @returns Objeto com `valido` (boolean) e `mensagem` (string).
 *
 * @example
 * ```ts
 * const resultado = validarHorariosPreenchidos(atividades, "08:00", "18:00");
 * if (!resultado.valido) {
 *   console.warn(resultado.mensagem);
 * }
 * ```
 */
export function validarHorariosPreenchidos(
  atividadesSelecionadas: any[],
  horaInicioEvento: string = "08:00",
  horaFimEvento: string = "18:00",
): ValidacaoHorariosResult {
  if (!atividadesSelecionadas || atividadesSelecionadas.length === 0) {
    return {
      valido: false,
      mensagem: `Você precisa selecionar pelo menos uma atividade. Horário do evento: ${horaInicioEvento} às ${horaFimEvento}`,
    };
  }

  const atividadesOrdenadas = [...atividadesSelecionadas].sort((a, b) => {
    return toMinutes(a.hora_inicio) - toMinutes(b.hora_inicio);
  });

  const inicioEvento = toMinutes(horaInicioEvento);
  const fimEvento = toMinutes(horaFimEvento);
  const inicioFirstAtv = toMinutes(atividadesOrdenadas[0].hora_inicio);
  const fimLastAtv = toMinutes(atividadesOrdenadas[atividadesOrdenadas.length - 1].hora_fim);

  if (inicioFirstAtv > inicioEvento) {
    return {
      valido: false,
      mensagem: `Há uma lacuna no início do dia. Primeira atividade começa às ${atividadesOrdenadas[0].hora_inicio}, mas o evento começa às ${horaInicioEvento}`,
    };
  }

  if (fimLastAtv < fimEvento) {
    return {
      valido: false,
      mensagem: `Há uma lacuna no fim do dia. Última atividade termina às ${atividadesOrdenadas[atividadesOrdenadas.length - 1].hora_fim}, mas o evento termina às ${horaFimEvento}`,
    };
  }

  for (let i = 0; i < atividadesOrdenadas.length - 1; i++) {
    const fimAtividadeAtual = toMinutes(atividadesOrdenadas[i].hora_fim);
    const inicioProximaAtividade = toMinutes(atividadesOrdenadas[i + 1].hora_inicio);

    if (fimAtividadeAtual < inicioProximaAtividade) {
      const duracao = inicioProximaAtividade - fimAtividadeAtual;
      const horas = Math.floor(duracao / 60);
      const minutos = duracao % 60;
      return {
        valido: false,
        mensagem: `Há uma lacuna entre ${atividadesOrdenadas[i].hora_fim} e ${atividadesOrdenadas[i + 1].hora_inicio} (${horas}h${minutos > 0 ? minutos + "min" : ""} sem atividade)`,
      };
    }
  }

  return {
    valido: true,
    mensagem: "Todos os horários estão preenchidos!",
  };
}
