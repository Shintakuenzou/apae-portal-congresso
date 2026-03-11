import { clearAuthCookies, getAuthCookie, setAuthCookie } from "@/lib/cookie";
import { fetchDataset } from "@/services/fetch-dataset";
import { type AuthContextType } from "@/types/auth-context-type";
import type { LoginResponseProps } from "@/types/login-response";
import type { TokenProps } from "@/types/token";
import type { User } from "@/types/user";
import { sha256 } from "@/utils/hash-pass";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthemticated] = useState(false);

  useEffect(() => {
    const token = getAuthCookie("token");
    if (token) {
      setIsAuthemticated(true);
    }
  }, []);

  const login = async (cpf: string, pass: string): Promise<void> => {
    setIsLoading(true);
    const hash = await sha256(pass);

    try {
      const responseLogin = await fetchDataset<LoginResponseProps>({
        datasetId: import.meta.env.VITE_DATASET_DS_LOGIN as string,
        constraints: [
          {
            fieldName: "ref_id",
            initialValue: cpf + "|" + hash,
            finalValue: cpf + "|" + hash,
            constraintType: "MUST",
          },
        ],
      });

      const tokenData = responseLogin.items[0];
      console.log("tokenData: ", tokenData);

      if (!tokenData?.token) {
        toast.warning("CPF ou senha incorretos.");
        return;
      }

      const responseValidation = await fetchDataset<TokenProps>({
        datasetId: import.meta.env.VITE_DATASET_DS_VALIDATE_TOKEN as string,
        constraints: [{ fieldName: "token", initialValue: tokenData.token, finalValue: tokenData.token, constraintType: "MUST" }],
      });

      const validated = responseValidation.items[0];

      if (validated?.status !== "SUCCESS") {
        toast.warning("Erro ao realizar login, verifique CPF ou senha.");
        return;
      }

      setAuthCookie(tokenData.token, validated.exp);

      setUser({
        cpf: cpf,
        apaeFiliada: tokenData.apae_filiada,
        nome: tokenData.nome,
        email: tokenData.email,
        telefone: tokenData.telefone_contato,
        municipio: tokenData.municipio,
        uf: tokenData.uf,
        data_nascimento: tokenData.data_nascimento,
        escolaridade: tokenData.escolaridade,
        whatsapp: tokenData.whatsapp,
        sobrenome: tokenData.sobrenome,
        inscricao: tokenData.ref_id,
        tamanho_camiseta: tokenData.tamanho_camiseta,
        documentid: tokenData.documentid,
        dataInscricao: tokenData.dataInscricao,
        presidente_apae: tokenData.presidente_apae,
        cep: tokenData.cep,
        funcao: tokenData.funcao,
        area_atuacao: tokenData.area_atuacao,
        possui_deficiencia: tokenData.possui_deficiencia,
        necessita_apoio: tokenData.necessita_apoio,
        coordenacao: tokenData.coordenacao,
      });
      setIsAuthemticated(true);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Erro inesperado ao fazer login.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthCookies();
    setIsAuthemticated(false);
  };

  const updateUser = (updatedData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updatedData };
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* eslint-disable react-refresh/only-export-components */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
