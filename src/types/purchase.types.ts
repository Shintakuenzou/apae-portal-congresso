/**
 * @module types/purchase.types
 * @description Interfaces relacionadas a compras/pedidos de ingressos do congresso.
 */

/** Status possíveis de um pagamento no Mercado Pago. */
export type PurchaseStatus =
  | "approved"
  | "pending"
  | "in_process"
  | "authorized"
  | "reject"
  | "cancelled"
  | "refunded"
  | "charged_back";

/**
 * Representa um pedido/compra de ingresso armazenado no Fluig.
 *
 * @remarks
 * O campo `json_pagamento` contém o JSON bruto da resposta do Mercado Pago
 * (`PaymentResponse`) e deve ser parseado antes do uso.
 */
export interface Purchase {
  atividades: string;
  nome_evento: string;
  id_evento: string;
  id_lote: string;
  data_compra: string;
  data_pagamento: string;
  status: PurchaseStatus;
  metodo_pagamento: string;
  json_pagamento: string;
  id_participante: string;
}
