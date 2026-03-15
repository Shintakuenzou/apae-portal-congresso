import OAuth from "oauth-1.0a";
import CryptoJs from "crypto-js";
import axios, { type AxiosRequestHeaders, type InternalAxiosRequestConfig } from "axios";

// URL do Fluig (usada para assinar requisições OAuth em desenvolvimento)
const FLUIG_BASE_URL = import.meta.env.VITE_BASE_URL_PROD as string;

// ✅ Determina a base URL dependendo do ambiente
const getBaseURL = () => {
  if (import.meta.env.DEV) {
    // Em desenvolvimento, usa string vazia para Vite Proxy interceptar
    return "";
  }
  // Em produção, usa o proxy.php
  return "https://congresso.apaebrasil.org.br";
};

// Instância do Axios
export const axiosApi = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ─── OAuth 1.0a ───────────────────────────────────────────────────────────────
const hashFunction = (baseString: string, key: string) => {
  return CryptoJs.HmacSHA1(baseString, key).toString(CryptoJs.enc.Base64);
};

const oauth = new OAuth({
  consumer: {
    key: import.meta.env.VITE_CONSUMER_KEY as string,
    secret: import.meta.env.VITE_CONSUMER_SECRET as string,
  },
  signature_method: "HMAC-SHA1",
  hash_function: hashFunction,
});

const getAuthorizationHeaders = async (url: string, method: string) => {
  const token = {
    key: import.meta.env.VITE_ACCESS_TOKEN as string,
    secret: import.meta.env.VITE_TOKEN_SECRET as string,
  };

  return oauth.toHeader(oauth.authorize({ url, method }, token));
};

// ─── Interceptor de Requisição ────────────────────────────────────────────────
axiosApi.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const method = config.method ? config.method.toUpperCase() : "GET";
    const url = config.url || "";

    if (!import.meta.env.DEV) {
      // ✅ Evita reescrever se já for URL de proxy
      if (!url.startsWith("/proxy.php")) {
        // Usa URL API para separar corretamente path e query string
        const urlObj = new URL(url, "http://placeholder");
        const path = urlObj.pathname;

        // Monta os parâmetros do proxy corretamente
        const proxyParams = new URLSearchParams();
        proxyParams.set("endpoint", path);
        proxyParams.set("method", method);

        // Adiciona todos os query params originais
        urlObj.searchParams.forEach((value, key) => {
          proxyParams.set(key, value);
        });

        config.url = `/proxy.php?${proxyParams.toString()}`;
      }

      return config;
    }

    // ─── DEV: OAuth direto sem proxy ─────────────────────────────────────────
    const oauthURL = `${FLUIG_BASE_URL}${url}`;
    try {
      const authorizationHeader = await getAuthorizationHeaders(oauthURL, method);
      config.headers = {
        ...(config.headers || {}),
        ...authorizationHeader,
      } as AxiosRequestHeaders;
    } catch {
      return Promise.reject(new Error("Falha na autenticação OAuth 1.0a."));
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Interceptor de Resposta ──────────────────────────────────────────────────
axiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ Response Error:", {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data,
    });

    if (error.message === "Network Error") {
      if (import.meta.env.DEV) {
        console.error("💡 DEV: Verifique o Vite Proxy e as credenciais OAuth");
      } else {
        console.error("💡 PROD: Verifique se o proxy.php está funcionando");
      }
    }

    return Promise.reject(error);
  },
);
