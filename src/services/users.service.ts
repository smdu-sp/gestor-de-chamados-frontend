import { apiClient, handleApiResponse, API_ENDPOINTS } from '@/lib/api-client'
import { handleApiError } from '@/lib/error-handler'
import {
  UserCreateRequest,
  UserUpdateRequest,
  UserResponse,
  UserFilters,
  PaginationParams,
  PaginatedResponse,
  ApiResponse
} from '@/types/api'

export class UsersService {
  /**
   * Get paginated list of users with filters
   */
  static async getUsers(
    pagination: PaginationParams,
    filters?: UserFilters
  ): Promise<PaginatedResponse<UserResponse>> {
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: pagination.sortBy,
        sortOrder: pagination.sortOrder,
        ...filters,
      }

      const response = await apiClient.get<PaginatedResponse<UserResponse>>(
        API_ENDPOINTS.USERS.LIST,
        params
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'UsersService', method: 'getUsers', params: { pagination, filters } })
      throw error
    }
  }

  /**
   * Get a specific user by ID
   */
  static async getUser(id: number): Promise<UserResponse> {
    try {
      const response = await apiClient.get<UserResponse>(
        API_ENDPOINTS.USERS.GET(id.toString())
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'UsersService', method: 'getUser', params: { id } })
      throw error
    }
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<UserResponse> {
    try {
      const response = await apiClient.get<UserResponse>(
        API_ENDPOINTS.AUTH.PROFILE
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'UsersService', method: 'getCurrentUser' })
      throw error
    }
  }

  /**
   * Create a new user
   */
  static async createUser(data: UserCreateRequest): Promise<UserResponse> {
    try {
      const response = await apiClient.post<UserResponse>(
        API_ENDPOINTS.USERS.CREATE,
        data
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'UsersService', method: 'createUser' })
      throw error
    }
  }

  /**
   * Update an existing user
   */
  static async updateUser(id: number, data: UserUpdateRequest): Promise<UserResponse> {
    try {
      const response = await apiClient.patch<UserResponse>(
        API_ENDPOINTS.USERS.UPDATE(id.toString()),
        data
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'UsersService', method: 'updateUser' })
      throw error
    }
  }

  /**
   * Update current user profile
   */
  static async updateProfile(data: UserUpdateRequest): Promise<UserResponse> {
    try {
      const response = await apiClient.patch<UserResponse>(
        API_ENDPOINTS.AUTH.PROFILE,
        data
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'UsersService', method: 'updateProfile' })
      throw error
    }
  }

  /**
   * Delete a user
   */
  static async deleteUser(id: number): Promise<void> {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id.toString()))
      handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'UsersService', method: 'deleteUser' })
      throw error
    }
  }

  /**
   * Toggle user status (active/inactive)
   */
  static async toggleUserStatus(id: number): Promise<UserResponse> {
    try {
      const response = await apiClient.patch<UserResponse>(
        `${API_ENDPOINTS.USERS.UPDATE(id.toString())}/toggle-status`
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'UsersService', method: 'toggleUserStatus' })
      throw error
    }
  }

  /**
   * Reset user password
   */
  static async resetUserPassword(id: number): Promise<{ temporaryPassword: string }> {
    try {
      const response = await apiClient.post<{ temporaryPassword: string }>(
        `${API_ENDPOINTS.USERS.GET(id.toString())}/reset-password`
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'UsersService', method: 'resetUserPassword' })
      throw error
    }
  }

  /**
   * Change user role
   */
  static async changeUserRole(
    id: number,
    role: 'ADMIN' | 'TECHNICIAN' | 'USER' | 'DEVELOPER'
  ): Promise<UserResponse> {
    try {
      const response = await apiClient.patch<UserResponse>(
        API_ENDPOINTS.USERS.UPDATE(id.toString()),
        { role }
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'UsersService', method: 'changeUserRole' })
      throw error
    }
  }

  /**
   * Get users by role
   */
  static async getUsersByRole(
    role: 'ADMIN' | 'TECHNICIAN' | 'USER' | 'DEVELOPER',
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<UserResponse>> {
    try {
      const params = {
        role,
        ...(pagination && {
          page: pagination.page,
          limit: pagination.limit,
          sortBy: pagination.sortBy,
          sortOrder: pagination.sortOrder,
        }),
      }

      const response = await apiClient.get<PaginatedResponse<UserResponse>>(
        API_ENDPOINTS.USERS.LIST,
        params
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'UsersService', method: 'getUsersByRole' })
      throw error
    }
  }

  /**
   * Get available technicians
   */
  static async getTechnicians(): Promise<UserResponse[]> {
    try {
      const response = await apiClient.get<UserResponse[]>(
        API_ENDPOINTS.USERS.TECHNICIANS
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'UsersService', method: 'getTechnicians' })
      throw error
    }
  }

  /**
   * Search users by name or email
   */
  static async searchUsers(
    query: string,
    pagination: PaginationParams,
    filters?: UserFilters
  ): Promise<PaginatedResponse<UserResponse>> {
    try {
      const params = {
        q: query,
        page: pagination.page,
        limit: pagination.limit,
        sortBy: pagination.sortBy,
        sortOrder: pagination.sortOrder,
        ...filters,
      }

      const response = await apiClient.get<PaginatedResponse<UserResponse>>(
        '/users/search',
        params
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'UsersService', method: 'searchUsers' })
      throw error
    }
  }

  /**
   * Upload user avatar
   */
  static async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await apiClient.upload<{ avatarUrl: string }>(
        '/users/avatar',
        formData
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'UsersService', method: 'uploadAvatar' })
      throw error
    }
  }



  /**
   * Get user statistics
   */
  static async getUserStats(): Promise<{
    total: number
    active: number
    inactive: number
    byRole: { role: string; count: number }[]
    byWorkUnit: { workUnit: string; count: number }[]
    recentRegistrations: number
  }> {
    try {
      const response = await apiClient.get('/users/stats')
      return handleApiResponse(response) as {
        total: number
        active: number
        inactive: number
        byRole: { role: string; count: number }[]
        byWorkUnit: { workUnit: string; count: number }[]
        recentRegistrations: number
      }
    } catch (error) {
      handleApiError(error, { service: 'UsersService', method: 'getUserStats' })
      throw error
    }
  }

  /**
   * Get user activity log
   */
  static async getUserActivity(
    userId: number,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<{
    id: number
    action: string
    description: string
    timestamp: string
    ipAddress?: string
    userAgent?: string
    metadata?: any
  }>> {
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: pagination.sortBy,
        sortOrder: pagination.sortOrder,
      }

      const response = await apiClient.get(
        `${API_ENDPOINTS.USERS.GET(userId.toString())}/activity`,
        params
      )
      return handleApiResponse(response) as PaginatedResponse<{
        id: number
        action: string
        description: string
        timestamp: string
        ipAddress?: string
        userAgent?: string
        metadata?: any
      }>
    } catch (error) {
      handleApiError(error, { service: 'UsersService', method: 'getUserActivity' })
      throw error
    }
  }

  /**
   * Get user permissions
   */
  static async getUserPermissions(userId: number): Promise<string[]> {
    try {
      const response = await apiClient.get<string[]>(
        `${API_ENDPOINTS.USERS.GET(userId.toString())}/permissions`
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'UsersService', method: 'getUserPermissions' })
      throw error
    }
  }

  /**
   * Update user permissions
   */
  static async updateUserPermissions(
    userId: number,
    permissions: string[]
  ): Promise<void> {
    try {
      const response = await apiClient.patch(
        `${API_ENDPOINTS.USERS.GET(userId.toString())}/permissions`,
        { permissions }
      )
      handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'UsersService', method: 'updateUserPermissions' })
      throw error
    }
  }

  /**
   * Bulk update users
   */
  static async bulkUpdateUsers(
    userIds: number[],
    updates: UserUpdateRequest
  ): Promise<UserResponse[]> {
    try {
      const response = await apiClient.patch<UserResponse[]>(
        '/users/bulk-update',
        {
          userIds,
          updates
        }
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'UsersService', method: 'bulkUpdateUsers' })
      throw error
    }
  }

  /**
   * Export users to CSV/Excel
   */
  static async exportUsers(
    filters?: UserFilters,
    format: 'csv' | 'excel' = 'csv'
  ): Promise<{ downloadUrl: string; filename: string }> {
    try {
      const response = await apiClient.post(
        '/users/export',
        {
          filters,
          format
        }
      )
      return handleApiResponse(response) as { downloadUrl: string; filename: string }
    } catch (error) {
      handleApiError(error, { service: 'UsersService', method: 'exportUsers' })
      throw error
    }
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      const response = await apiClient.post(
        '/users/send-password-reset',
        { email }
      )
      handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'UsersService', method: 'sendPasswordResetEmail' })
      throw error
    }
  }

  /**
   * Verify email address
   */
  static async verifyEmail(token: string): Promise<void> {
    try {
      const response = await apiClient.post(
        '/users/verify-email',
        { token }
      )
      handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'UsersService', method: 'verifyEmail' })
      throw error
    }
  }

  /**
   * Resend email verification
   */
  static async resendEmailVerification(): Promise<void> {
    try {
      const response = await apiClient.post('/users/resend-verification')
      handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'UsersService', method: 'resendEmailVerification' })
      throw error
    }
  }

  /**
   * Get user's assigned calls count
   */
  static async getUserCallsCount(userId: number): Promise<{
    total: number
    open: number
    inProgress: number
    resolved: number
  }> {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.USERS.GET(userId.toString())}/calls-count`
      )
      return handleApiResponse(response) as { total: number; open: number; inProgress: number; resolved: number }
    } catch (error) {
      handleApiError(error, { service: 'UsersService', method: 'getUserCallsCount' })
      throw error
    }
  }

  /**
   * Get technician performance metrics
   */
  static async getTechnicianMetrics(
    technicianId: number,
    dateFrom?: string,
    dateTo?: string
  ): Promise<{
    callsResolved: number
    averageResolutionTime: number
    customerSatisfactionRating: number
    totalTimeSpent: number
    callsAssigned: number
    callsInProgress: number
  }> {
    try {
      const params = {
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo }),
      }

      const response = await apiClient.get(
        `${API_ENDPOINTS.USERS.GET(technicianId.toString())}/metrics`,
        params
      )
      return handleApiResponse(response) as {
        callsResolved: number
        averageResolutionTime: number
        customerSatisfactionRating: number
        totalTimeSpent: number
        callsAssigned: number
        callsInProgress: number
      }
    } catch (error) {
      handleApiError(error, { service: 'UsersService', method: 'getTechnicianMetrics' })
      throw error
    }
  }
}

export default UsersService