import type { User } from "./user";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (cpf: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (data: Partial<User>) => void;
}
