// API Client configuration and base HTTP client

import { ApiResponse, ApiError } from '@/types/api'
import { API_BASE_URL, REQUEST_TIMEOUT, RETRY_CONFIG, API_ENDPOINTS, GO_API_ENDPOINTS, GO_API_BASE_URL } from './api-config'

// API Configuration
const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  retryAttempts: RETRY_CONFIG.attempts,
  retryDelay: RETRY_CONFIG.delay,
}

// Token management with memory cache for performance
class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'access_token'
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token'
  private static readonly TOKEN_EXPIRY_KEY = 'token_expiry'
  
  // Memory cache to avoid localStorage access
  private static cache: {
    accessToken: string | null
    refreshToken: string | null
    expiryTime: number | null
    lastCheck: number
  } = {
    accessToken: null,
    refreshToken: null,
    expiryTime: null,
    lastCheck: 0
  }

  private static updateCache(): void {
    if (typeof window === 'undefined') return
    
    const now = Date.now()
    // Only update cache if it's been more than 1 second since last check
    if (now - this.cache.lastCheck < 1000) return
    
    this.cache.accessToken = localStorage.getItem(this.ACCESS_TOKEN_KEY)
    this.cache.refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY)
    const expiryStr = localStorage.getItem(this.TOKEN_EXPIRY_KEY)
    this.cache.expiryTime = expiryStr ? parseInt(expiryStr) : null
    this.cache.lastCheck = now
  }

  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null
    this.updateCache()
    return this.cache.accessToken
  }

  static setAccessToken(token: string, expiresIn: number): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token)
    const expiryTime = Date.now() + (expiresIn * 1000)
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString())
    
    // Update cache immediately
    this.cache.accessToken = token
    this.cache.expiryTime = expiryTime
    this.cache.lastCheck = Date.now()
  }

  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null
    this.updateCache()
    return this.cache.refreshToken
  }

  static setRefreshToken(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token)
    
    // Update cache immediately
    this.cache.refreshToken = token
    this.cache.lastCheck = Date.now()
  }

  static clearTokens(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.ACCESS_TOKEN_KEY)
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY)
    
    // Clear cache immediately
    this.cache.accessToken = null
    this.cache.refreshToken = null
    this.cache.expiryTime = null
    this.cache.lastCheck = Date.now()
  }

  static isTokenExpired(): boolean {
    if (typeof window === 'undefined') return true
    this.updateCache()
    if (!this.cache.expiryTime) return true
    return Date.now() > this.cache.expiryTime
  }
}

// HTTP Client class
class HttpClient {
  private baseURL: string
  private timeout: number
  private retryAttempts: number
  private retryDelay: number

  constructor(config: typeof API_CONFIG) {
    this.baseURL = config.baseURL
    this.timeout = config.timeout
    this.retryAttempts = config.retryAttempts
    this.retryDelay = config.retryDelay
  }

  protected async makeRequest<T>(
    url: string,
    options: RequestInit = {},
    attempt: number = 1
  ): Promise<ApiResponse<T>> {
    const fullUrl = `${this.baseURL}${url}`
    
    // Set default headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json; charset=utf-8',
      'Accept': 'application/json; charset=utf-8',
      'Accept-Charset': 'utf-8',
      ...options.headers,
    }

