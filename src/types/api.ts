// API Types for backend integration

// Base API Response structure
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  timestamp: string
}

// Pagination structure
export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Call/Ticket related types
export interface CallCreateRequest {
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  workUnit?: string
  attachments?: File[]
}

export interface CallUpdateRequest {
  title?: string
  description?: string
  category?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  status?: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed'
  assignedTo?: number
  resolution?: string
}

export interface CallResponse {
  id: number
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed'
  workUnit: string
  createdBy: {
    id: number
    name: string
    email: string
  }
  assignedTo?: {
    id: number
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  resolution?: string
  attachments: {
    id: number
    filename: string
    url: string
    size: number
    mimeType: string
  }[]
  comments: {
    id: number
    content: string
    author: {
      id: number
      name: string
      email: string
    }
    createdAt: string
  }[]
  timeSpent?: number // in minutes
}

// User related types
export interface UserCreateRequest {
  name: string
  email: string
  password: string
  role: string
  workUnit: string
}

export interface UserUpdateRequest {
  name?: string
  email?: string
  role?: string
  workUnit?: string
  status?: 'active' | 'inactive'
}

export interface UserResponse {
  id: string
  name: string
  email: string
  role: string
  workUnit: string
  status: 'active' | 'inactive' | 'suspended'
  avatar?: string
  createdAt: string
  updatedAt: string
  lastLogin?: string
}

// Authentication types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: UserResponse
  token: string
  refreshToken: string
  expiresIn: number
}

export interface RefreshTokenRequest {
  refreshToken: string
}

// Dashboard/Statistics types
export interface DashboardStats {
  totalCalls: number
  activeCalls: number
  pendingCalls: number
  resolvedCalls: number
  averageResponseTime: number // in minutes
  customerSatisfaction: number // percentage
  callsByCategory: {
    category: string
    count: number
  }[]
  callsByPriority: {
    priority: string
    count: number
  }[]
  technicianPerformance: {
    technicianId: number
    technicianName: string
    activeCalls: number
    resolvedCalls: number
    averageResolutionTime: number
    satisfaction: number
  }[]
  monthlyTrends: {
    month: string
    totalCalls: number
    resolvedCalls: number
    averageResolutionTime: number
  }[]
}

// Comment types
export interface CommentCreateRequest {
  callId: number
  content: string
  isInternal?: boolean
}

export interface CommentResponse {
  id: number
  content: string
  isInternal: boolean
  author: {
    id: number
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

// File upload types
export interface FileUploadResponse {
  id: number
  filename: string
  originalName: string
  url: string
  size: number
  mimeType: string
  uploadedAt: string
}

// Settings types
export interface SystemSettings {
  systemName: string
  systemDescription: string
  companyName: string
  supportEmail: string
  supportPhone: string
  sessionTimeout: number
  maxLoginAttempts: number
  passwordMinLength: number
  requirePasswordChange: boolean
  passwordChangeInterval: number
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  notifyOnNewCall: boolean
  notifyOnStatusChange: boolean
  notifyOnAssignment: boolean
  defaultPriority: string
  autoAssignment: boolean
  allowSelfAssignment: boolean
  maxCallsPerTechnician: number
  callTimeoutHours: number
  defaultTheme: string
  compactMode: boolean
  showAvatars: boolean
  itemsPerPage: number
  autoBackup: boolean
  backupFrequency: string
  backupRetention: number
  apiEnabled: boolean
  webhooksEnabled: boolean
  ldapEnabled: boolean
  ssoEnabled: boolean
}

// Error types
export interface ApiError {
  code: string
  message: string
  details?: any
  timestamp: string
}

// Filter and search types
export interface CallFilters {
  status?: string[]
  priority?: string[]
  category?: string[]
  assignedTo?: number[]
  createdBy?: number[]
  workUnit?: string[]
  dateFrom?: string
  dateTo?: string
  search?: string
}

export interface UserFilters {
  role?: string[]
  status?: string[]
  workUnit?: string[]
  search?: string
}

// Notification types
export interface NotificationResponse {
  id: number
  type: 'call_created' | 'call_assigned' | 'call_updated' | 'call_resolved' | 'system'
  title: string
  message: string
  isRead: boolean
  data?: any
  createdAt: string
  expiresAt?: string
}

// Webhook types
export interface WebhookEvent {
  id: string
  event: string
  data: any
  timestamp: string
  signature: string
}

// Audit log types
export interface AuditLogResponse {
  id: number
  action: string
  resource: string
  resourceId: number
  userId: number
  userName: string
  details: any
  ipAddress: string
  userAgent: string
  createdAt: string
}

// Report types
export interface ReportRequest {
  type: 'calls' | 'users' | 'performance' | 'satisfaction'
  dateFrom: string
  dateTo: string
  filters?: any
  format?: 'json' | 'csv' | 'pdf'
}

export interface ReportResponse {
  id: string
  type: string
  status: 'generating' | 'completed' | 'failed'
  downloadUrl?: string
  createdAt: string
  expiresAt: string
}

// System Notice types
export interface SystemNotice {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'maintenance'
  priority: 'low' | 'medium' | 'high'
  startDate: string
  endDate?: string
  targetRoles?: string[]
  isActive: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}