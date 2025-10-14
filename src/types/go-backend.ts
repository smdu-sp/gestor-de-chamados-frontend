// Types específicos para o backend Go atual
// Mantém os tipos existentes intactos em backend.ts

// Base response structure from Go backend
export interface GoApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Authentication types para o backend Go
export interface GoLoginRequest {
  login: string    // Campo específico do backend Go
  password: string
}

export interface GoLoginResponse {
  token: string        // Token JWT do backend Go
  refreshToken: string // Refresh token do backend Go
  user: GoUser         // Dados do usuário do backend Go
}

// User types específicos do backend Go
export interface GoUser {
  id: string
  nome: string      // Campo 'nome' do backend Go
  login: string     // Campo 'login' do backend Go
  email: string
  permissao: string // Campo 'permissao' do backend Go (USR, ADM, SUP, DEV)
}

// Call/Ticket types específicos do backend Go
export interface GoCall {
  id: string
  protocol: string
  caller: string
  email: string
  phone: string
  workUnit: string
  issue: string
  description: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "open" | "in_progress" | "pending" | "resolved" | "closed" | "cancelled"
  category: string
  assignedTo?: string
  assignedToId?: string
  createdBy: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  closedAt?: string
  estimatedResolution?: string
  actualResolution?: string
  tags?: string[]
}

export interface GoCreateCallRequest {
  caller: string
  email: string
  phone: string
  workUnit: string
  issue: string
  description: string
  priority: "low" | "medium" | "high" | "urgent"
  category: string
  tags?: string[]
}

export interface GoUpdateCallRequest {
  issue?: string
  description?: string
  priority?: "low" | "medium" | "high" | "urgent"
  status?: "open" | "in_progress" | "pending" | "resolved" | "closed" | "cancelled"
  category?: string
  assignedToId?: string
  estimatedResolution?: string
  actualResolution?: string
  tags?: string[]
}

export interface GoCallFilters {
  status?: string[]
  priority?: string[]
  category?: string[]
  workUnit?: string[]
  assignedTo?: string[]
  createdBy?: string[]
  dateFrom?: string
  dateTo?: string
  search?: string
}

// Mapeamento de permissões do Go para o frontend
export const GO_PERMISSION_MAP = {
  'USR': 'user',
  'ADM': 'admin', 
  'SUP': 'support',
  'DEV': 'developer'
} as const

// Função para converter usuário do Go para o formato do frontend
export function mapGoUserToFrontend(goUser: GoUser): any {
  return {
    id: goUser.id,
    name: goUser.nome,
    login: goUser.login,
    email: goUser.email,
    role: GO_PERMISSION_MAP[goUser.permissao as keyof typeof GO_PERMISSION_MAP] || 'user',
    workUnit: '', // TODO: Adicionar quando o backend Go implementar
    status: 'active', // TODO: Adicionar quando o backend Go implementar
    avatar: '', // TODO: Adicionar quando o backend Go implementar
    createdAt: new Date().toISOString(), // TODO: Adicionar quando o backend Go implementar
    updatedAt: new Date().toISOString(), // TODO: Adicionar quando o backend Go implementar
    lastLogin: null // TODO: Adicionar quando o backend Go implementar
  }
}

// Função para converter chamado do Go para o formato do frontend
export function mapGoCallToFrontend(goCall: GoCall): any {
  return {
    id: parseInt(goCall.id),
    title: goCall.issue,
    description: goCall.description,
    category: goCall.category,
    priority: goCall.priority,
    status: goCall.status,
    workUnit: goCall.workUnit,
    protocol: goCall.protocol,
    caller: goCall.caller,
    email: goCall.email,
    phone: goCall.phone,
    createdBy: {
      id: parseInt(goCall.createdBy),
      name: goCall.caller,
      email: goCall.email
    },
    assignedTo: goCall.assignedToId ? {
      id: parseInt(goCall.assignedToId),
      name: goCall.assignedTo || '',
      email: ''
    } : undefined,
    createdAt: goCall.createdAt,
    updatedAt: goCall.updatedAt,
    resolvedAt: goCall.resolvedAt,
    closedAt: goCall.closedAt,
    estimatedResolution: goCall.estimatedResolution,
    actualResolution: goCall.actualResolution,
    tags: goCall.tags || []
  }
}