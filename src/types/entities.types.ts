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

export interface ParticipantsFields {
  [key: string]: any;
  id: number;
  cardid: number;
  documentid: number;
  companyid: number;
  nome: string;
  sobrenome: string;
  cpf: string;
  email: string;
  data_nascimento: string;
  telefone_contato: string;
  whatsapp: string;
  cep: string;
  municipio: string;
  uf: string;
  funcao: string;
  area_atuacao: string;
  escolaridade: string;
  apae_filiada: string;
  presidente_apae: string;
  atividades: string[];
  id_evento: string;
  id_lote: string;
  id_pasta: string;
  possui_deficiencia: string;
  id_tipo_deficiencia: string;
  tipo_deficiencia: string;
  necessita_apoio: string;
  tipo_apoio: string;
  outro_apoio: string;
  tamanho_camiseta: string;
  senha: string;
  url_foto: string;
  criado_em: string;
  criado_por: string;
  modificado_em: string;
  modificado_por: string;
  status: string;
  tableid: string;
  version: number;
  coordenacao: string;
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
  documentid: string;
}

export interface LoteFields {
  documentid: any;
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
  status: string;
  tipo_lote: string;
}

export interface AvailableVacanciesFields {
  id_atividade: string;
  quantidade: string;
}

export interface ClassFields {
  id: number;
  documentid: number;
  cardid: number;
  nome: string;
  andar: string;
  numero: string;
  qtd_vagas: string;
  status: "ATIVO" | "INATIVO" | string;
  id_evento: string;
  criado_em: string;
  criado_por: string;
  modificado_em: string;
  modificado_por: string;
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
