type DisabilityOption =
  | "deficiencia_fisica"
  | "deficiencia_visual"
  | "deficiencia_auditiva"
  | "deficiencia_intelectual"
  | "deficiencia_mental"
  | "deficiencia_multipla"
  | "sindrome_down"
  | "paralisia_cerebral"
  | "multipla";

export const DISABILITY_OPTIONS: { value: DisabilityOption; label: string }[] = [
  { value: "deficiencia_intelectual", label: "Deficiência Intelectual (DI)" },
  { value: "sindrome_down", label: "Síndrome de Down" },
  { value: "paralisia_cerebral", label: "Paralisia Cerebral" },
  { value: "deficiencia_fisica", label: "Deficiência Física" },
  { value: "deficiencia_visual", label: "Deficiência Visual" },
  { value: "deficiencia_auditiva", label: "Deficiência Auditiva" },
  { value: "deficiencia_mental", label: "Deficiência Mental / Psicossocial" },
  { value: "deficiencia_multipla", label: "Deficiência Múltipla" },
  { value: "multipla", label: "Multipla" },
];

export const opcao_apoio: { value: string; label: string }[] = [
  { value: "cadeira de rodas", label: "Cadeira de rodas não motorizada" },
  { value: "cadeira de rodas motorizada", label: "Cadeira de rodas motorizada" },
  { value: "andador", label: "Andador" },
  { value: "bengala", label: "Bengala" },
  { value: "muletas", label: "Muletas" },
  { value: "rampas e elevadores", label: "Rampas e elevadores" },
  { value: "proteses ou orteses", label: "Próteses ou orteses" },
  { value: "calcados ortopedicos", label: "Calçados ortopédicos" },
  { value: "tecnologias assistivas", label: "Tecnologias assistivas" },
  { value: "Outros", label: "Outros" },
];
