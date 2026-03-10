interface ImportMetaEnv {
  readonly VITE_FORM_PARTICIPANTE?: string;
  readonly VITE_CONSUMER_KEY_BASE_TESTE?: string;
  readonly VITE_CONSUMER_SECRET_BASE_TESTE?: string;
  readonly VITE_ACCESS_TOKEN_BASE_TESTE?: string;
  readonly VITE_TOKEN_SECRET_BASE_TESTE?: string;
  readonly VITE_BASE_URL_TESTE?: string;
  readonly VITE_BASE_URL_PROD?: string;
  readonly VITE_FORM_PALESTRANT?: string;
  readonly VITE_FORM_EVENTO?: string;
  readonly VITE_FORM_EVENTO?: string;
  readonly VITE_FORM_LOTES?: string;
  readonly VITE_FORM_ATIVIDADE?: string;
  readonly VITE_FORM_VINCULO_PALESTRANTE_ATIVIDADE?: string;
  readonly VITE_FORM_PARCEIROS?: string;
  readonly VITE_DATASET_ATIVIDADE?: string;
  readonly VITE_DATASET_VINCULO_PALESTRA_ATIVIDADE?: string;
  readonly VITE_DATASET_EVENTO?: string;
  readonly VITE_DATASET_PARTICIPANTE?: string;
  readonly VITE_DATASET_DS_LOGIN?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
