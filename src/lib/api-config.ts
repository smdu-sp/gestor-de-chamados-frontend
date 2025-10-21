// API Configuration for Golang Backend Integration
// This file centralizes all API endpoints and configuration

// Base API URL - Update this when backend is deployed
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api/backend";

// Go Backend API URL
export const GO_API_BASE_URL =
  process.env.NEXT_PUBLIC_GO_API_URL || "http://localhost:8080";

// ===== ENDPOINTS ATIVOS (Backend Go atual) =====
export const GO_API_ENDPOINTS = {
  // Authentication endpoints (ativos no backend Go)
  AUTH: {
    LOGIN: "/login",
    REFRESH: "/refresh",
    PROFILE: "/eu",
  },

  // User management endpoints (ativos no backend Go)
  USERS: {
    LIST: "/api/users",
    CREATE: "/api/users",
    GET: (id: string) => `/api/users/${id}`,
    UPDATE: (id: string) => `/api/users/${id}`,
    DELETE: (id: string) => `/api/users/${id}`,
  },

  // Call/Ticket management endpoints (ativos no backend Go)
  CALLS: {
    LIST: "/chamados/buscar-tudo",
    CREATE: "/chamados/criar",
    GET: (id: string) => `/chamados/buscar-por-id/${id}`,
    UPDATE: (id: string) => `/chamados/atualizar/${id}`,
    DELETE: (id: string) => `/chamados/arquivar/${id}`,
    LIST_ALL: "/chamados/lista-completa",
    UPDATE_STATUS: (id: string) => `/chamados/atualizar-status/${id}`,
    ARCHIVE: (id: string) => `/chamados/arquivar/${id}`,
    UNARCHIVE: (id: string) => `/chamados/desarquivar/${id}`,
    ASSIGN_TECHNICIAN: (id: string) => `/chamados/atribuir-tecnico/${id}`,
    REMOVE_TECHNICIAN: (id: string) => `/chamados/remover-tecnico/${id}`,
  },

  // Category management endpoints (ativos no backend Go)
  CATEGORIES: {
    LIST: "/categorias/lista-completa",
    GET: (id: string) => `/categorias/buscar-por-id/${id}`,
    SUBCATEGORIES: {
      LIST: "/subcategorias/lista-completa",
      GET: (id: string) => `/subcategorias/buscar-por-id/${id}`,
    },
  },
};

// ===== ENDPOINTS FUTUROS (comentados para implementação posterior) =====
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/profile",
    CHANGE_PASSWORD: "/auth/change-password",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_VERIFICATION: "/auth/resend-verification",
    TWO_FACTOR_ENABLE: "/auth/2fa/enable",
    TWO_FACTOR_VERIFY: "/auth/2fa/verify",
    TWO_FACTOR_DISABLE: "/auth/2fa/disable",
    TWO_FACTOR_BACKUP_CODES: "/auth/2fa/backup-codes",
    SESSIONS: "/auth/sessions",
    REVOKE_SESSION: (id: string) => `/auth/sessions/${id}`,
    REVOKE_ALL_SESSIONS: "/auth/sessions/revoke-all",
  },

  // User management endpoints
  USERS: {
    LIST: "/users",
    CREATE: "/users",
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    ACTIVATE: (id: string) => `/users/${id}/activate`,
    DEACTIVATE: (id: string) => `/users/${id}/deactivate`,
    TECHNICIANS: "/users/technicians",
  },

  // Call/Ticket management endpoints
  CALLS: {
    LIST: "/calls",
    CREATE: "/calls",
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
    CATEGORIES: "/calls/categories",
    STATS: "/calls/stats",
    EXPORT: "/calls/export",
    COMPLETE: (id: string) => `/calls/${id}/complete`,
    FEEDBACK: (id: string) => `/calls/${id}/feedback`,
  },

  // Dashboard and statistics endpoints
  DASHBOARD: {
    STATS: "/dashboard/stats",
    RECENT_CALLS: "/dashboard/recent-calls",
    CHARTS: "/dashboard/charts",
    TOP_PERFORMERS: "/dashboard/top-performers",
    CALLS_BY_STATUS: "/dashboard/calls-by-status",
    CALLS_BY_PRIORITY: "/dashboard/calls-by-priority",
    CALLS_BY_CATEGORY: "/dashboard/calls-by-category",
    TECHNICIAN_PERFORMANCE: "/dashboard/technician-performance",
    MONTHLY_TRENDS: "/dashboard/monthly-trends",
    DAILY_ACTIVITY: "/dashboard/daily-activity",
    SYSTEM_HEALTH: "/dashboard/system-health",
    USER_ACTIVITY: "/dashboard/user-activity",
    WORKLOAD_DISTRIBUTION: "/dashboard/workload-distribution",
    CUSTOMER_SATISFACTION: "/dashboard/customer-satisfaction",
    SLA_COMPLIANCE: "/dashboard/sla-compliance",
    ALERTS: "/dashboard/alerts",
    MARK_ALERT_READ: (id: string) => `/dashboard/alerts/${id}/read`,
    REAL_TIME_METRICS: "/dashboard/real-time-metrics",
    EXPORT: "/dashboard/export",
    WIDGETS_CONFIG: "/dashboard/widgets-config",
  },

  // Notifications endpoints
  NOTIFICATIONS: {
    LIST: "/notifications",
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: "/notifications/mark-all-read",
    DELETE: (id: string) => `/notifications/${id}`,
    UNREAD_COUNT: "/notifications/unread-count",
  },

  // Administration endpoints
  ADMIN: {
    SYSTEM_HEALTH: "/admin/system-health",
    BACKUP: "/admin/backup",
    LOGS: "/admin/logs",
    SETTINGS: "/admin/settings",
  },
};

// Request configuration
export const REQUEST_TIMEOUT = 30000; // 30 seconds
export const RETRY_CONFIG = {
  attempts: 3,
  delay: 1000,
};
