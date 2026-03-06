import OAuth from "oauth-1.0a";
import CryptoJs from "crypto-js";
import axios, { type AxiosRequestHeaders, type InternalAxiosRequestConfig } from "axios";

const FLUIG_BASE_URL = "https://federacaonacional201538.fluig.cloudtotvs.com.br";

const getBaseURL = () => {
  if (import.meta.env.DEV) return "";
  return "https://tan-oryx-750041.hostingersite.com";
};

export const axiosApi = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const hashFunction = (baseString: string, key: string) => CryptoJs.HmacSHA1(baseString, key).toString(CryptoJs.enc.Base64);

const oauth = new OAuth({
  consumer: {
    key: import.meta.env.VITE_CONSUMER_KEY_BASE_TESTE as string,
    secret: import.meta.env.VITE_CONSUMER_SECRET_BASE_TESTE as string,
  },
  signature_method: "HMAC-SHA1",
  hash_function: hashFunction,
});

const getAuthorizationHeaders = async (url: string, method: string) => {
  const token = {
    key: import.meta.env.VITE_ACCESS_TOKEN_BASE_TESTE as string,
    secret: import.meta.env.VITE_TOKEN_SECRET_BASE_TESTE as string,
  };
  return oauth.toHeader(oauth.authorize({ url, method }, token));
};

axiosApi.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const method = config.method ? config.method.toUpperCase() : "GET";
    let url = config.url || "";

    if (!import.meta.env.DEV) {
      // ✅ Em produção, reescreve a URL para o formato do proxy.php
      // Separa o path da query string que já possa existir na url
      const [path, existingQS] = url.split("?");

      // Monta ?endpoint=...&method=...&(query original)
      let proxyUrl = `/proxy.php?endpoint=${encodeURIComponent(path)}&method=${method}`;
      if (existingQS) proxyUrl += `&${existingQS}`;

      config.url = proxyUrl;
      config.method = "GET"; // proxy recebe sempre GET, o method real vai no param

      console.log("📡 PROD proxy URL:", config.url);
      return config;
    }

    // ✅ Em DEV, aplica OAuth direto via Vite Proxy
    const oauthURL = `${FLUIG_BASE_URL}${url}`;
    console.log("🔐 OAuth para:", oauthURL);

    try {
      const authorizationHeader = await getAuthorizationHeaders(oauthURL, method);
      config.headers = {
        ...(config.headers || {}),
        ...authorizationHeader,
      } as AxiosRequestHeaders;
    } catch (error) {
      console.error("❌ Erro OAuth:", error);
      return Promise.reject(new Error("Falha na autenticação OAuth 1.0a."));
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ Response Error:", {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data,
    });
    return Promise.reject(error);
  },
);
