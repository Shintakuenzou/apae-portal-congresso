export interface Payment {
  init_point: string;
  message: string;
  preference_id: string;
  ref_id: string;
  sandbox_init_point: string;
  status: string;
}

// Root response
export interface PaymentResponse {
  accounts_info: any | null;
  acquirer_reconciliation: any[]; // array vazio no exemplo
  additional_info: AdditionalInfo | null;
  authorization_code: string | null;
  binary_mode: boolean;
  brand_id: string | null;
  build_version: string | null;
  call_for_authorize_id: string | null;
  callback_url: string | null;
  captured: boolean;
  card: Card | Record<string, any>;
  charges_details: ChargeDetail[];
  charges_execution_info: ChargesExecutionInfo | null;
  collector_id: number | string | null;
  corporation_id: string | null;
  counter_currency: string | null;
  coupon_amount: number;
  currency_id: string;
  date_approved: string | null;
  date_created: string | null;
  date_last_updated: string | null;
  date_of_expiration: string | null;
  deduction_schema: string | null;
  description: string | null;
  differential_pricing_id: string | null;
  external_reference: string | null;
  fee_details: FeeDetail[];
  financing_group: string | null;
  id: number | string;
  installments: number;
  integrator_id: string | null;
  issuer_id: string | null;
  live_mode: boolean;
  marketplace_owner: string | null;
  merchant_account_id: string | null;
  merchant_number: string | null;
  metadata: Record<string, any>;
  money_release_date: string | null;
  money_release_schema: string | null;
  money_release_status: string | null;
  notification_url: string | null;
  operation_type: string | null;
  order: Order | null;
  payer: Payer | null;
  payment_method: PaymentMethod | null;
  payment_method_id: string | null;
  payment_type_id: string | null;
  platform_id: string | null;
  point_of_interaction: PointOfInteraction | null;
  pos_id: string | null;
  processing_mode: string | null;
  refunds: Refund[];
  release_info: any | null;
  shipping_amount: number;
  sponsor_id: string | null;
  statement_descriptor: string | null;
  status: string;
  status_detail: string | null;
  store_id: string | null;
  tags: string | null;
  taxes_amount: number;
  transaction_amount: number;
  transaction_amount_refunded: number;
  transaction_details: TransactionDetails | null;
  transaction_id: string | null;
  type: string | null;
  ticket_url?: string | null;
  qr_code?: string | null;
  qr_code_base64?: string | null;
}

// Nested and helper interfaces

export interface AdditionalInfo {
  ip_address?: string | null;
  items?: Item[] | null;
  tracking_id?: string | null;
  [key: string]: any;
}

export interface Item {
  id?: string | number | null;
  title?: string | null;
  quantity?: number | null;
  unit_price?: number | null;
  [key: string]: any;
}

export interface Card {
  // O exemplo mostra um objeto vazio; manter genérico
  [key: string]: any;
}

export interface ChargeDetail {
  // Estrutura genérica para detalhes de cobrança
  [key: string]: any;
}

export interface ChargesExecutionInfo {
  internal_execution?: Record<string, any> | null;
  [key: string]: any;
}

export interface FeeDetail {
  [key: string]: any;
}

export interface Order {
  id?: string | number | null;
  type?: string | null;
  [key: string]: any;
}

export interface Payer {
  email?: string | null;
  entity_type?: string | null;
  first_name?: string | null;
  id?: string | number | null;
  identification?: Identification | null;
  last_name?: string | null;
  operator_id?: string | null;
  phone?: Phone | null;
  type?: string | null;
  [key: string]: any;
}

export interface Identification {
  number?: string | null;
  type?: string | null;
  [key: string]: any;
}

export interface Phone {
  area_code?: string | null;
  extension?: string | null;
  number?: string | null;
  [key: string]: any;
}

export interface PaymentMethod {
  id?: string | null;
  issuer_id?: string | null;
  type?: string | null;
  [key: string]: any;
}

export interface PointOfInteraction {
  application_data?: ApplicationData | null;
  business_info?: BusinessInfo | null;
  location?: Location | null;
  transaction_data?: TransactionData | null;
  [key: string]: any;
}

export interface ApplicationData {
  name?: string | null;
  operating_system?: string | null;
  version?: string | null;
  [key: string]: any;
}

export interface BusinessInfo {
  branch?: string | null;
  sub_unit?: string | null;
  unit?: string | null;
  [key: string]: any;
}

export interface Location {
  source?: string | null;
  state_id?: string | null;
  [key: string]: any;
}

export interface TransactionData {
  bank_info?: BankInfo | null;
  bank_transfer_id?: string | null;
  e2e_id?: string | null;
  financial_institution?: string | null;
  is_end_consumer?: boolean | null;
  merchant_category_code?: string | null;
  qr_code?: string | null;
  qr_code_base64?: string | null;
  ticket_url?: string | null;
  transaction_id?: string | null;
  [key: string]: any;
}

export interface BankInfo {
  collector?: CollectorInfo | null;
  is_same_bank_account_owner?: boolean | null;
  origin_bank_id?: string | null;
  origin_wallet_id?: string | null;
  payer?: BankPayerInfo | null;
  [key: string]: any;
}

export interface CollectorInfo {
  // conforme exemplo: contém dados do coletor
  [key: string]: any;
}

export interface BankPayerInfo {
  // dados do pagador no contexto bancário
  [key: string]: any;
}

export interface Refund {
  [key: string]: any;
}

export interface TransactionDetails {
  acquirer_reference?: string | null;
  bank_transfer_id?: string | null;
  external_resource_url?: string | null;
  financial_institution?: string | null;
  installment_amount?: number | null;
  net_received_amount?: number | null;
  overpaid_amount?: number | null;
  payable_deferral_period?: string | null;
  payment_method_reference_id?: string | null;
  total_paid_amount?: number | null;
  transaction_id?: string | null;
  [key: string]: any;
}
