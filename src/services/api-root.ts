import OAuth from "oauth-1.0a";
import CryptoJs from "crypto-js";
import axios, { type AxiosRequestHeaders, type InternalAxiosRequestConfig } from "axios";

// ✅ URL real do Fluig (para OAuth)
const FLUIG_BASE_URL = "https://federacaonacional201538.fluig.cloudtotvs.com.br";

// ✅ Determina a base URL dependendo do ambiente
const getBaseURL = () => {
  if (import.meta.env.DEV) {
    // Em desenvolvimento, usa string vazia para Vite Proxy interceptar
    return "";
  }
  // Em produção, usa o proxy.php
  return "https://tan-oryx-750041.hostingersite.com/proxy.php";
};

// Instância do Axios
export const axiosApi = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Funções e configurações OAuth 1.0a
const hashFunction = (baseString: string, key: string) => {
  return CryptoJs.HmacSHA1(baseString, key).toString(CryptoJs.enc.Base64);
};

const oauth = new OAuth({
  consumer: {
    key: import.meta.env.VITE_CONSUMER_KEY_BASE_TESTE as string,
    secret: import.meta.env.VITE_CONSUMER_SECRET_BASE_TESTE as string,
  },
  signature_method: "HMAC-SHA1",
  hash_function: hashFunction,
});

// Retorna autenticação OAuth
const getAuthorizationHeaders = async (url: string, method: string) => {
  const token = {
    key: import.meta.env.VITE_ACCESS_TOKEN_BASE_TESTE as string,
    secret: import.meta.env.VITE_TOKEN_SECRET_BASE_TESTE as string,
  };

  const requestData = {
    url,
    method,
  };

  return oauth.toHeader(oauth.authorize(requestData, token));
};

// Interceptor de Requisição do Axios para OAuth 1.0a
axiosApi.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const method = config.method ? config.method.toUpperCase() : "GET";
    const url = config.url || "";

    if (!import.meta.env.DEV) {
      // ✅ Evita duplo encoding — só reescreve se ainda não for URL de proxy
      if (!url.startsWith("?endpoint=") && !url.startsWith("/proxy.php")) {
        const [path, existingQS] = url.split("?");
        let proxyUrl = `/proxy.php?endpoint=${encodeURIComponent(path)}&method=${method}`;
        if (existingQS) proxyUrl += `&${existingQS}`;
        config.url = proxyUrl;
      }

      // ✅ POST/PUT precisam manter o method real — não converte para GET
      // O proxy lê o ?method=POST e usa como CURLOPT_CUSTOMREQUEST

      return config;
    }

    // DEV — OAuth direto
    const oauthURL = `${FLUIG_BASE_URL}${url}`;
    try {
      const authorizationHeader = await getAuthorizationHeaders(oauthURL, method);
      config.headers = { ...(config.headers || {}), ...authorizationHeader } as AxiosRequestHeaders;
    } catch (error) {
      return Promise.reject(new Error("Falha na autenticação OAuth 1.0a."));
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor de resposta
axiosApi.interceptors.response.use(
  (response) => {
    return response;
  },
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
