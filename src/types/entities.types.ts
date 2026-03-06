import type { VinculoFields } from "@/hooks/useVinculo";

export interface PalestranteFields {
  anonymization_date: string | null;
  anonymization_user_id: string | null;
  criado_em: string;
  criado_por: string;
  descricao: string;
  email: string;
  eixo: string;
  empresa_faculdade: string;
  id_atividade: string;
  id_evento: string;
  modificado_em: string;
  modificado_por: string;
  nome: string;
  status: "ativo" | "inativo";
  url_foto: string;
  youtube: string;
  linkedin: string;
  instagram: string;
  facebook: string;
}

export interface EventoFields {
  bairro: string;
  categoria_evento: string;
  cep: string;
  cidade: string;
  criado_em: string;
  criado_por: string;
  data_fim: string;
  data_inicio: string;
  descricao: string;
  endereco: string;
  estado: string;
  hora_fim: string;
  hora_inicio: string;
  local: string;
  local_evento: string;
  modificado_em: string;
  modificado_por: string;
  pais: string;
  tipo_evento: string;
  titulo: string;
  datas: string[];
}

export interface LoteFields {
  documentId: any;
  anonymization_date: string;
  anonymization_user_id: string;
  data_fim_vendas: string;
  data_inicio_vendas: string;
  descricao: string;
  hora_fim_vendas: string;
  hora_inicio_vendas: string;
  maximo_compra: string;
  minimo_compra: string;
  nome: string;
  preco: string;
  publico_privado: string;
  quantidade: string;
  id_evento: string;
}

export interface ActivityFields {
  documentid: string;
  anonymization_date: string | null;
  anonymization_user_id: string | null;
  cardid: string;
  criado_em: string;
  criado_por: string;
  descricao: string;
  id_lote: string;
  id_tipo_atividade: string;
  lote: string;
  modificado_em: string;
  modificado_por: string;
  sala: string;
  tipo_atividade: string;
  titulo: string;
  url_foto: string;
  vagas_disponiveis: string;
  palestrantes: VinculoFields[];
  hora_fim: string;
  hora_inicio: string;
  data_fim: string;
  data_inicio: string;
  eixo: string;
}
