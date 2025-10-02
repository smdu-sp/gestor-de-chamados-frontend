// User Management Service
// Handles all user-related API calls

import { apiClient } from '../lib/api-client'
import { API_ENDPOINTS } from '../lib/api-config'
import type {
  BackendUser,
  CreateUserRequest,
  UpdateUserRequest,
  GoApiResponse,
  PaginationRequest,
  UserFilters
} from '../types/backend'
import { UserRole } from '../types/auth'

export class UserService {
  /**
   * Get paginated list of users with optional filters
   */
  static async getUsers(
    pagination?: PaginationRequest,
    filters?: UserFilters
  ): Promise<{
    users: BackendUser[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    const params = new URLSearchParams()
    
    // Add pagination parameters
    if (pagination?.page) params.append('page', pagination.page.toString())
    if (pagination?.limit) params.append('limit', pagination.limit.toString())
    if (pagination?.sort) params.append('sort', pagination.sort)
    if (pagination?.order) params.append('order', pagination.order)
    
    // Add filter parameters
    if (filters?.role?.length) {
      filters.role.forEach(role => params.append('role', role))
    }
    if (filters?.status?.length) {
      filters.status.forEach(status => params.append('status', status))
    }
    if (filters?.workUnit?.length) {
      filters.workUnit.forEach(unit => params.append('workUnit', unit))
    }
    if (filters?.search) params.append('search', filters.search)
    
    const queryString = params.toString()
    const url = queryString ? `${API_ENDPOINTS.USERS.LIST}?${queryString}` : API_ENDPOINTS.USERS.LIST
    
    const response = await apiClient.get<GoApiResponse<{
      users: BackendUser[]
      total: number
      page: number
      limit: number
      totalPages: number
    }>>(url)
    
    return response.data?.data!
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string): Promise<BackendUser> {
    const response = await apiClient.get<GoApiResponse<BackendUser>>(
      API_ENDPOINTS.USERS.GET(id)
    )
    return response.data?.data!
  }

  /**
   * Create new user
   */
  static async createUser(userData: CreateUserRequest): Promise<BackendUser> {
    const response = await apiClient.post<GoApiResponse<BackendUser>>(
      API_ENDPOINTS.USERS.CREATE,
      userData
    )
    return response.data?.data!
  }

  /**
   * Update existing user
   */
  static async updateUser(id: string, updates: UpdateUserRequest): Promise<BackendUser> {
    const response = await apiClient.put<GoApiResponse<BackendUser>>(
      API_ENDPOINTS.USERS.UPDATE(id),
      updates
    )
    return response.data?.data!
  }

  /**
   * Delete user
   */
  static async deleteUser(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id))
  }

  /**
   * Activate user account
   */
  static async activateUser(id: string): Promise<BackendUser> {
    const response = await apiClient.post<GoApiResponse<BackendUser>>(
      API_ENDPOINTS.USERS.ACTIVATE(id)
    )
    return response.data?.data!
  }

  /**
   * Deactivate user account
   */
  static async deactivateUser(id: string): Promise<BackendUser> {
    const response = await apiClient.post<GoApiResponse<BackendUser>>(
      API_ENDPOINTS.USERS.DEACTIVATE(id)
    )
    return response.data?.data!
  }

  /**
   * Reset user password (admin only)
   */
  static async resetUserPassword(id: string): Promise<{ temporaryPassword: string }> {
    const response = await apiClient.post<GoApiResponse<{ temporaryPassword: string }>>(
      `/users/${id}/reset-password`
    )
    return response.data?.data!
  }

  /**
   * Get user statistics
   */
  static async getUserStats(id: string): Promise<{
    totalCalls: number
    resolvedCalls: number
    averageResolutionTime: number
    customerSatisfactionScore: number
    callsThisMonth: number
    callsResolvedThisMonth: number
  }> {
    const response = await apiClient.get<GoApiResponse<{
      totalCalls: number
      resolvedCalls: number
      averageResolutionTime: number
      customerSatisfactionScore: number
      callsThisMonth: number
      callsResolvedThisMonth: number
    }>>(`/users/${id}/stats`)
    return response.data?.data!
  }

  /**
   * Get all work units
   */
  static async getWorkUnits(): Promise<string[]> {
    const response = await apiClient.get<GoApiResponse<string[]>>(
      '/users/work-units'
    )
    return response.data?.data!
  }

  /**
   * Get all available roles
   */
  static async getRoles(): Promise<UserRole[]> {
    const response = await apiClient.get<GoApiResponse<UserRole[]>>(
      '/users/roles'
    )
    return response.data?.data!
  }

  /**
   * Bulk update users
   */
  static async bulkUpdateUsers(
    userIds: string[],
    updates: Partial<UpdateUserRequest>
  ): Promise<BackendUser[]> {
    const response = await apiClient.post<GoApiResponse<BackendUser[]>>(
      '/users/bulk-update',
      {
        userIds,
        updates
      }
    )
    return response.data?.data!
  }

  /**
   * Bulk delete users
   */
  static async bulkDeleteUsers(userIds: string[]): Promise<void> {
    await apiClient.post(
      '/users/bulk-delete',
      { userIds }
    )
  }

  /**
   * Export users to CSV/Excel
   */
  static async exportUsers(
    format: 'csv' | 'excel',
    filters?: UserFilters
  ): Promise<{ downloadUrl: string }> {
    const params = new URLSearchParams()
    params.append('format', format)
    
    if (filters?.role?.length) {
      filters.role.forEach(role => params.append('role', role))
    }
    if (filters?.status?.length) {
      filters.status.forEach(status => params.append('status', status))
    }
    if (filters?.workUnit?.length) {
      filters.workUnit.forEach(unit => params.append('workUnit', unit))
    }
    if (filters?.search) params.append('search', filters.search)
    
    const response = await apiClient.post<GoApiResponse<{ downloadUrl: string }>>(
      `/users/export?${params.toString()}`
    )
    return response.data?.data!
  }

  /**
   * Import users from CSV/Excel
   */
  static async importUsers(file: File): Promise<{
    imported: number
    failed: number
    errors: Array<{ row: number; error: string }>
  }> {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await apiClient.post<GoApiResponse<{
      imported: number
      failed: number
      errors: Array<{ row: number; error: string }>
    }>>(
      '/users/import',
      formData
    )
    return response.data?.data!
  }

  /**
   * Get user activity log
   */
  static async getUserActivity(
    id: string,
    pagination?: PaginationRequest
  ): Promise<{
    activities: Array<{
      id: string
      action: string
      details: string
      timestamp: string
      ipAddress?: string
    }>
    total: number
    page: number
    limit: number
  }> {
    const params = new URLSearchParams()
    if (pagination?.page) params.append('page', pagination.page.toString())
    if (pagination?.limit) params.append('limit', pagination.limit.toString())
    
    const queryString = params.toString()
    const url = pagination
      ? `/users/${id}/activity?${queryString}`
      : `/users/${id}/activity`
    
    const response = await apiClient.get<GoApiResponse<{
      activities: Array<{
        id: string
        action: string
        details: string
        timestamp: string
        ipAddress?: string
      }>
      total: number
      page: number
      limit: number
    }>>(url)
    
    return response.data?.data!
  }
}

export default UserService