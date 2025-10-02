import { apiClient, handleApiResponse, API_ENDPOINTS } from '@/lib/api-client'
import { handleApiError } from '@/lib/error-handler'
import {
  CallCreateRequest,
  CallUpdateRequest,
  CallResponse,
  CallFilters,
  PaginationParams,
  PaginatedResponse,
  CommentCreateRequest,
  CommentResponse,
  FileUploadResponse
} from '@/types/api'

export class CallsService {
  /**
   * Get paginated list of calls with filters
   */
  static async getCalls(
    pagination: PaginationParams,
    filters?: CallFilters
  ): Promise<PaginatedResponse<CallResponse>> {
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: pagination.sortBy,
        sortOrder: pagination.sortOrder,
        ...filters,
      }

      const response = await apiClient.get<PaginatedResponse<CallResponse>>(
        API_ENDPOINTS.CALLS.LIST,
        params
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'CallsService', method: 'getCalls', params: { pagination, filters } })
      throw error
    }
  }

  /**
   * Get a specific call by ID
   */
  static async getCall(id: number): Promise<CallResponse> {
    try {
      const response = await apiClient.get<CallResponse>(
        API_ENDPOINTS.CALLS.GET(id.toString())
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'CallsService', method: 'getCall', params: { id } })
      throw error
    }
  }

  /**
   * Create a new call
   */
  static async createCall(data: CallCreateRequest): Promise<CallResponse> {
    try {
      const response = await apiClient.post<CallResponse>(
        API_ENDPOINTS.CALLS.CREATE,
        data
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'CallsService', method: 'createCall' })
      throw error
    }
  }

  /**
   * Update an existing call
   */
  static async updateCall(id: number, data: CallUpdateRequest): Promise<CallResponse> {
    try {
      const response = await apiClient.patch<CallResponse>(
        API_ENDPOINTS.CALLS.UPDATE(id.toString()),
        data
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'CallsService', method: 'updateCall' })
      throw error
    }
  }

  /**
   * Delete a call
   */
  static async deleteCall(id: number): Promise<void> {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.CALLS.DELETE(id.toString()))
      handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'CallsService', method: 'deleteCall' })
      throw error
    }
  }

  /**
   * Assign a call to a technician
   */
  static async assignCall(callId: number, technicianId: number): Promise<CallResponse> {
    try {
      const response = await apiClient.post<CallResponse>(
        API_ENDPOINTS.CALLS.ASSIGN(callId.toString()),
        { technicianId }
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'CallsService', method: 'assignCall' })
      throw error
    }
  }

  /**
   * Unassign a call
   */
  static async unassignCall(callId: number): Promise<CallResponse> {
    try {
      const response = await apiClient.post<CallResponse>(
        API_ENDPOINTS.CALLS.ASSIGN(callId.toString()),
        { technicianId: null }
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'CallsService', method: 'unassignCall' })
      throw error
    }
  }

  /**
   * Change call status
   */
  static async changeStatus(
    callId: number,
    status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed',
    resolution?: string
  ): Promise<CallResponse> {
    try {
      const data: CallUpdateRequest = { status }
      if (resolution) {
        data.resolution = resolution
      }

      const response = await apiClient.patch<CallResponse>(
        API_ENDPOINTS.CALLS.UPDATE(callId.toString()),
        data
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'CallsService', method: 'changeStatus' })
      throw error
    }
  }

  /**
   * Change call priority
   */
  static async changePriority(
    callId: number,
    priority: 'low' | 'medium' | 'high' | 'urgent'
  ): Promise<CallResponse> {
    try {
      const response = await apiClient.patch<CallResponse>(
        API_ENDPOINTS.CALLS.UPDATE(callId.toString()),
        { priority }
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'CallsService', method: 'changePriority' })
      throw error
    }
  }

  /**
   * Get call comments
   */
  static async getComments(callId: number): Promise<CommentResponse[]> {
    try {
      const response = await apiClient.get<CommentResponse[]>(
        API_ENDPOINTS.CALLS.COMMENTS(callId.toString())
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'CallsService', method: 'getComments' })
      throw error
    }
  }

  /**
   * Add a comment to a call
   */
  static async addComment(data: CommentCreateRequest): Promise<CommentResponse> {
    try {
      const response = await apiClient.post<CommentResponse>(
        API_ENDPOINTS.CALLS.COMMENTS(data.callId.toString()),
        data
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'CallsService', method: 'addComment' })
      throw error
    }
  }

  /**
   * Update a comment
   */
  static async updateComment(
    callId: number,
    commentId: number,
    content: string
  ): Promise<CommentResponse> {
    try {
      const response = await apiClient.patch<CommentResponse>(
        `${API_ENDPOINTS.CALLS.COMMENTS(callId.toString())}/${commentId}`,
        { content }
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'CallsService', method: 'updateComment' })
      throw error
    }
  }

  /**
   * Delete a comment
   */
  static async deleteComment(callId: number, commentId: number): Promise<void> {
    try {
      const response = await apiClient.delete(
        `${API_ENDPOINTS.CALLS.COMMENTS(callId.toString())}/${commentId}`
      )
      handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'CallsService', method: 'deleteComment' })
      throw error
    }
  }

  /**
   * Upload attachment to a call
   */
  static async uploadAttachment(
    callId: number,
    file: File,
    description?: string
  ): Promise<FileUploadResponse> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (description) {
        formData.append('description', description)
      }

      const response = await apiClient.upload<FileUploadResponse>(
        API_ENDPOINTS.CALLS.ATTACHMENTS(callId.toString()),
        formData
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'CallsService', method: 'uploadAttachment' })
      throw error
    }
  }

  /**
   * Delete an attachment
   */
  static async deleteAttachment(callId: number, attachmentId: number): Promise<void> {
    try {
      const response = await apiClient.delete(
        `${API_ENDPOINTS.CALLS.ATTACHMENTS(callId.toString())}/${attachmentId}`
      )
      handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'CallsService', method: 'deleteAttachment' })
      throw error
    }
  }

  /**
   * Get calls assigned to current user
   */
  static async getMyAssignedCalls(
    pagination: PaginationParams,
    filters?: Omit<CallFilters, 'assignedTo'>
  ): Promise<PaginatedResponse<CallResponse>> {
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: pagination.sortBy,
        sortOrder: pagination.sortOrder,
        assignedToMe: true,
        ...filters,
      }

      const response = await apiClient.get<PaginatedResponse<CallResponse>>(
        API_ENDPOINTS.CALLS.LIST,
        params
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'CallsService', method: 'getMyAssignedCalls' })
      throw error
    }
  }

  /**
   * Get calls created by current user
   */
  static async getMyCreatedCalls(
    pagination: PaginationParams,
    filters?: Omit<CallFilters, 'createdBy'>
  ): Promise<PaginatedResponse<CallResponse>> {
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: pagination.sortBy,
        sortOrder: pagination.sortOrder,
        createdByMe: true,
        ...filters,
      }

      const response = await apiClient.get<PaginatedResponse<CallResponse>>(
        API_ENDPOINTS.CALLS.LIST,
        params
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'CallsService', method: 'getMyCreatedCalls' })
      throw error
    }
  }

  /**
   * Get call statistics
   */
  static async getCallStats(filters?: {
    dateFrom?: string
    dateTo?: string
    workUnit?: string
  }): Promise<{
    total: number
    open: number
    inProgress: number
    pending: number
    resolved: number
    closed: number
    byPriority: { priority: string; count: number }[]
    byCategory: { category: string; count: number }[]
    averageResolutionTime: number
  }> {
    try {
      const response = await apiClient.get<{
        total: number
        open: number
        inProgress: number
        pending: number
        resolved: number
        closed: number
        byPriority: { priority: string; count: number }[]
        byCategory: { category: string; count: number }[]
        averageResolutionTime: number
      }>(
        API_ENDPOINTS.CALLS.STATS,
        filters
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'CallsService', method: 'getCallStats' })
      throw error
    }
  }

  /**
   * Get available categories
   */
  static async getCategories(): Promise<string[]> {
    try {
      const response = await apiClient.get<string[]>(API_ENDPOINTS.CALLS.CATEGORIES)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'CallsService', method: 'getCategories' })
      throw error
    }
  }

  /**
   * Get available work units
   */
  static async getWorkUnits(): Promise<string[]> {
    try {
      const response = await apiClient.get<string[]>('/calls/work-units')
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'CallsService', method: 'getWorkUnits' })
      throw error
    }
  }

  /**
   * Search calls by text
   */
  static async searchCalls(
    query: string,
    pagination: PaginationParams,
    filters?: CallFilters
  ): Promise<PaginatedResponse<CallResponse>> {
    try {
      const params = {
        q: query,
        page: pagination.page,
        limit: pagination.limit,
        sortBy: pagination.sortBy,
        sortOrder: pagination.sortOrder,
        ...filters,
      }

      const response = await apiClient.get<PaginatedResponse<CallResponse>>(
        '/calls/search',
        params
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'CallsService', method: 'searchCalls' })
      throw error
    }
  }

  /**
   * Bulk update calls
   */
  static async bulkUpdateCalls(
    callIds: number[],
    updates: CallUpdateRequest
  ): Promise<CallResponse[]> {
    try {
      const response = await apiClient.patch<CallResponse[]>(
        '/calls/bulk-update',
        {
          callIds,
          updates
        }
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'CallsService', method: 'bulkUpdateCalls' })
      throw error
    }
  }

  /**
   * Export calls to CSV/Excel
   */
  static async exportCalls(
    filters?: CallFilters,
    format: 'csv' | 'excel' = 'csv'
  ): Promise<{ downloadUrl: string; filename: string }> {
    try {
      const response = await apiClient.post<{ downloadUrl: string; filename: string }>(
        API_ENDPOINTS.CALLS.EXPORT,
        {
          filters,
          format
        }
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'CallsService', method: 'exportCalls' })
      throw error
    }
  }

  /**
   * Get call activity timeline
   */
  static async getCallTimeline(callId: number): Promise<{
    id: number
    action: string
    description: string
    userId: number
    userName: string
    timestamp: string
    metadata?: any
  }[]> {
    try {
      const response = await apiClient.get<{
        id: number
        action: string
        description: string
        userId: number
        userName: string
        timestamp: string
        metadata?: any
      }[]>(
        `${API_ENDPOINTS.CALLS.GET(callId.toString())}/timeline`
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'CallsService', method: 'getCallTimeline' })
      throw error
    }
  }

  /**
   * Log time spent on a call
   */
  static async logTimeSpent(
    callId: number,
    minutes: number,
    description?: string
  ): Promise<void> {
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.CALLS.GET(callId.toString())}/time-log`,
        {
          minutes,
          description
        }
      )
      handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'CallsService', method: 'logTimeSpent' })
      throw error
    }
  }
}

export default CallsService