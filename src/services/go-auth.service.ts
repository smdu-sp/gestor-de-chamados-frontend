// Serviço específico para integração com o backend Go
// Mantém o AuthService original intacto

import { apiClient, TokenManager } from "@/lib/api-client";
import { handleApiError } from "@/lib/error-handler";
import { GO_API_ENDPOINTS } from "@/lib/api-config";
import { mapGoUserToFrontend } from "@/types/go-backend";
import type {
  GoLoginRequest,
  GoUser,
  GoApiResponse,
} from "@/types/go-backend";

// Nova interface baseada na documentação do backend
interface GoLoginResponse {
  access_token: string;
  refresh_token: string;
}

export class GoAuthService {
  /**
   * Login user with login and password (backend Go)
   * Supports both regular authentication and LDAP
   */
  static async login(credentials: GoLoginRequest & { authType?: 'local' | 'ldap' }): Promise<any> {
    try {
      // Preparar payload simples sem auth_type por enquanto
      // Payload correto conforme esperado pelo backend Go
      const loginPayload = {
        login: credentials.login,
        senha: credentials.password
      };

      const response = await apiClient.post<GoLoginResponse>(
        GO_API_ENDPOINTS.AUTH.LOGIN,
        loginPayload
      );

      // O backend agora retorna access_token e refresh_token diretamente
      const loginData = response as any;

      if (!loginData.access_token) {
        throw new Error("Resposta de login inválida - access_token ausente");
      }

      // Armazenar tokens com os novos nomes
      TokenManager.setAccessToken(loginData.access_token, 24 * 60 * 60); // 24 horas
      if (loginData.refresh_token) {
        TokenManager.setRefreshToken(loginData.refresh_token);
      }

      // Como o login não retorna mais o usuário, buscamos separadamente
      const frontendUser = await this.getCurrentUser();

      return {
        user: frontendUser,
        accessToken: loginData.access_token,
        refreshToken: loginData.refresh_token || "",
        expiresIn: 24 * 60 * 60,
        success: true,
        redirectTo: "/meus-chamados",
      };
    } catch (error) {
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

      // Verifica se a resposta está encapsulada em GoApiResponse
      if (typeof (response as any).success === 'boolean') {
        if (!(response as any).success) {
          throw new Error((response as any).error || "Falha ao obter perfil do usuário");
        }
        // Dados estão em 'data'
        const goUser = (response as any).data;
        if (!goUser) {
          throw new Error("Dados do usuário não encontrados na resposta");
        }
        return mapGoUserToFrontend(goUser);
      } else {
        // Resposta direta do usuário (sem encapsulamento)
        const goUser = response as any;
        if (!goUser || !goUser.id) {
          throw new Error("Dados do usuário inválidos");
        }
        return mapGoUserToFrontend(goUser);
      }
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
