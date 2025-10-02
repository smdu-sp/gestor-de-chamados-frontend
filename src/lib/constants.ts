// Application constants and configuration

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const

// Authentication
export const AUTH_CONFIG = {
  TOKEN_KEY: 'access_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000, // 5 minutes in milliseconds
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes in milliseconds
} as const

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  TECHNICIAN: 'TECHNICIAN',
  USER: 'USER',
  DEVELOPER: 'DEVELOPER',
} as const

// Call Status
export const CALL_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  PENDING: 'PENDING',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
  CANCELLED: 'CANCELLED',
} as const

// Call Priority
export const CALL_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
  CRITICAL: 'CRITICAL',
} as const

// Call Categories
export const CALL_CATEGORIES = {
  HARDWARE: 'HARDWARE',
  SOFTWARE: 'SOFTWARE',
  NETWORK: 'NETWORK',
  SECURITY: 'SECURITY',
  ACCESS: 'ACCESS',
  EMAIL: 'EMAIL',
  PRINTER: 'PRINTER',
  PHONE: 'PHONE',
  OTHER: 'OTHER',
} as const

// Work Units
export const WORK_UNITS = {
  IT_SUPPORT: 'IT_SUPPORT',
  NETWORK_ADMIN: 'NETWORK_ADMIN',
  SECURITY: 'SECURITY',
  DEVELOPMENT: 'DEVELOPMENT',
  HELPDESK: 'HELPDESK',
} as const

// Notification Types
export const NOTIFICATION_TYPES = {
  CALL_ASSIGNED: 'CALL_ASSIGNED',
  CALL_UPDATED: 'CALL_UPDATED',
  CALL_RESOLVED: 'CALL_RESOLVED',
  CALL_OVERDUE: 'CALL_OVERDUE',
  SYSTEM_ALERT: 'SYSTEM_ALERT',
  USER_MENTION: 'USER_MENTION',
  COMMENT_ADDED: 'COMMENT_ADDED',
  STATUS_CHANGED: 'STATUS_CHANGED',
} as const

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'application/x-rar-compressed',
  ],
  ALLOWED_EXTENSIONS: [
    '.jpg', '.jpeg', '.png', '.gif', '.webp',
    '.pdf', '.txt', '.doc', '.docx', '.xls', '.xlsx',
    '.zip', '.rar'
  ],
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  INPUT: 'yyyy-MM-dd',
  INPUT_WITH_TIME: "yyyy-MM-dd'T'HH:mm",
  API: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
  RELATIVE_THRESHOLD: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
} as const

// UI Constants
export const UI_CONFIG = {
  SIDEBAR_WIDTH: 280,
  SIDEBAR_COLLAPSED_WIDTH: 80,
  HEADER_HEIGHT: 64,
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1280,
} as const

// Theme
export const THEME_CONFIG = {
  DEFAULT_THEME: 'system',
  STORAGE_KEY: 'theme',
  THEMES: ['light', 'dark', 'system'],
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'theme',
  SIDEBAR_COLLAPSED: 'sidebar-collapsed',
  USER_PREFERENCES: 'user-preferences',
  RECENT_SEARCHES: 'recent-searches',
  DRAFT_CALLS: 'draft-calls',
  NOTIFICATION_SETTINGS: 'notification-settings',
} as const

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An internal server error occurred. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit.',
  INVALID_FILE_TYPE: 'File type is not supported.',
  LOGIN_FAILED: 'Invalid email or password.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  PASSWORD_TOO_WEAK: 'Password does not meet security requirements.',
  EMAIL_INVALID: 'Please enter a valid email address.',
  REQUIRED_FIELD: 'This field is required.',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  CALL_CREATED: 'Support call created successfully.',
  CALL_UPDATED: 'Support call updated successfully.',
  CALL_DELETED: 'Support call deleted successfully.',
  CALL_ASSIGNED: 'Support call assigned successfully.',
  CALL_RESOLVED: 'Support call resolved successfully.',
  USER_CREATED: 'User created successfully.',
  USER_UPDATED: 'User updated successfully.',
  USER_DELETED: 'User deleted successfully.',
  PASSWORD_CHANGED: 'Password changed successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  SETTINGS_SAVED: 'Settings saved successfully.',
  FILE_UPLOADED: 'File uploaded successfully.',
  COMMENT_ADDED: 'Comment added successfully.',
  LOGIN_SUCCESS: 'Logged in successfully.',
  LOGOUT_SUCCESS: 'Logged out successfully.',
} as const

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true,
  },
  EMAIL: {
    MAX_LENGTH: 254,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z\s'-]+$/,
  },
  PHONE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 15,
    PATTERN: /^[\+]?[1-9][\d]{0,15}$/,
  },
  CALL_TITLE: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 200,
  },
  CALL_DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 5000,
  },
  COMMENT: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 2000,
  },
} as const

