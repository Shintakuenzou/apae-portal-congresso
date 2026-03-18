// Função auxiliar para converter "HH:mm" em minutos
function toMinutes(hora: string): number {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

// Função para validar se todos os horários do dia estão preenchidos
export function validarHorariosPreenchidos(
  atividadesSelecionadas: any[],
  horaInicioEvento: string = "08:00",
  horaFimEvento: string = "18:00",
): { valido: boolean; mensagem: string } {
  // Se não há atividades, está vazio
  if (!atividadesSelecionadas || atividadesSelecionadas.length === 0) {
    return {
      valido: false,
      mensagem: `Você precisa selecionar pelo menos uma atividade. Horário do evento: ${horaInicioEvento} às ${horaFimEvento}`,
    };
  }

  // Ordena atividades por hora de início
  const atividadesOrdenadas = [...atividadesSelecionadas].sort((a, b) => {
    return toMinutes(a.hora_inicio) - toMinutes(b.hora_inicio);
  });

  const inicioEvento = toMinutes(horaInicioEvento);
  const fimEvento = toMinutes(horaFimEvento);
  const inicioFirstAtv = toMinutes(atividadesOrdenadas[0].hora_inicio);
  const fimLastAtv = toMinutes(atividadesOrdenadas[atividadesOrdenadas.length - 1].hora_fim);

  // Verifica se a primeira atividade começa no horário do evento
  if (inicioFirstAtv > inicioEvento) {
    return {
      valido: false,
      mensagem: `Há uma lacuna no início do dia. Primeira atividade começa às ${atividadesOrdenadas[0].hora_inicio}, mas o evento começa às ${horaInicioEvento}`,
    };
  }

  // Verifica se a última atividade termina no horário do evento
  if (fimLastAtv < fimEvento) {
    return {
      valido: false,
      mensagem: `Há uma lacuna no fim do dia. Última atividade termina às ${atividadesOrdenadas[atividadesOrdenadas.length - 1].hora_fim}, mas o evento termina às ${horaFimEvento}`,
    };
  }

  // Verifica lacunas entre atividades consecutivas
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
