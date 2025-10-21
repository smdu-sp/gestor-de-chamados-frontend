import {
  goApiClient,
  apiClient,
  handleApiResponse,
  handleApiError,
  handleGoApiResponse,
} from "@/lib/api-client";
import { GO_API_ENDPOINTS } from "@/lib/api-config";

// Interfaces para os dados
export interface Categoria {
  id: string;
  nome: string;
  status: boolean;
  criado_em: string;
  atualizado_em: string;
  subcategorias?: Subcategoria[];
  permissoes?: CategoriaPermissao[];
}

export interface Subcategoria {
  id: string;
  nome: string;
  status: boolean;
  categoria_id: string;
  criado_em: string;
  atualizado_em: string;
  categoria?: Categoria;
}

export interface CategoriaPermissao {
  categoria_id: string;
  permissao: string;
  criado_em: string;
  atualizado_em: string;
}

// Interfaces para requisições
export interface CreateCategoriaRequest {
  nome: string;
  status?: boolean;
  permissoes?: string[];
}

export interface CreateSubcategoriaRequest {
  nome: string;
  categoria_id: string;
  status?: boolean;
}

export interface UpdateCategoriaRequest {
  nome?: string;
  status?: boolean;
  permissoes?: string[];
}

export interface UpdateSubcategoriaRequest {
  nome?: string;
  categoria_id?: string;
  status?: boolean;
}

export class CategoriasService {
  // Categorias
  static async getCategorias(): Promise<Categoria[]> {
    try {
      const response = await goApiClient.get<Categoria[]>(
        GO_API_ENDPOINTS.CATEGORIES.LIST
      );
      return handleGoApiResponse(response);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  static async getCategoria(id: string): Promise<Categoria> {
    try {
      const response = await goApiClient.get<Categoria>(
        GO_API_ENDPOINTS.CATEGORIES.GET(id)
      );
      return handleGoApiResponse(response);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  static async createCategoria(
    data: CreateCategoriaRequest
  ): Promise<Categoria> {
    try {
      const response = await apiClient.post<Categoria>("/categorias", data);
      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  static async updateCategoria(
    id: string,
    data: UpdateCategoriaRequest
  ): Promise<Categoria> {
    try {
      const response = await apiClient.put<Categoria>(
        `/categorias/${id}`,
        data
      );
      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  static async deleteCategoria(id: string): Promise<void> {
    try {
      const response = await apiClient.delete(`/categorias/${id}`);
      handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  // Subcategorias
  static async getSubcategorias(): Promise<Subcategoria[]> {
    try {
      const response = await goApiClient.get<Subcategoria[]>(
        GO_API_ENDPOINTS.CATEGORIES.SUBCATEGORIES.LIST
      );
      return handleGoApiResponse(response);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  static async getSubcategoriasByCategoria(
    categoriaId: string
  ): Promise<Subcategoria[]> {
    try {
      const response = await apiClient.get<Subcategoria[]>(
        `/categorias/${categoriaId}/subcategorias`
      );
      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  static async getSubcategoria(id: string): Promise<Subcategoria> {
    try {
      const response = await goApiClient.get<Subcategoria>(
        GO_API_ENDPOINTS.CATEGORIES.SUBCATEGORIES.GET(id)
      );
      return handleGoApiResponse(response);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  static async createSubcategoria(
    data: CreateSubcategoriaRequest
  ): Promise<Subcategoria> {
    try {
      const response = await apiClient.post<Subcategoria>(
        "/subcategorias",
        data
      );
      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  static async updateSubcategoria(
    id: string,
    data: UpdateSubcategoriaRequest
  ): Promise<Subcategoria> {
    try {
      const response = await apiClient.put<Subcategoria>(
        `/subcategorias/${id}`,
        data
      );
      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  static async deleteSubcategoria(id: string): Promise<void> {
    try {
      const response = await apiClient.delete(`/subcategorias/${id}`);
      handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  // Permissões
  static async getCategoriaPermissoes(
    categoriaId: string
  ): Promise<CategoriaPermissao[]> {
    try {
      const response = await apiClient.get<CategoriaPermissao[]>(
        `/categorias/${categoriaId}/permissoes`
      );
      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  static async updateCategoriaPermissoes(
    categoriaId: string,
    permissoes: string[]
  ): Promise<void> {
    try {
      const response = await apiClient.put(
        `/categorias/${categoriaId}/permissoes`,
        { permissoes }
      );
      handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
}
