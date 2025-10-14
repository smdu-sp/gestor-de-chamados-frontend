// Serviço específico para usuários do backend Go
// Mantém o UsersService original intacto

import { apiClient } from "@/lib/api-client";
import { handleApiError } from "@/lib/error-handler";
import { GO_API_ENDPOINTS } from "@/lib/api-config";
import { mapGoUserToFrontend } from "@/types/go-backend";
import type { GoUser, GoApiResponse } from "@/types/go-backend";

export class GoUsersService {
  /**
   * Get all users (backend Go)
   */
  static async getUsers(): Promise<any[]> {
    try {
      const response = await apiClient.get<GoApiResponse<GoUser[]>>(
        GO_API_ENDPOINTS.USERS.LIST
      );

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.error || "Failed to fetch users");
      }

      // Converter dados do Go para o formato do frontend
      const goUsers = response.data.data || [];
      return goUsers.map(mapGoUserToFrontend);
    } catch (error) {
      handleApiError(error, { service: "GoUsersService", method: "getUsers" });
      throw error;
    }
  }

  /**
   * Get user by ID (backend Go)
   */
  static async getUser(id: string): Promise<any> {
    try {
      const response = await apiClient.get<GoApiResponse<GoUser>>(
        GO_API_ENDPOINTS.USERS.GET(id)
      );

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.error || "Failed to fetch user");
      }

      // Converter dados do Go para o formato do frontend
      return mapGoUserToFrontend(response.data.data!);
    } catch (error) {
      handleApiError(error, { service: "GoUsersService", method: "getUser" });
      throw error;
    }
  }

  /**
   * Search user by RF (Registro Funcional)
   */
  static async searchUserByRF(rf: string): Promise<any> {
    try {
      const response = await apiClient.get<GoApiResponse<GoUser>>(
        `${GO_API_ENDPOINTS.USERS.LIST}?rf=${encodeURIComponent(rf)}`
      );

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.error || "User not found");
      }

      // Converter dados do Go para o formato do frontend
      return mapGoUserToFrontend(response.data.data!);
    } catch (error) {
      handleApiError(error, { service: "GoUsersService", method: "searchUserByRF" });
      throw error;
    }
  }

  // TODO: Implementar outros métodos quando o backend Go estiver completo
  // static async createUser(userData: any): Promise<any> { ... }
  // static async updateUser(id: string, userData: any): Promise<any> { ... }
  // static async deleteUser(id: string): Promise<void> { ... }
}
