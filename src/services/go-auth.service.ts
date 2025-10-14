// Serviço específico para integração com o backend Go
// Mantém o AuthService original intacto

import { apiClient, TokenManager } from "@/lib/api-client";
import { handleApiError } from "@/lib/error-handler";
import { GO_API_ENDPOINTS } from "@/lib/api-config";
import { mapGoUserToFrontend } from "@/types/go-backend";
import type {
  GoLoginRequest,
  GoLoginResponse,
  GoUser,
  GoApiResponse,
} from "@/types/go-backend";

export class GoAuthService {
  /**
   * Login user with login and password (backend Go)
   */
  static async login(credentials: GoLoginRequest): Promise<any> {
    try {
      console.log("🔍 Enviando credenciais:", credentials);

      const response = await apiClient.post<GoApiResponse<GoLoginResponse>>(
        GO_API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      console.log("📥 Resposta completa do backend:", response);
      console.log("📊 response.data:", response.data);

      // ✅ CORREÇÃO: O backend Go retorna os dados diretamente
      // Não usa a estrutura {success: true, data: {...}}
      const loginData = response as any; // A resposta já é os dados do login

      if (!loginData.token || !loginData.user) {
        throw new Error("Invalid login response - missing token or user");
      }

      console.log("👤 Dados de login:", loginData);

      // Store tokens
      TokenManager.setAccessToken(loginData.token, 24 * 60 * 60); // 24 horas
      if (loginData.refreshToken) {
        TokenManager.setRefreshToken(loginData.refreshToken);
      }

      // Converter dados do Go para o formato do frontend
      const frontendUser = mapGoUserToFrontend(loginData.user);
      console.log("🔄 Usuário convertido:", frontendUser);

      return {
        user: frontendUser,
        accessToken: loginData.token,
        refreshToken: loginData.refreshToken || "",
        expiresIn: 24 * 60 * 60,
        success: true,
        redirectTo: "/meus-chamados",
      };
    } catch (error) {
      console.error("💥 Erro no login:", error);
      handleApiError(error, { service: "GoAuthService", method: "login" });
      throw error;
    }
  }

  /**
   * Get current user profile (backend Go)
   */
  static async getCurrentUser(): Promise<any> {
    try {
      const response = await apiClient.get<GoApiResponse<GoUser>>(
        GO_API_ENDPOINTS.AUTH.PROFILE
      );

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.error || "Failed to get user profile");
      }

      // Converter dados do Go para o formato do frontend
      return mapGoUserToFrontend(response.data.data!);
    } catch (error) {
      handleApiError(error, {
        service: "GoAuthService",
        method: "getCurrentUser",
      });
      throw error;
    }
  }

  /**
   * Logout user and clear tokens
   */
  static async logout(): Promise<void> {
    try {
      // Clear tokens locally (o backend Go não tem endpoint de logout ainda)
      TokenManager.clearTokens();
    } catch (error) {
      handleApiError(error, { service: "GoAuthService", method: "logout" });
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = TokenManager.getAccessToken();
    return !!token && !TokenManager.isTokenExpired();
  }
}
