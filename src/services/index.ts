// Services index - Export all services for easier imports

import type { PaginationParams } from '@/types/api'
import { AuthService } from './auth.service'
import { CallsService } from './calls.service'
import { UsersService } from './users.service'
import { DashboardService } from './dashboard.service'
import { ReportsService } from './reports.service'
import { SettingsService } from './settings.service'
import { NotificationsService } from './notifications.service'

// Go backend services
import { GoAuthService } from './go-auth.service'
import { GoUsersService } from './go-users.service'
import { GoCallsService } from './go-calls.service'

export { 
  AuthService, 
  CallsService, 
  UsersService, 
  DashboardService, 
  ReportsService, 
  SettingsService, 
  NotificationsService,
  // Go backend services
  GoAuthService,
  GoUsersService,
  GoCallsService
}

// Default exports
export { default as AuthServiceDefault } from './auth.service'
export { default as CallsServiceDefault } from './calls.service'
export { default as UsersServiceDefault } from './users.service'
export { default as DashboardServiceDefault } from './dashboard.service'
export { default as ReportsServiceDefault } from './reports.service'
export { default as SettingsServiceDefault } from './settings.service'
export { default as NotificationsServiceDefault } from './notifications.service'

// Re-export types for convenience
export type {
  ApiResponse,
  PaginationParams,
  PaginatedResponse,
  CallCreateRequest,
  CallUpdateRequest,
  CallResponse,
  UserCreateRequest,
  UserUpdateRequest,
  UserResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  DashboardStats,
  CommentCreateRequest,
  CommentResponse,
  FileUploadResponse,
  SystemSettings,
  ApiError,
  CallFilters,
  UserFilters,
  NotificationResponse,
  WebhookEvent,
  AuditLogResponse,
  ReportRequest,
  ReportResponse
} from '@/types/api'

// Service configuration
export const SERVICES_CONFIG = {
  // Default pagination settings
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // Default retry settings
  DEFAULT_RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
  
  // Cache settings
  CACHE_TTL_MS: 5 * 60 * 1000, // 5 minutes
  
  // File upload settings
  MAX_FILE_SIZE_MB: 10,
  ALLOWED_FILE_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv'
  ],
  
  // Real-time update intervals
  DASHBOARD_REFRESH_INTERVAL_MS: 30 * 1000, // 30 seconds
  NOTIFICATIONS_REFRESH_INTERVAL_MS: 60 * 1000, // 1 minute
  CALLS_REFRESH_INTERVAL_MS: 15 * 1000, // 15 seconds
} as const

// Service utilities
export const ServiceUtils = {
  /**
   * Format error message from API response
   */
  formatErrorMessage: (error: any): string => {
    if (typeof error === 'string') return error
    if (error?.message) return error.message
    if (error?.error) return error.error
    return 'An unexpected error occurred'
  },

  /**
   * Check if file type is allowed for upload
   */
  isFileTypeAllowed: (fileType: string): boolean => {
    return SERVICES_CONFIG.ALLOWED_FILE_TYPES.includes(fileType as any)
  },

  /**
   * Check if file size is within limits
   */
  isFileSizeAllowed: (fileSizeBytes: number): boolean => {
    const maxSizeBytes = SERVICES_CONFIG.MAX_FILE_SIZE_MB * 1024 * 1024
    return fileSizeBytes <= maxSizeBytes
  },

  /**
   * Validate pagination parameters
   */
  validatePagination: (pagination: Partial<PaginationParams>): PaginationParams => {
    return {
      page: Math.max(1, pagination.page || 1),
      limit: Math.min(
        SERVICES_CONFIG.MAX_PAGE_SIZE,
        Math.max(1, pagination.limit || SERVICES_CONFIG.DEFAULT_PAGE_SIZE)
      ),
      sortBy: pagination.sortBy || 'createdAt',
      sortOrder: pagination.sortOrder || 'desc'
    }
  },

  /**
   * Create debounced function for API calls
   */
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  },

  /**
   * Create throttled function for API calls
   */
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  },

  /**
   * Format date for API requests
   */
  formatDateForAPI: (date: Date): string => {
    return date.toISOString().split('T')[0]
  },

  /**
   * Format datetime for API requests
   */
  formatDateTimeForAPI: (date: Date): string => {
    return date.toISOString()
  },

  /**
   * Parse API date response
   */
  parseAPIDate: (dateString: string): Date => {
    return new Date(dateString)
  },

  /**
   * Generate unique request ID for tracking
   */
  generateRequestId: (): string => {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },

  /**
   * Check if response indicates success
   */
  isSuccessResponse: (status: number): boolean => {
    return status >= 200 && status < 300
  },

  /**
   * Check if error is network related
   */
  isNetworkError: (error: any): boolean => {
    return (
      error?.code === 'NETWORK_ERROR' ||
      error?.message?.includes('Network Error') ||
      error?.message?.includes('fetch')
    )
  },

  /**
   * Check if error is authentication related
   */
  isAuthError: (error: any): boolean => {
    return (
      error?.status === 401 ||
      error?.status === 403 ||
      error?.code === 'UNAUTHORIZED' ||
      error?.code === 'FORBIDDEN'
    )
  },

  /**
   * Check if error is validation related
   */
  isValidationError: (error: any): boolean => {
    return (
      error?.status === 400 ||
      error?.status === 422 ||
      error?.code === 'VALIDATION_ERROR'
    )
  },

  /**
   * Extract validation errors from API response
   */
  extractValidationErrors: (error: any): Record<string, string[]> => {
    if (error?.errors && typeof error.errors === 'object') {
      return error.errors
    }
    if (error?.details && Array.isArray(error.details)) {
      const errors: Record<string, string[]> = {}
      error.details.forEach((detail: any) => {
        if (detail.field && detail.message) {
          if (!errors[detail.field]) {
            errors[detail.field] = []
          }
          errors[detail.field].push(detail.message)
        }
      })
      return errors
    }
    return {}
  }
}

// Service hooks for React components (if using React Query or SWR)
// Export feedback service
export { FeedbackService } from './feedback.service'

// Query keys for caching
export const ServiceHooks = {
  QUERY_KEYS: {
    CALLS: 'calls',
    USERS: 'users',
    DASHBOARD: 'dashboard',
    REPORTS: 'reports',
    SETTINGS: 'settings',
    NOTIFICATIONS: 'notifications',
    USER_PROFILE: 'user-profile'
  } as const,

  // Mutation keys
  MUTATION_KEYS: {
    LOGIN: 'login',
    LOGOUT: 'logout',
    CREATE_CALL: 'create-call',
    UPDATE_CALL: 'update-call',
    DELETE_CALL: 'delete-call',
    CREATE_USER: 'create-user',
    UPDATE_USER: 'update-user',
    DELETE_USER: 'delete-user'
  } as const
}

// Export service instances (if needed for dependency injection)
export const serviceInstances = {
  auth: AuthService,
  calls: CallsService,
  users: UsersService,
  dashboard: DashboardService,
  reports: ReportsService,
  settings: SettingsService,
  notifications: NotificationsService
} as const

export type ServiceInstances = typeof serviceInstances
export type ServiceNames = keyof ServiceInstances