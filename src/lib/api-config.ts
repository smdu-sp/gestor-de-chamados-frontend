// API Configuration for Golang Backend Integration
// This file centralizes all API endpoints and configuration

// Base API URL - Update this when backend is deployed
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
    TWO_FACTOR_ENABLE: '/auth/2fa/enable',
    TWO_FACTOR_VERIFY: '/auth/2fa/verify',
    TWO_FACTOR_DISABLE: '/auth/2fa/disable',
    TWO_FACTOR_BACKUP_CODES: '/auth/2fa/backup-codes',
    SESSIONS: '/auth/sessions',
    REVOKE_SESSION: (id: string) => `/auth/sessions/${id}`,
    REVOKE_ALL_SESSIONS: '/auth/sessions/revoke-all'
  },

  // User management endpoints
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    ACTIVATE: (id: string) => `/users/${id}/activate`,
    DEACTIVATE: (id: string) => `/users/${id}/deactivate`,
    TECHNICIANS: '/users/technicians'
  },

  // Call/Ticket management endpoints
  CALLS: {
    LIST: '/calls',
    CREATE: '/calls',
    GET: (id: string) => `/calls/${id}`,
    UPDATE: (id: string) => `/calls/${id}`,
    DELETE: (id: string) => `/calls/${id}`,
    ASSIGN: (id: string) => `/calls/${id}/assign`,
    CLOSE: (id: string) => `/calls/${id}/close`,
    REOPEN: (id: string) => `/calls/${id}/reopen`,
    NOTES: (id: string) => `/calls/${id}/notes`,
    HISTORY: (id: string) => `/calls/${id}/history`,
    COMMENTS: (id: string) => `/calls/${id}/comments`,
    ATTACHMENTS: (id: string) => `/calls/${id}/attachments`,
    CATEGORIES: '/calls/categories',
    STATS: '/calls/stats',
    EXPORT: '/calls/export',
    COMPLETE: (id: string) => `/calls/${id}/complete`,
    FEEDBACK: (id: string) => `/calls/${id}/feedback`
  },

  // Dashboard and statistics endpoints
  DASHBOARD: {
    STATS: '/dashboard/stats',
    RECENT_CALLS: '/dashboard/recent-calls',
    CHARTS: '/dashboard/charts',
    TOP_PERFORMERS: '/dashboard/top-performers',
    CALLS_BY_STATUS: '/dashboard/calls-by-status',
    CALLS_BY_PRIORITY: '/dashboard/calls-by-priority',
    CALLS_BY_CATEGORY: '/dashboard/calls-by-category',
    TECHNICIAN_PERFORMANCE: '/dashboard/technician-performance',
    MONTHLY_TRENDS: '/dashboard/monthly-trends',
    DAILY_ACTIVITY: '/dashboard/daily-activity',
    SYSTEM_HEALTH: '/dashboard/system-health',
    USER_ACTIVITY: '/dashboard/user-activity',
    WORKLOAD_DISTRIBUTION: '/dashboard/workload-distribution',
    CUSTOMER_SATISFACTION: '/dashboard/customer-satisfaction',
    SLA_COMPLIANCE: '/dashboard/sla-compliance',
    ALERTS: '/dashboard/alerts',
    MARK_ALERT_READ: (id: string) => `/dashboard/alerts/${id}/read`,
    REAL_TIME_METRICS: '/dashboard/real-time-metrics',
    EXPORT: '/dashboard/export',
    WIDGETS_CONFIG: '/dashboard/widgets-config'
  },

  // Notifications endpoints
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/mark-all-read',
    DELETE: (id: string) => `/notifications/${id}`,
    UNREAD_COUNT: '/notifications/unread-count'
  },

  // Administration endpoints
  ADMIN: {
    SYSTEM_HEALTH: '/admin/system-health',
    BACKUP: '/admin/backup',
    LOGS: '/admin/logs',
    SETTINGS: '/admin/settings',
    ACTIVITIES: '/admin/activities'
  },

  // Files endpoints
  FILES: {
    UPLOAD: '/files/upload',
    DOWNLOAD: (id: string) => `/files/${id}`,
    DELETE: (id: string) => `/files/${id}`
  },

  // Settings endpoints
  SETTINGS: {
    GET: '/settings',
    UPDATE: '/settings',
    INTEGRATIONS: '/settings/integrations',
    RESET: '/settings/reset'
  },

  // Reports endpoints
  REPORTS: {
    LIST: '/reports',
    GENERATE: '/reports/generate',
    GET: (id: string) => `/reports/${id}`,
    DELETE: (id: string) => `/reports/${id}`,
    DOWNLOAD: (id: string) => `/reports/${id}/download`,
    TEMPLATES: '/reports/templates'
  },

  // Feedback endpoints
  FEEDBACK: {
    STATS: '/feedback/stats',
    TECHNICIAN_STATS_ALL: '/feedback/technician-stats',
    TECHNICIAN_STATS: (technicianId: string) => `/feedback/technician-stats/${technicianId}`,
    LIST: '/feedback'
  }
}

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
} as const

// Request headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

// Error types
export interface ApiError {
  message: string
  code?: string
  status?: number
  details?: any
}

// Pagination parameters
export interface PaginationParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}

// Filter parameters for calls
export interface CallFilters {
  status?: string
  priority?: string
  category?: string
  workUnit?: string
  assignedTo?: string
  dateFrom?: string
  dateTo?: string
  search?: string
}

// Filter parameters for users
export interface UserFilters {
  role?: string
  status?: string
  workUnit?: string
  search?: string
}

// Request timeout configuration
export const REQUEST_TIMEOUT = 30000 // 30 seconds

// Retry configuration
export const RETRY_CONFIG = {
  attempts: 3,
  delay: 1000, // 1 second
  backoff: 2 // exponential backoff multiplier
}

// WebSocket configuration (for real-time updates)
export const WEBSOCKET_CONFIG = {
  url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws',
  reconnectInterval: 5000, // 5 seconds
  maxReconnectAttempts: 10
}

// File upload configuration
export const FILE_UPLOAD_CONFIG = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
}

// Cache configuration
export const CACHE_CONFIG = {
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  userTTL: 15 * 60 * 1000, // 15 minutes
  dashboardTTL: 2 * 60 * 1000 // 2 minutes
}

// Environment-specific configurations
export const ENV_CONFIG = {
  development: {
    apiUrl: 'http://localhost:8080/api/v1',
    wsUrl: 'ws://localhost:8080/ws',
    debug: true
  },
  production: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.support-system.com/api/v1',
    wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'wss://api.support-system.com/ws',
    debug: false
  }
}

// Get current environment configuration
export const getCurrentConfig = () => {
  const env = process.env.NODE_ENV || 'development'
  return ENV_CONFIG[env as keyof typeof ENV_CONFIG] || ENV_CONFIG.development
}