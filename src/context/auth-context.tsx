// src/contexts/auth-context.tsx
import { fetchDataset } from "@/services/fetch-dataset";
import { useNavigate } from "@tanstack/react-router";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface User {
  cpf: string;
  nome: string;
  sobrenome: string;
  email: string;
  data_nascimento: string;
  uf: string;
  municipio: string;
  telefone: string;
  whatsapp: string;
  escolaridade: string;
  apaeFiliada: string;
  inscricao: string;
  dataInscricao: string;
  cardid: string;
  documentid: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (cpf: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erro ao carregar usuário do localStorage:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (cpf: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await fetchDataset({
        datasetId: "cadParticipanteCN",
        constraints: [
          {
            fieldName: "cpf",
            initialValue: cpf.replace(/\D/g, ""),
            finalValue: cpf.replace(/\D/g, ""),
            constraintType: "MUST",
          },
        ],
      });

      if (response.items && response.items.length > 0) {
        const userData = response.items[0];

        if (response.items[0]["senha"] == password) {
          const user: User = {
            cpf: (userData.cpf as string) || cpf,
            nome: userData.nome as string,
            sobrenome: userData.sobrenome as string,
            email: userData.email as string,
            data_nascimento: userData.data_nascimento as string,
            uf: userData.uf as string,
            municipio: userData.municipio as string,
            telefone: userData.telefone_contato as string,
            whatsapp: userData.whatsapp as string,
            escolaridade: userData.escolaridade as string,
            apaeFiliada: userData.apae_filiada as string,
            inscricao: userData.inscricao as string,
            dataInscricao: (userData.criado_em as string) || (userData.criado_em as string),
            cardid: userData.cardid as string,
            documentid: userData.documentid as string,
          };

          setUser(user);
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          throw new Error("Senha incorreta");
        }
      } else {
        throw new Error("CPF ou senha inválidos");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate({ to: "/login" });
  };

  const updateUser = (updatedData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updatedData };
      localStorage.setItem("user", JSON.stringify(updated)); // persiste também
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
        isAuthenticated: !!user,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* eslint-disable react-refresh/only-export-components */
// ✅ Hook useAuth DENTRO do mesmo arquivo
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
