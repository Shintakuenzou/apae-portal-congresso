import type { IconName } from "lucide-react/dynamic";

interface Steps {
  number: number;
  title: string;
  description: string;
  icon: IconName;
}

export const steps: Steps[] = [
  {
    number: 1,
    title: "Realize o Login",
    description: "Acesse sua conta utilizando o e-mail e senha cadastrados durante a inscrição. Caso ainda não tenha uma conta, crie uma com os mesmos dados da inscrição.",
    icon: "log-in",
  },
  {
    number: 2,
    title: "Acesse a Tela de Eventos",
    description: "Após fazer login, navegue até a seção de eventos disponíveis no menu principal. Você verá todos os eventos para os quais está inscrito.",
    icon: "calendar-days",
  },
  {
    number: 3,
    title: "Selecione as Atividades",
    description: "Escolha as palestras, workshops e atividades que deseja participar. Verifique os horários para evitar conflitos na sua programação.",
    icon: "check-square",
  },
  {
    number: 4,
    title: "Prossiga com o Pagamento",
    description: "Após selecionar todas as atividades, clique em finalizar e escolha a forma de pagamento de sua preferência para concluir a compra do ingresso.",
    icon: "credit-card",
  },
];
