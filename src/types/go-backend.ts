import { CategoriasService } from "@/services/categorias.service";

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
  auth_type?: 'local' | 'ldap'  // Tipo de autenticação opcional
}

export interface GoLoginResponse {
  access_token: string     // Token JWT do backend Go
  refresh_token: string    // Refresh token do backend Go
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

// Formato antigo (não usado mais)
export interface GoCreateCallRequestOld {
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

// Formato correto que o backend Go espera
export interface GoCreateCallRequest {
  titulo: string
  descricao: string
  categoriaId: string
  subcategoriaId: string
  criadorId: string
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

// Cache de categorias e subcategorias
let categoriesCache: Map<string, string> = new Map();
let subcategoriesCache: Map<string, string> = new Map();
let cacheInitialized = false;

// Função para inicializar o cache de categorias
async function initializeCategoriesCache(): Promise<void> {
  if (cacheInitialized) return;
  
  try {
    // Buscar todas as categorias
    const categorias = await CategoriasService.getCategorias();
    categorias.forEach(categoria => {
      categoriesCache.set(categoria.id, categoria.nome);
    });

    // Buscar todas as subcategorias
    const subcategorias = await CategoriasService.getSubcategorias();
    subcategorias.forEach(subcategoria => {
      subcategoriesCache.set(subcategoria.id, subcategoria.nome);
    });

    cacheInitialized = true;
  } catch (error) {
    // Silently handle errors
  }
}

// Função para converter chamado do Go para o formato do frontend
export async function mapGoCallToFrontend(goCall: any): Promise<any> {
  // Inicializar cache se necessário
  await initializeCategoriesCache();
  
  // Buscar nomes das categorias no cache local
  let categoryName = "Não categorizado";
  
  if (goCall.subcategoriaId) {
    let cachedName = subcategoriesCache.get(goCall.subcategoriaId);
    if (cachedName) {
      categoryName = cachedName;
    } else {
      // Tentar buscar a subcategoria diretamente do backend
      try {
        const subcategoria = await CategoriasService.getSubcategoria(goCall.subcategoriaId);
        if (subcategoria && subcategoria.nome) {
          categoryName = subcategoria.nome;
          // Atualizar o cache
          subcategoriesCache.set(goCall.subcategoriaId, subcategoria.nome);
        } else {
          categoryName = "Subcategoria não encontrada";
        }
      } catch (error) {
        categoryName = "Subcategoria não encontrada";
      }
    }
  } else if (goCall.categoriaId) {
    let cachedName = categoriesCache.get(goCall.categoriaId);
    if (cachedName) {
      categoryName = cachedName;
    } else {
      // Tentar buscar a categoria diretamente do backend
      try {
        const categoria = await CategoriasService.getCategoria(goCall.categoriaId);
        if (categoria && categoria.nome) {
          categoryName = categoria.nome;
          // Atualizar o cache
          categoriesCache.set(goCall.categoriaId, categoria.nome);
        } else {
          categoryName = "Categoria não encontrada";
        }
      } catch (error) {
        categoryName = "Categoria não encontrada";
      }
    }
  }
  
  // Mapear campos do backend Go (português) para o frontend (inglês)
  const frontendCall = {
    id: goCall.id, // Manter como string UUID do backend Go
    title: goCall.titulo || goCall.issue || goCall.title,
    description: goCall.descricao || goCall.description,
    category: categoryName,
    priority: "medium", // Valor padrão já que não há prioridade nos dados do backend
    status: goCall.status,
    workUnit: goCall.unidade_trabalho || goCall.workUnit,
    protocol: goCall.protocolo || goCall.protocol,
    caller: goCall.solicitante || goCall.caller,
    email: goCall.email,
    phone: goCall.telefone || goCall.phone,
    createdBy: {
      id: goCall.criado_por || goCall.createdBy, // Manter UUID como string
      name: goCall.solicitante || goCall.caller || '',
      email: goCall.email || ''
    },
    assignedTo: (goCall.atribuido_para_id || goCall.assignedToId) ? {
      id: goCall.atribuido_para_id || goCall.assignedToId, // Manter UUID como string
      name: goCall.atribuido_para || goCall.assignedTo || '',
      email: ''
    } : undefined,
    createdAt: goCall.criadoEm || goCall.criado_em || goCall.createdAt,
    updatedAt: goCall.atualizadoEm || goCall.atualizado_em || goCall.updatedAt,
    resolvedAt: goCall.resolvidoEm || goCall.resolvido_em || goCall.resolvedAt,
    closedAt: goCall.fechadoEm || goCall.fechado_em || goCall.closedAt,
    estimatedResolution: goCall.resolucao_estimada || goCall.estimatedResolution,
    actualResolution: goCall.resolucao_real || goCall.actualResolution,
    tags: goCall.tags || []
  };
  
  return frontendCall;
}