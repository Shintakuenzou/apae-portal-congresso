import { fetchDataset } from "@/services/fetch-dataset";
import { type AuthContextType } from "@/types/auth-context-type";
import type { User } from "@/types/user";
import { createContext, useContext, useState, type ReactNode } from "react";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (cpf: string, pass: string) => {
    setIsLoading(true);

    console.log(cpf, pass);

    try {
      const responseLogin = await fetchDataset({
        datasetId: import.meta.env.VITE_DATASET_DS_LOGIN as string,
        constraints: [
          {
            fieldName: "cpf",
            initialValue: cpf,
            finalValue: cpf,
            constraintType: "MUST",
          },
          {
            fieldName: "senha",
            initialValue: pass,
            finalValue: pass,
            constraintType: "MUST",
          },
        ],
      });

      console.log("responseLogin: ", responseLogin);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
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
        isAuthenticated: !!user,
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