    // Add authorization header if token exists
    const token = TokenManager.getAccessToken()
    if (token && !TokenManager.isTokenExpired()) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
    }

    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Handle token refresh for 401 responses
      if (response.status === 401 && attempt === 1) {
        const refreshed = await this.refreshToken()
        if (refreshed) {
          return this.makeRequest<T>(url, options, attempt + 1)
        }
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      return data as ApiResponse<T>
    } catch (error) {
      clearTimeout(timeoutId)

      // Retry logic for network errors
      if (attempt < this.retryAttempts && this.shouldRetry(error)) {
        await this.delay(this.retryDelay * attempt)
        return this.makeRequest<T>(url, options, attempt + 1)
      }

      throw this.handleError(error)
    }
  }

  private shouldRetry(error: any): boolean {
    // Retry on network errors, timeouts, and 5xx server errors
    return (
      error.name === 'AbortError' ||
      error.name === 'TypeError' ||
      (error.status >= 500 && error.status < 600)
    )
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private handleError(error: any): ApiError {
    const apiError: ApiError = {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      timestamp: new Date().toISOString(),
    }

    if (error.details) {
      apiError.details = error.details
    }

    return apiError
  }

  private async refreshToken(): Promise<boolean> {
    const refreshToken = TokenManager.getRefreshToken()
    if (!refreshToken) {
      TokenManager.clearTokens()
      return false
    }

    try {
      // Usar o endpoint correto do GO_API_ENDPOINTS
      const response = await fetch(`${this.baseURL}${GO_API_ENDPOINTS.AUTH.REFRESH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })

      if (!response.ok) {
        TokenManager.clearTokens()
        return false
      }

      const data = await response.json()
      
      // O backend agora retorna access_token e refresh_token diretamente
      if (!data.access_token) {
        TokenManager.clearTokens()
        return false;
      }

      TokenManager.setAccessToken(data.access_token, 24 * 60 * 60) // 24h
      if (data.refresh_token) {
        TokenManager.setRefreshToken(data.refresh_token)
      }
      return true
    } catch (error) {
      TokenManager.clearTokens()
      return false
    }
  }

  // HTTP Methods
  async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const searchParams = params ? new URLSearchParams(params).toString() : ''
    const fullUrl = searchParams ? `${url}?${searchParams}` : url
    return this.makeRequest<T>(fullUrl, { method: 'GET' })
  }

  async post<T>(url: string, data?: any, p0?: { headers: { 'Content-Type': string } }): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { method: 'DELETE' })
  }

  // File upload method
  async upload<T>(url: string, formData: FormData): Promise<ApiResponse<T>> {
    const token = TokenManager.getAccessToken()
    const headers: HeadersInit = {}
    
    if (token && !TokenManager.isTokenExpired()) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return this.makeRequest<T>(url, {
      method: 'POST',
      body: formData,
      headers,
    })
  }
}

// Create and export the// Create API client instances
export const apiClient = new HttpClient(API_CONFIG)

// Go Backend API Configuration
const GO_API_CONFIG = {
  baseURL: GO_API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  retryAttempts: RETRY_CONFIG.attempts,
  retryDelay: RETRY_CONFIG.delay,
}

// Create Go API client instance with UTF-8 support
export const goApiClient = new HttpClient(GO_API_CONFIG)

// Export token manager for use in auth context
export { TokenManager }

// Utility functions for API responses
export const handleApiResponse = <T>(response: ApiResponse<T>): T => {
  if (!response.success) {
    throw new Error(response.error || response.message || 'API request failed')
  }
  return response.data as T
}

// Utility function for Go API responses (returns data directly)
export const handleGoApiResponse = <T>(response: ApiResponse<T>): T => {
  // O backend Go retorna os dados diretamente, mas o goApiClient ainda retorna ApiResponse
  // Extrair os dados da estrutura ApiResponse
  if (response && typeof response === 'object' && 'data' in response) {
    return response.data as T;
  }
  // Se não tem estrutura ApiResponse, retorna diretamente
  return response as T;
}

export const handleApiError = (error: any): string => {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  if (error?.message) {
    return error.message
  }
  return 'An unexpected error occurred'
}

// Request interceptor type
export type RequestInterceptor = (config: RequestInit) => RequestInit | Promise<RequestInit>

// Response interceptor type
export type ResponseInterceptor = <T>(response: ApiResponse<T>) => ApiResponse<T> | Promise<ApiResponse<T>>

// API Client with interceptors (for future extensibility)
export class ApiClientWithInterceptors extends HttpClient {
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: ResponseInterceptor[] = []

  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor)
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor)
  }

  // Override makeRequest to apply interceptors
  protected async makeRequest<T>(
    url: string,
    options: RequestInit = {},
    attempt: number = 1
  ): Promise<ApiResponse<T>> {
    // Apply request interceptors
    let processedOptions = options
    for (const interceptor of this.requestInterceptors) {
      processedOptions = await interceptor(processedOptions)
    }

    let response = await super.makeRequest<T>(url, processedOptions, attempt)

    // Apply response interceptors
    for (const interceptor of this.responseInterceptors) {
      response = await interceptor(response)
    }

    return response
  }
}

// Export environment-specific configurations
export const isDevelopment = process.env.NODE_ENV === 'development'
export const isProduction = process.env.NODE_ENV === 'production'

// API endpoints are now imported from api-config.ts
export { API_ENDPOINTS }