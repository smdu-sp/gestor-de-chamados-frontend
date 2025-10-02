export type UserRole = "admin" | "technician" | "user" | "developer";

export type TechnicianCategory = "MANUTENÇÃO" | "VOIP" | "IMPRESSORA" | "SISTEMAS" | "COMPUTADOR";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  workUnit: string;
  avatar?: string;
  // Categorias de responsabilidade para técnicos
  technicianCategories?: TechnicianCategory[];
}

export interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; redirectTo?: string }>;
  logout: () => void;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