// SLA (Service Level Agreement) Configuration
export const SLA_CONFIG = {
  RESPONSE_TIME: {
    [CALL_PRIORITY.CRITICAL]: 15, // 15 minutes
    [CALL_PRIORITY.URGENT]: 30, // 30 minutes
    [CALL_PRIORITY.HIGH]: 60, // 1 hour
    [CALL_PRIORITY.MEDIUM]: 240, // 4 hours
    [CALL_PRIORITY.LOW]: 480, // 8 hours
  },
  RESOLUTION_TIME: {
    [CALL_PRIORITY.CRITICAL]: 240, // 4 hours
    [CALL_PRIORITY.URGENT]: 480, // 8 hours
    [CALL_PRIORITY.HIGH]: 1440, // 24 hours
    [CALL_PRIORITY.MEDIUM]: 2880, // 48 hours
    [CALL_PRIORITY.LOW]: 7200, // 5 days
  },
} as const

// Dashboard Refresh Intervals (in milliseconds)
export const REFRESH_INTERVALS = {
  DASHBOARD: 30000, // 30 seconds
  NOTIFICATIONS: 60000, // 1 minute
  CALLS_LIST: 120000, // 2 minutes
  REAL_TIME_METRICS: 10000, // 10 seconds
  SYSTEM_STATUS: 300000, // 5 minutes
} as const

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#64748b',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#06b6d4',
  LIGHT: '#f8fafc',
  DARK: '#1e293b',
  GRADIENT: [
    '#3b82f6',
    '#8b5cf6',
    '#06b6d4',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#ec4899',
    '#84cc16',
  ],
} as const

// Status Colors
export const STATUS_COLORS = {
  [CALL_STATUS.OPEN]: '#3b82f6', // Blue
  [CALL_STATUS.IN_PROGRESS]: '#f59e0b', // Yellow
  [CALL_STATUS.PENDING]: '#8b5cf6', // Purple
  [CALL_STATUS.RESOLVED]: '#10b981', // Green
  [CALL_STATUS.CLOSED]: '#64748b', // Gray
  [CALL_STATUS.CANCELLED]: '#ef4444', // Red
} as const

// Priority Colors
export const PRIORITY_COLORS = {
  [CALL_PRIORITY.LOW]: '#64748b', // Gray
  [CALL_PRIORITY.MEDIUM]: '#3b82f6', // Blue
  [CALL_PRIORITY.HIGH]: '#f59e0b', // Yellow
  [CALL_PRIORITY.URGENT]: '#f97316', // Orange
  [CALL_PRIORITY.CRITICAL]: '#ef4444', // Red
} as const

// Role Colors
export const ROLE_COLORS = {
  [USER_ROLES.ADMIN]: '#ef4444', // Red
  [USER_ROLES.TECHNICIAN]: '#3b82f6', // Blue
  [USER_ROLES.USER]: '#64748b', // Gray
  [USER_ROLES.DEVELOPER]: '#8b5cf6', // Purple
} as const

// Navigation Menu Items
export const NAVIGATION_ITEMS = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard',
    roles: [USER_ROLES.ADMIN, USER_ROLES.TECHNICIAN, USER_ROLES.USER, USER_ROLES.DEVELOPER],
  },
  {
    title: 'Calls',
    href: '/calls',
    icon: 'Phone',
    roles: [USER_ROLES.ADMIN, USER_ROLES.TECHNICIAN, USER_ROLES.USER, USER_ROLES.DEVELOPER],
  },
  {
    title: 'Technician Area',
    href: '/technician-area',
    icon: 'Wrench',
    roles: [USER_ROLES.ADMIN, USER_ROLES.TECHNICIAN],
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: 'BarChart3',
    roles: [USER_ROLES.ADMIN, USER_ROLES.TECHNICIAN],
  },
  {
    title: 'Administration',
    href: '/administration',
    icon: 'Settings',
    roles: [USER_ROLES.ADMIN],
    children: [
      {
        title: 'Users',
        href: '/administration/users',
        icon: 'Users',
      },
      {
        title: 'Dashboard Settings',
        href: '/administration/dashboard-settings',
        icon: 'Sliders',
      },
    ],
  },
] as const

