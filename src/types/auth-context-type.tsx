import type { TokenProps } from "./token";
import type { User } from "./user";

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (cpf: string, password: string) => Promise<{ items: TokenProps[] } | undefined>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (data: Partial<User>) => void;
};
