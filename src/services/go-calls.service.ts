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

      const response = await apiClient.get<GoCall[]>(
        GO_API_ENDPOINTS.CALLS.LIST,
        params
      );

      // O backend Go pode retornar os dados diretamente ou em response.data
      let responseData: any;

      // Se response tem a estrutura {total, pagina, limite, items} diretamente
      if (response && typeof response === "object" && "items" in response) {
        responseData = response as any;
      }
      // Se response.data tem a estrutura {total, pagina, limite, items}
      else if (
        response?.data &&
        typeof response.data === "object" &&
        "items" in response.data
      ) {
        responseData = response.data as any;
      }
      // Fallback: tentar response.data como array ou response como array
      else {
        responseData = {
          items: Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response)
            ? response
            : [],
          total: 0,
          pagina: pagination.page,
          limite: pagination.limit,
        };
      }

      const calls = Array.isArray(responseData.items) ? responseData.items : [];
      const total = responseData.total || 0;
      const currentPage = responseData.pagina || pagination.page;
      const limit = responseData.limite || pagination.limit;

      // Converter chamados do Go para o formato do frontend
      const frontendCalls = await Promise.all(calls.map(mapGoCallToFrontend));

      // Usar a paginação real do backend Go
      return {
        data: frontendCalls,
        pagination: {
          page: currentPage,
          limit: limit,
          total: total,
          totalPages: Math.ceil(total / limit),
          hasNext: currentPage * limit < total,
          hasPrev: currentPage > 1,
        },
      };
    } catch (error) {
      handleApiError(error, { service: "GoCallsService", method: "getCalls" });
      throw error;
    }
  }

  /**
   * Get a single call by ID
   */
  static async getCall(id: string): Promise<any> {
    try {
      const response = await apiClient.get<GoCall>(
        GO_API_ENDPOINTS.CALLS.GET(id)
      );

      // Acessar os dados da resposta da API
      if (!response.data) {
        throw new Error("Chamado não encontrado");
      }

      // Converter chamado do Go para o formato do frontend
      const frontendCall = await mapGoCallToFrontend(response.data);

      return frontendCall;
    } catch (error) {
      handleApiError(error, { service: "GoCallsService", method: "getCall" });
      throw error;
    }
  }

  /**
   * Create a new call
   */
  static async createCall(callData: GoCreateCallRequest): Promise<any> {
    try {
      const response = await apiClient.post<GoCall>(
        GO_API_ENDPOINTS.CALLS.CREATE,
        callData
      );

      // O backend Go retorna os dados diretamente no response, não em response.data
      const responseData = response.data || response;

      if (!responseData || typeof responseData !== "object") {
        throw new Error("Erro ao criar chamado - resposta vazia");
      }

      // Converter chamado do Go para o formato do frontend
      const frontendCall = await mapGoCallToFrontend(responseData);

      return frontendCall;
    } catch (error) {
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
      const response = await apiClient.put<GoCall>(
        GO_API_ENDPOINTS.CALLS.UPDATE(id),
        callData
      );

      // Acessar os dados da resposta da API
      if (!response.data) {
        throw new Error("Erro ao atualizar chamado");
      }

      // Converter chamado do Go para o formato do frontend
      const frontendCall = await mapGoCallToFrontend(response.data);

      return frontendCall;
    } catch (error) {
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
      await apiClient.delete(GO_API_ENDPOINTS.CALLS.DELETE(id));
    } catch (error) {
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
      const response = await apiClient.put<GoCall>(
        GO_API_ENDPOINTS.CALLS.UPDATE(callId),
        { assignedToId: userId }
      );

      // Acessar os dados da resposta da API
      if (!response.data) {
        throw new Error("Erro ao atribuir chamado");
      }

      // Converter chamado do Go para o formato do frontend
      const frontendCall = await mapGoCallToFrontend(response.data);

      return frontendCall;
    } catch (error) {
      handleApiError(error, {
        service: "GoCallsService",
        method: "assignCall",
      });
      throw error;
    }
  }
}
