import { apiClient, TokenManager } from '@/lib/api-client'
import { handleApiError } from '@/lib/error-handler'
import { API_ENDPOINTS } from '@/lib/api-config'
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  BackendUser,
  ChangePasswordRequest,
  GoApiResponse
} from '@/types/backend'

export class AuthService {
  /**
   * Login user with email and password
   */
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<GoApiResponse<LoginResponse>>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      )
      
      if (!response.data) {
        throw new Error('Invalid response data')
      }

      const loginData = response.data.data
      if (!loginData) {
        throw new Error('Invalid login data')
      }

      // Store tokens - Corrigido para usar as propriedades corretas do LoginResponse
      // LoginResponse tem 'token' (não 'accessToken') e não tem 'expiresIn'
      // Usando um valor padrão de 3600 segundos (1 hora) para expiresIn
      TokenManager.setAccessToken(loginData.token, 3600)
      TokenManager.setRefreshToken(loginData.refreshToken)
      
      return loginData
    } catch (error) {
      handleApiError(error, { service: 'AuthService', method: 'login' })
      throw error
    }
  }

  /**
   * Logout user and clear tokens
   */
  static async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error)
      handleApiError(error, { service: 'AuthService', method: 'logout' })
    } finally {
      // Always clear tokens
      TokenManager.clearTokens()
    }
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = TokenManager.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await apiClient.post<GoApiResponse<RefreshTokenResponse>>(
        API_ENDPOINTS.AUTH.REFRESH,
        { refreshToken } as RefreshTokenRequest
      )
      
      if (!response.data) {
        throw new Error('Invalid response data')
      }

      const tokenData = response.data.data
      if (!tokenData) {
        throw new Error('Invalid token data')
      }
      
      // Update tokens
      TokenManager.setAccessToken(tokenData.accessToken, tokenData.expiresIn)
      if (tokenData.refreshToken) {
        TokenManager.setRefreshToken(tokenData.refreshToken)
      }
      
      return tokenData
    } catch (error) {
      // Clear tokens on refresh failure
      TokenManager.clearTokens()
      handleApiError(error, { service: 'AuthService', method: 'refreshToken' })
      throw error
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(): Promise<BackendUser> {
    try {
      const response = await apiClient.get<GoApiResponse<BackendUser>>(API_ENDPOINTS.AUTH.PROFILE)
      
      if (!response.data) {
        throw new Error('Invalid response data')
      }

      const userData = response.data.data
      if (!userData) {
        throw new Error('Invalid user data')
      }

      return userData
    } catch (error) {
      handleApiError(error, { service: 'AuthService', method: 'getProfile' })
      throw error
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(data: Partial<BackendUser>): Promise<BackendUser> {
    try {
      const response = await apiClient.put<GoApiResponse<BackendUser>>(
        API_ENDPOINTS.AUTH.PROFILE,
        data
      )
      
      if (!response.data) {
        throw new Error('Invalid response data')
      }

      const userData = response.data.data
      if (!userData) {
        throw new Error('Invalid user data')
      }

      return userData
    } catch (error) {
      handleApiError(error, { service: 'AuthService', method: 'updateProfile' })
      throw error
    }
  }

  /**
   * Change user password
   */
  static async changePassword(data: ChangePasswordRequest): Promise<void> {
    try {
      await apiClient.post(
        API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
        data
      )
    } catch (error) {
      handleApiError(error, { service: 'AuthService', method: 'changePassword' })
      throw error
    }
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email })
  }

  /**
   * Reset password with token
   */
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      password: newPassword
    })
  }

  /**
   * Verify email with token
   */
  static async verifyEmail(token: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token })
  }

  /**
   * Resend email verification
   */
  static async resendEmailVerification(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION)
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = TokenManager.getAccessToken()
    return token !== null && !TokenManager.isTokenExpired()
  }

  /**
   * Get current access token
   */
  static getAccessToken(): string | null {
    return TokenManager.getAccessToken()
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(): boolean {
    return TokenManager.isTokenExpired()
  }

  /**
   * Clear all authentication data
   */
  static clearAuth(): void {
    TokenManager.clearTokens()
  }

  /**
   * Enable two-factor authentication
   */
  static async enableTwoFactor(): Promise<{ qrCode: string; backupCodes: string[] }> {
    try {
      const response = await apiClient.post<GoApiResponse<{ qrCode: string; backupCodes: string[] }>>(
        API_ENDPOINTS.AUTH.TWO_FACTOR_ENABLE
      )
      
      if (!response.data) {
        throw new Error('Invalid response data')
      }

      const twoFactorData = response.data.data
      if (!twoFactorData) {
        throw new Error('Invalid two-factor data')
      }

      return twoFactorData
    } catch (error) {
      handleApiError(error, { service: 'AuthService', method: 'enableTwoFactor' })
      throw error
    }
  }

  /**
   * Verify two-factor authentication setup
   */
  static async verifyTwoFactor(code: string): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.TWO_FACTOR_VERIFY, { code })
    } catch (error) {
      handleApiError(error, { service: 'AuthService', method: 'verifyTwoFactor' })
      throw error
    }
  }

  /**
   * Disable two-factor authentication
   */
  static async disableTwoFactor(password: string): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.TWO_FACTOR_DISABLE, { password })
    } catch (error) {
      handleApiError(error, { service: 'AuthService', method: 'disableTwoFactor' })
      throw error
    }
  }

  /**
   * Generate new backup codes for 2FA
   */
  static async generateBackupCodes(): Promise<string[]> {
    try {
      const response = await apiClient.post<GoApiResponse<string[]>>(API_ENDPOINTS.AUTH.TWO_FACTOR_BACKUP_CODES)
      
      if (!response.data) {
        throw new Error('Invalid response data')
      }

      const backupCodes = response.data.data
      if (!backupCodes) {
        throw new Error('Invalid backup codes data')
      }

      return backupCodes
    } catch (error) {
      handleApiError(error, { service: 'AuthService', method: 'generateBackupCodes' })
      throw error
    }
  }

  /**
   * Get user sessions
   */
  static async getSessions(): Promise<{
    id: string
    device: string
    location: string
    lastActive: string
    current: boolean
  }[]> {
    try {
      const response = await apiClient.get<GoApiResponse<{
        id: string
        device: string
        location: string
        lastActive: string
        current: boolean
      }[]>>(API_ENDPOINTS.AUTH.SESSIONS)
      
      if (!response.data) {
        throw new Error('Invalid response data')
      }

      const sessionsData = response.data.data
      if (!sessionsData) {
        throw new Error('Invalid sessions data')
      }

      return sessionsData
    } catch (error) {
      handleApiError(error, { service: 'AuthService', method: 'getSessions' })
      throw error
    }
  }

  /**
   * Revoke a specific session
   */
  static async revokeSession(sessionId: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.AUTH.REVOKE_SESSION(sessionId))
    } catch (error) {
      handleApiError(error, { service: 'AuthService', method: 'revokeSession' })
      throw error
    }
  }

  /**
   * Revoke all other sessions
   */
  static async revokeAllOtherSessions(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.REVOKE_ALL_SESSIONS)
    } catch (error) {
      handleApiError(error, { service: 'AuthService', method: 'revokeAllOtherSessions' })
      throw error
    }
  }
}

export default AuthService
