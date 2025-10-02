// Centralized error handling utilities

import { ApiError } from '@/types/api'

// Error types enum
export enum ErrorType {
  NETWORK = 'NETWORK_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  SERVER = 'SERVER_ERROR',
  TIMEOUT = 'TIMEOUT_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR'
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Enhanced error class
export class AppError extends Error {
  public readonly type: ErrorType
  public readonly severity: ErrorSeverity
  public readonly timestamp: string
  public readonly context?: Record<string, any>
  public readonly originalError?: any

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context?: Record<string, any>,
    originalError?: any
  ) {
    super(message)
    this.name = 'AppError'
    this.type = type
    this.severity = severity
    this.timestamp = new Date().toISOString()
    this.context = context
    this.originalError = originalError
  }
}

// Error handler utility class
export class ErrorHandler {
  /**
   * Format error message from various error types
   */
  static formatErrorMessage(error: any): string {
    if (error instanceof AppError) {
      return error.message
    }
    
    if (error instanceof Error) {
      return error.message
    }
    
    if (typeof error === 'string') {
      return error
    }
    
    if (error?.message) {
      return error.message
    }
    
    if (error?.error) {
      return error.error
    }
    
    return 'An unexpected error occurred'
  }

  /**
   * Determine error type from error object
   */
  static determineErrorType(error: any): ErrorType {
    if (error?.code) {
      switch (error.code) {
        case 'NETWORK_ERROR':
        case 'ERR_NETWORK':
          return ErrorType.NETWORK
        case 'VALIDATION_ERROR':
          return ErrorType.VALIDATION
        case 'AUTHENTICATION_ERROR':
        case 'UNAUTHORIZED':
          return ErrorType.AUTHENTICATION
        case 'AUTHORIZATION_ERROR':
        case 'FORBIDDEN':
          return ErrorType.AUTHORIZATION
        case 'NOT_FOUND':
          return ErrorType.NOT_FOUND
        case 'TIMEOUT_ERROR':
          return ErrorType.TIMEOUT
        default:
          return ErrorType.UNKNOWN
      }
    }

    if (error?.status) {
      if (error.status === 401) return ErrorType.AUTHENTICATION
      if (error.status === 403) return ErrorType.AUTHORIZATION
      if (error.status === 404) return ErrorType.NOT_FOUND
      if (error.status === 422) return ErrorType.VALIDATION
      if (error.status >= 500) return ErrorType.SERVER
    }

    if (error?.name === 'AbortError' || error?.name === 'TimeoutError') {
      return ErrorType.TIMEOUT
    }

    if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
      return ErrorType.NETWORK
    }

    return ErrorType.UNKNOWN
  }

  /**
   * Determine error severity
   */
  static determineErrorSeverity(error: any): ErrorSeverity {
    const errorType = this.determineErrorType(error)
    
    switch (errorType) {
      case ErrorType.AUTHENTICATION:
      case ErrorType.AUTHORIZATION:
      case ErrorType.SERVER:
        return ErrorSeverity.HIGH
      case ErrorType.VALIDATION:
      case ErrorType.NOT_FOUND:
        return ErrorSeverity.MEDIUM
      case ErrorType.NETWORK:
      case ErrorType.TIMEOUT:
        return ErrorSeverity.LOW
      default:
        return ErrorSeverity.MEDIUM
    }
  }

  /**
   * Create standardized AppError from any error
   */
  static createAppError(
    error: any,
    context?: Record<string, any>
  ): AppError {
    const message = this.formatErrorMessage(error)
    const type = this.determineErrorType(error)
    const severity = this.determineErrorSeverity(error)
    
    return new AppError(message, type, severity, context, error)
  }

  /**
   * Handle API errors consistently
   */
  static handleApiError(
    error: any,
    context?: Record<string, any>
  ): never {
    const appError = this.createAppError(error, context)
    
    // Log error for debugging (in development)
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        message: appError.message,
        type: appError.type,
        severity: appError.severity,
        context: appError.context,
        originalError: appError.originalError
      })
    }
    
    throw appError
  }

  /**
   * Extract validation errors from API response
   */
  static extractValidationErrors(error: any): Record<string, string[]> {
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

  /**
   * Check if error is retryable
   */
  static isRetryableError(error: any): boolean {
    const errorType = this.determineErrorType(error)
    
    return [
      ErrorType.NETWORK,
      ErrorType.TIMEOUT,
      ErrorType.SERVER
    ].includes(errorType)
  }

  /**
   * Get user-friendly error message
   */
  static getUserFriendlyMessage(error: any): string {
    const errorType = this.determineErrorType(error)
    
    switch (errorType) {
      case ErrorType.NETWORK:
        return 'Problema de conexão. Verifique sua internet e tente novamente.'
      case ErrorType.TIMEOUT:
        return 'A operação demorou muito para responder. Tente novamente.'
      case ErrorType.AUTHENTICATION:
        return 'Sessão expirada. Faça login novamente.'
      case ErrorType.AUTHORIZATION:
        return 'Você não tem permissão para realizar esta ação.'
      case ErrorType.NOT_FOUND:
        return 'O recurso solicitado não foi encontrado.'
      case ErrorType.VALIDATION:
        return 'Dados inválidos. Verifique as informações e tente novamente.'
      case ErrorType.SERVER:
        return 'Erro interno do servidor. Tente novamente em alguns minutos.'
      default:
        return this.formatErrorMessage(error)
    }
  }
}

// Export convenience functions
export const formatErrorMessage = ErrorHandler.formatErrorMessage
export const handleApiError = ErrorHandler.handleApiError
export const createAppError = ErrorHandler.createAppError
export const getUserFriendlyMessage = ErrorHandler.getUserFriendlyMessage
export const isRetryableError = ErrorHandler.isRetryableError
export const extractValidationErrors = ErrorHandler.extractValidationErrors