/**
 * @module constants/form-options
 * @description Opções de formulário reutilizáveis em selects e combos do sistema.
 */

/** Tamanhos disponíveis de camiseta para o congresso. */
export const TAMANHOS_CAMISA = ["PP", "P", "M", "G", "GG", "XG", "XGG"] as const;

/** Siglas dos estados brasileiros, em ordem alfabética. */
export const ESTADOS = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
] as const;

/** Níveis de escolaridade suportados pelo formulário de inscrição. */
export const ESCOLARIDADES = [
  { value: "fundamental-incompleto", label: "Fundamental Incompleto" },
  { value: "fundamental-completo", label: "Fundamental Completo" },
  { value: "medio-incompleto", label: "Médio Incompleto" },
  { value: "medio-completo", label: "Médio Completo" },
  { value: "superior-incompleto", label: "Superior Incompleto" },
  { value: "superior-completo", label: "Superior Completo" },
  { value: "pos-graduacao", label: "Pós-graduação" },
  { value: "mestrado", label: "Mestrado" },
  { value: "doutorado", label: "Doutorado" },
] as const;
