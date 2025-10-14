// Serviço específico para chamados do backend Go
// Mantém o CallsService original intacto

import { apiClient, handleApiResponse } from "@/lib/api-client";
import { handleApiError } from "@/lib/error-handler";
import { GO_API_ENDPOINTS } from "@/lib/api-config";
import { mapGoCallToFrontend } from "@/types/go-backend";
import type {
  GoCall,
  GoCreateCallRequest,
  GoUpdateCallRequest,
  GoCallFilters,
  GoApiResponse,
} from "@/types/go-backend";
import type { PaginationParams, PaginatedResponse } from "@/types/api";

export class GoCallsService {
  /**
   * Get paginated list of calls with filters
   */
  static async getCalls(
    pagination: PaginationParams,
    filters?: GoCallFilters
  ): Promise<PaginatedResponse<any>> {
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: pagination.sortBy,
        sortOrder: pagination.sortOrder,
        ...filters,
      };

      console.log("🔍 Buscando chamados com parâmetros:", params);

      const response = await apiClient.get<GoCall[]>(
        GO_API_ENDPOINTS.CALLS.LIST,
        params
      );

      console.log("📥 Resposta do backend Go (chamados):", response);

      // Acessar os dados da resposta da API
      const calls = Array.isArray(response.data) ? response.data : [];

      // Converter chamados do Go para o formato do frontend
      const frontendCalls = calls.map(mapGoCallToFrontend);

      console.log("🔄 Chamados convertidos:", frontendCalls);

      // Simular paginação por enquanto (TODO: implementar no backend Go)
      return {
        data: frontendCalls,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total: frontendCalls.length,
          totalPages: Math.ceil(frontendCalls.length / pagination.limit),
          hasNext: false,
          hasPrev: false,
        },
      };
    } catch (error) {
      console.error("💥 Erro ao buscar chamados:", error);
      handleApiError(error, { service: "GoCallsService", method: "getCalls" });
      throw error;
    }
  }

  /**
   * Get a single call by ID
   */
  static async getCall(id: string): Promise<any> {
    try {
      console.log("🔍 Buscando chamado:", id);

      const response = await apiClient.get<GoCall>(
        GO_API_ENDPOINTS.CALLS.GET(id)
      );

      console.log("📥 Resposta do backend Go (chamado):", response);

      // Acessar os dados da resposta da API
      if (!response.data) {
        throw new Error("Chamado não encontrado");
      }

      // Converter chamado do Go para o formato do frontend
      const frontendCall = mapGoCallToFrontend(response.data);

      console.log("🔄 Chamado convertido:", frontendCall);

      return frontendCall;
    } catch (error) {
      console.error("💥 Erro ao buscar chamado:", error);
      handleApiError(error, { service: "GoCallsService", method: "getCall" });
      throw error;
    }
  }

  /**
   * Create a new call
   */
  static async createCall(callData: GoCreateCallRequest): Promise<any> {
    try {
      console.log("🔍 Criando chamado:", callData);

      const response = await apiClient.post<GoCall>(
        GO_API_ENDPOINTS.CALLS.CREATE,
        callData
      );

      console.log("📥 Resposta do backend Go (criar chamado):", response);

      // Processar resposta padrão (valida success/message/error) e extrair dados
      const createdGoCall = handleApiResponse<GoCall>(response);

      // Converter chamado do Go para o formato do frontend
      const frontendCall = mapGoCallToFrontend(createdGoCall);

      console.log("🔄 Chamado criado convertido:", frontendCall);

      return frontendCall;
    } catch (error) {
      console.error("💥 Erro ao criar chamado:", error);
      handleApiError(error, {
        service: "GoCallsService",
        method: "createCall",
        payload: callData,
      });
      throw error;
    }
  }

  /**
   * Update an existing call
   */
  static async updateCall(
    id: string,
    callData: GoUpdateCallRequest
  ): Promise<any> {
    try {
      console.log("🔍 Atualizando chamado:", id, callData);

      const response = await apiClient.put<GoCall>(
        GO_API_ENDPOINTS.CALLS.UPDATE(id),
        callData
      );

      console.log("📥 Resposta do backend Go (atualizar chamado):", response);

      // Acessar os dados da resposta da API
      if (!response.data) {
        throw new Error("Erro ao atualizar chamado");
      }

      // Converter chamado do Go para o formato do frontend
      const frontendCall = mapGoCallToFrontend(response.data);

      console.log("🔄 Chamado atualizado convertido:", frontendCall);

      return frontendCall;
    } catch (error) {
      console.error("💥 Erro ao atualizar chamado:", error);
      handleApiError(error, {
        service: "GoCallsService",
        method: "updateCall",
      });
      throw error;
    }
  }

  /**
   * Delete a call
   */
  static async deleteCall(id: string): Promise<void> {
    try {
      console.log("🔍 Deletando chamado:", id);

      await apiClient.delete(GO_API_ENDPOINTS.CALLS.DELETE(id));

      console.log("✅ Chamado deletado com sucesso");
    } catch (error) {
      console.error("💥 Erro ao deletar chamado:", error);
      handleApiError(error, {
        service: "GoCallsService",
        method: "deleteCall",
      });
      throw error;
    }
  }

  /**
   * Assign a call to a user
   */
  static async assignCall(callId: string, userId: string): Promise<any> {
    try {
      console.log("🔍 Atribuindo chamado:", callId, "para usuário:", userId);

      const response = await apiClient.put<GoCall>(
        GO_API_ENDPOINTS.CALLS.UPDATE(callId),
        { assignedToId: userId }
      );

      console.log("📥 Resposta do backend Go (atribuir chamado):", response);

      // Acessar os dados da resposta da API
      if (!response.data) {
        throw new Error("Erro ao atribuir chamado");
      }

      // Converter chamado do Go para o formato do frontend
      const frontendCall = mapGoCallToFrontend(response.data);

      console.log("🔄 Chamado atribuído convertido:", frontendCall);

      return frontendCall;
    } catch (error) {
      console.error("💥 Erro ao atribuir chamado:", error);
      handleApiError(error, {
        service: "GoCallsService",
        method: "assignCall",
      });
      throw error;
    }
  }
}
