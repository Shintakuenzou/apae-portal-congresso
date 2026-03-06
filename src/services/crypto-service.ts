import CryptoJS from "crypto-js";

const rawKey = import.meta.env.VITE_ACCESS_TOKEN_BASE_TESTE || "";
// Garante 32 caracteres: corta ou completa com zeros (ou outro char seguro) — preferível cortar.
const SECURITY_KEY = rawKey.substring(0, 32);

export const SecurityService = {
  encryptForTransport(password: string): string {
    const key = CryptoJS.enc.Utf8.parse(SECURITY_KEY); // WordArray de 32 bytes
    const encrypted = CryptoJS.AES.encrypt(password, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString(); // Base64 do ciphertext
  },
};
