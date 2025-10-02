import { apiClient, handleApiResponse } from '@/lib/api-client';
import { handleApiError } from '@/lib/error-handler';
import { API_ENDPOINTS } from '@/lib/api-config';
import {
  CallFeedback,
  FeedbackStats,
  TechnicianFeedbackStats,
  SubmitFeedbackRequest,
  FeedbackFilters,
} from '@/types/feedback';
import { PaginationParams, PaginatedResponse } from '@/types/api';

export class FeedbackService {
  /**
   * Buscar feedback de um chamado específico
   */
  static async getCallFeedback(callId: string): Promise<CallFeedback | null> {
    try {
      const response = await apiClient.get<CallFeedback>(
        API_ENDPOINTS.FEEDBACK.GET_BY_CALL(callId)
      );
      return handleApiResponse(response);
    } catch (error) {
      // Se não encontrar feedback, retorna null ao invés de erro
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      handleApiError(error, { service: 'FeedbackService', method: 'getCallFeedback' });
      throw error;
    }
  }

  /**
   * Submeter feedback para um chamado
   */
  static async submitFeedback(
    callId: string,
    feedback: SubmitFeedbackRequest
  ): Promise<{ success: boolean; message: string; newStatus: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string; newStatus: string }>(
        API_ENDPOINTS.FEEDBACK.SUBMIT(callId),
        feedback
      );
      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error, { service: 'FeedbackService', method: 'submitFeedback' });
      throw error;
    }
  }

  /**
   * Buscar estatísticas gerais de feedback
   */
  static async getFeedbackStats(): Promise<FeedbackStats> {
    try {
      const response = await apiClient.get<FeedbackStats>(
        API_ENDPOINTS.FEEDBACK.STATS
      );
      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error, { service: 'FeedbackService', method: 'getFeedbackStats' });
      throw error;
    }
  }

  /**
   * Buscar estatísticas de feedback por técnico
   */
  static async getTechnicianFeedbackStats(
    technicianId?: string
  ): Promise<TechnicianFeedbackStats[]> {
    try {
      const endpoint = technicianId 
        ? API_ENDPOINTS.FEEDBACK.TECHNICIAN_STATS(technicianId)
        : API_ENDPOINTS.FEEDBACK.ALL_TECHNICIAN_STATS;
        
      const response = await apiClient.get<TechnicianFeedbackStats[]>(endpoint);
      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error, { service: 'FeedbackService', method: 'getTechnicianFeedbackStats' });
      throw error;
    }
  }

  /**
   * Buscar lista paginada de feedbacks com filtros
   */
  static async getFeedbacks(
    pagination: PaginationParams,
    filters?: FeedbackFilters
  ): Promise<PaginatedResponse<CallFeedback>> {
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: pagination.sortBy,
        sortOrder: pagination.sortOrder,
        ...filters,
      };

      const response = await apiClient.get<PaginatedResponse<CallFeedback>>(
        API_ENDPOINTS.FEEDBACK.LIST,
        params
      );
      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error, { service: 'FeedbackService', method: 'getFeedbacks' });
      throw error;
    }
  }

  /**
   * Verificar se um chamado pode ser avaliado
   */
  static async canEvaluateCall(callId: string): Promise<boolean> {
    try {
      const response = await apiClient.get<{ canEvaluate: boolean }>(
        API_ENDPOINTS.FEEDBACK.CAN_EVALUATE(callId)
      );
      const result = handleApiResponse(response);
      return result.canEvaluate;
    } catch (error) {
      handleApiError(error, { service: 'FeedbackService', method: 'canEvaluateCall' });
      return false;
    }
  }
}
