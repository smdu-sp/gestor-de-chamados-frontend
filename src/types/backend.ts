// Types for Golang Backend Integration
// These types match the expected API responses from the Go backend

import { UserRole } from "./auth";

// Base response structure from Go backend
export interface GoApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  /* errors?: Record<string, string[]>
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
    hasNext?: boolean
    hasPrev?: boolean */
}

// Authentication types - Ajustados para o backend Go
export interface LoginRequest {
  login: string; // Mudança: era 'email', agora é 'login'
  password: string;
}

export interface LoginResponse {
  token: string; // Token JWT
  refreshToken: string; // Refresh token
  user: BackendUser; // Dados do usuário
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

// User types for backend - Ajustados para o backend Go
export interface BackendUser {
  id: string;
  nome: string; // Campo 'nome' do backend Go
  login: string; // Campo 'login' do backend Go
  email: string;
  permissao: string; // Campo 'permissao' do backend Go (USR, ADM, SUP, DEV)
  /* role: UserRole
  workUnit: string
  status: 'active' | 'inactive' | 'suspended'
  avatar?: string
  lastLogin?: string
  createdAt: string
  updatedAt: string */
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  workUnit: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: UserRole;
  workUnit?: string;
  status?: "active" | "inactive" | "suspended";
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Call/Ticket types for backend
export interface BackendCall {
  id: string;
  protocol: string;
  caller: string;
  email: string;
  phone: string;
  workUnit: string;
  issue: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status:
    | "open"
    | "in_progress"
    | "pending"
    | "resolved"
    | "closed"
    | "cancelled";
  category: string;
  assignedTo?: string;
  assignedToId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
  estimatedResolution?: string;
  actualResolution?: string;
  tags?: string[];
}

export interface CreateCallRequest {
  caller: string;
  email: string;
  phone: string;
  workUnit: string;
  issue: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  tags?: string[];
}

export interface UpdateCallRequest {
  issue?: string;
  description?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  status?:
    | "open"
    | "in_progress"
    | "pending"
    | "resolved"
    | "closed"
    | "cancelled";
  category?: string;
  assignedToId?: string;
  estimatedResolution?: string;
  actualResolution?: string;
  tags?: string[];
}

export interface AssignCallRequest {
  assignedToId: string;
  note?: string;
}

// Call notes/comments
export interface CallNote {
  id: string;
  callId: string;
  content: string;
  author: string;
  authorId: string;
  isInternal: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCallNoteRequest {
  content: string;
  isInternal: boolean;
}

// File attachment types
export interface FileAttachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  callId?: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface UploadFileRequest {
  file: File;
  callId?: string;
  description?: string;
}

// Dashboard statistics
export interface DashboardStats {
  totalCalls: number;
  openCalls: number;
  inProgressCalls: number;
  pendingCalls: number;
  resolvedCalls: number;
  closedCalls: number;
  averageResolutionTime: number; // in minutes
  customerSatisfactionScore: number;
  callsCreatedToday: number;
  callsResolvedToday: number;
  overdueCallsCount: number;
  highPriorityCallsCount: number;
}

export interface CallsByStatus {
  status: string;
  count: number;
  percentage: number;
}

export interface CallsByPriority {
  priority: string;
  count: number;
  percentage: number;
}

export interface CallsByCategory {
  category: string;
  count: number;
  percentage: number;
}

export interface TopPerformer {
  userId: string;
  name: string;
  email: string;
  callsResolved: number;
  averageResolutionTime: number;
  customerSatisfactionScore: number;
}

export interface RecentCall {
  id: string;
  protocol: string;
  caller: string;
  issue: string;
  priority: "low" | "medium" | "high" | "urgent";
  status:
    | "open"
    | "in_progress"
    | "pending"
    | "resolved"
    | "closed"
    | "cancelled";
  assignedTo?: string;
  createdAt: string;
  workUnit: string;
}

// Notification types
export interface BackendNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
  userId: string;
  relatedEntityType?: "call" | "user" | "system";
  relatedEntityId?: string;
  createdAt: string;
  readAt?: string;
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  userIds?: string[];
  relatedEntityType?: "call" | "user" | "system";
  relatedEntityId?: string;
}

// System administration types
export interface SystemHealth {
  status: "healthy" | "warning" | "critical";
  uptime: number; // in seconds
  memoryUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  diskUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  databaseStatus: "connected" | "disconnected" | "error";
  lastBackup?: string;
  activeConnections: number;
}

export interface SystemSettings {
  id: string;
  key: string;
  value: string;
  description?: string;
  category: string;
  isPublic: boolean;
  updatedBy: string;
  updatedAt: string;
}

export interface UpdateSystemSettingRequest {
  value: string;
}

export interface SystemActivity {
  id: string;
  action: string;
  details: string;
  entityType: "user" | "call" | "system" | "setting";
  entityId?: string;
  userId: string;
  userName: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// Report types
export interface ReportRequest {
  type: "calls" | "users" | "performance" | "satisfaction";
  dateFrom: string;
  dateTo: string;
  filters?: {
    workUnits?: string[];
    categories?: string[];
    priorities?: string[];
    statuses?: string[];
    assignedTo?: string[];
  };
  format: "pdf" | "excel" | "csv";
}

export interface ReportResponse {
  id: string;
  type: string;
  status: "generating" | "completed" | "failed";
  downloadUrl?: string;
  createdAt: string;
  expiresAt: string;
}

// Pagination and filtering
export interface PaginationRequest {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface CallFilters {
  status?: string[];
  priority?: string[];
  category?: string[];
  workUnit?: string[];
  assignedTo?: string[];
  createdBy?: string[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface UserFilters {
  role?: UserRole[];
  status?: ("active" | "inactive" | "suspended")[];
  workUnit?: string[];
  search?: string;
}

// WebSocket message types
export interface WebSocketMessage {
  type:
    | "call_created"
    | "call_updated"
    | "call_assigned"
    | "notification"
    | "user_status";
  data: any;
  timestamp: string;
}

export interface CallWebSocketUpdate {
  callId: string;
  changes: Partial<BackendCall>;
  updatedBy: string;
}

export interface NotificationWebSocketMessage {
  notification: BackendNotification;
}

export interface UserStatusWebSocketMessage {
  userId: string;
  status: "online" | "offline" | "away";
  lastSeen?: string;
}