// Quick Actions
export const QUICK_ACTIONS = {
  CREATE_CALL: {
    title: 'Create Call',
    description: 'Submit a new support request',
    icon: 'Plus',
    href: '/calls/new',
    roles: [USER_ROLES.ADMIN, USER_ROLES.TECHNICIAN, USER_ROLES.USER, USER_ROLES.DEVELOPER],
  },
  VIEW_MY_CALLS: {
    title: 'My Calls',
    description: 'View your submitted calls',
    icon: 'User',
    href: '/calls?filter=my-calls',
    roles: [USER_ROLES.USER, USER_ROLES.DEVELOPER],
  },
  ASSIGNED_CALLS: {
    title: 'Assigned Calls',
    description: 'View calls assigned to you',
    icon: 'UserCheck',
    href: '/technician-area',
    roles: [USER_ROLES.ADMIN, USER_ROLES.TECHNICIAN],
  },
  SYSTEM_STATUS: {
    title: 'System Status',
    description: 'Check system health',
    icon: 'Activity',
    href: '/administration',
    roles: [USER_ROLES.ADMIN],
  },
} as const

// Export types for better TypeScript support
export type UserRole = keyof typeof USER_ROLES
export type CallStatus = keyof typeof CALL_STATUS
export type CallPriority = keyof typeof CALL_PRIORITY
export type CallCategory = keyof typeof CALL_CATEGORIES
export type WorkUnit = keyof typeof WORK_UNITS
export type NotificationType = keyof typeof NOTIFICATION_TYPES
export type Theme = 'light' | 'dark' | 'system'

// Helper functions
export const getStatusColor = (status: CallStatus): string => {
  return STATUS_COLORS[CALL_STATUS[status]] || STATUS_COLORS[CALL_STATUS.OPEN]
}

export const getPriorityColor = (priority: CallPriority): string => {
  return PRIORITY_COLORS[CALL_PRIORITY[priority]] || PRIORITY_COLORS[CALL_PRIORITY.MEDIUM]
}

export const getRoleColor = (role: UserRole): string => {
  return ROLE_COLORS[USER_ROLES[role]] || ROLE_COLORS[USER_ROLES.USER]
}

export const getSLAResponseTime = (priority: CallPriority): number => {
  return SLA_CONFIG.RESPONSE_TIME[CALL_PRIORITY[priority]] || SLA_CONFIG.RESPONSE_TIME[CALL_PRIORITY.MEDIUM]
}

export const getSLAResolutionTime = (priority: CallPriority): number => {
  return SLA_CONFIG.RESOLUTION_TIME[CALL_PRIORITY[priority]] || SLA_CONFIG.RESOLUTION_TIME[CALL_PRIORITY.MEDIUM]
}

export const isValidFileType = (file: File): boolean => {
  return (FILE_UPLOAD.ALLOWED_TYPES as readonly string[]).includes(file.type)
}

export const isValidFileSize = (file: File): boolean => {
  return file.size <= FILE_UPLOAD.MAX_SIZE
}

export const hasRole = (userRole: UserRole, requiredRoles: UserRole[]): boolean => {
  return requiredRoles.includes(userRole)
}

export const canAccessRoute = (userRole: UserRole, routeRoles: UserRole[]): boolean => {
  return routeRoles.includes(userRole)
}

// Constantes do sistema - configurações básicas
export const SYSTEM_CONFIG = {
  APP_NAME: 'Gestor de Chamados SMUL/ATIC',
  VERSION: '1.0.0',
  COMPANY: 'SMUL/ATIC',
} as const;

// Unidades de trabalho disponíveis no sistema
export const WORK_UNITS = [
  'ATIC',
  'PHARIS', 
  'GABINETE',
  'PLANURB'
] as const;

// Categorias de chamados disponíveis
export const CALL_CATEGORIES = [
  'VOIP',
  'IMPRESSORA', 
  'MANUTENÇÃO',
  'SISTEMAS',
  'HARDWARE'
] as const;

// Prioridades dos chamados
export const CALL_PRIORITIES = [
  { value: 'low', label: 'Baixa', color: 'bg-gray-500' },
  { value: 'medium', label: 'Média', color: 'bg-yellow-500' },
  { value: 'high', label: 'Alta', color: 'bg-red-500' },
] as const;

// Status dos chamados
export const CALL_STATUSES = [
  'Nova',
  'Em atendimento', 
  'Pendente',
  'Selecionado',
  'Fechado',
  'Cancelado'
] as const;

// Roles de usuário
export const USER_ROLES = [
  'user',
  'technician',
  'admin', 
  'developer'
] as const;

// Configurações de paginação
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
  MAX_PAGE_SIZE: 100,
} as const;

// Configurações de upload de arquivos
export const FILE_UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png', 
    'image/gif',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  MAX_FILES_PER_CALL: 5,
} as const;