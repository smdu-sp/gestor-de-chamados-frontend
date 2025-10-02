import { apiClient, handleApiResponse,  API_ENDPOINTS } from '@/lib/api-client'
import { handleApiError } from '@/lib/error-handler'
import { SystemSettings } from '@/types/api'

export class SettingsService {
  /**
   * Get all system settings
   */
  static async getSettings(): Promise<SystemSettings> {
    try {
      const response = await apiClient.get<SystemSettings>(
        API_ENDPOINTS.SETTINGS.GET
      )
      return response.data as SystemSettings
    } catch (error) {
      handleApiError(error, { service: 'SettingsService', method: 'getSettings' })
      throw error
    }
  }

  /**
   * Update system settings
   */
  static async updateSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    try {
      const response = await apiClient.patch<SystemSettings>(
        API_ENDPOINTS.SETTINGS.UPDATE,
        settings
      )
      return response.data as SystemSettings
    } catch (error) {
      handleApiError(error, { service: 'SettingsService', method: 'updateSettings' })
      throw error
    }
  }

  /**
   * Get specific setting category
   */
  static async getSettingCategory(
    category: 'general' | 'security' | 'notifications' | 'calls' | 'ui' | 'backup' | 'integrations'
  ): Promise<Record<string, any>> {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.SETTINGS.GET}/${category}`
      )
      return response.data as Record<string, any>
    } catch (error) {
      handleApiError(error, { service: 'SettingsService', method: 'getSettingCategory' })
      throw error
    }
  }

  /**
   * Update specific setting category
   */
  static async updateSettingCategory(
    category: 'general' | 'security' | 'notifications' | 'calls' | 'ui' | 'backup' | 'integrations',
    settings: Record<string, any>
  ): Promise<Record<string, any>> {
    try {
      const response = await apiClient.patch(
        `${API_ENDPOINTS.SETTINGS.UPDATE}/${category}`,
        settings
      )
      return response.data as Record<string, any>
    } catch (error) {
      handleApiError(error, { service: 'SettingsService', method: 'updateSettingCategory' })
      throw error
    }
  }

  /**
   * Get general settings
   */
  static async getGeneralSettings(): Promise<{
    companyName: string
    companyLogo?: string
    timezone: string
    dateFormat: string
    timeFormat: string
    language: string
    currency: string
    maintenanceMode: boolean
    maintenanceMessage?: string
  }> {
    try {
      const response = await apiClient.get('/settings/general')
      return response.data as {
        companyName: string
        companyLogo?: string
        timezone: string
        dateFormat: string
        timeFormat: string
        language: string
        currency: string
        maintenanceMode: boolean
        maintenanceMessage?: string
      }
    } catch (error) {
      handleApiError(error, { service: 'SettingsService', method: 'getGeneralSettings' })
      throw error
    }
  }

  /**
   * Update general settings
   */
  static async updateGeneralSettings(settings: {
    companyName?: string
    companyLogo?: string
    timezone?: string
    dateFormat?: string
    timeFormat?: string
    language?: string
    currency?: string
    maintenanceMode?: boolean
    maintenanceMessage?: string
  }): Promise<void> {
    try {
      const response = await apiClient.patch('/settings/general', settings)
      // void method - no return needed
    } catch (error) {
      handleApiError(error, { service: 'SettingsService', method: 'updateGeneralSettings' })
      throw error
    }
  }

  /**
   * Get security settings
   */
  static async getSecuritySettings(): Promise<{
    passwordMinLength: number
    passwordRequireUppercase: boolean
    passwordRequireLowercase: boolean
    passwordRequireNumbers: boolean
    passwordRequireSpecialChars: boolean
    passwordExpirationDays: number
    maxLoginAttempts: number
    lockoutDurationMinutes: number
    sessionTimeoutMinutes: number
    twoFactorAuthRequired: boolean
    allowedIpRanges: string[]
    sslRequired: boolean
  }> {
    try {
      const response = await apiClient.get('/settings/security')
      return response.data as {
        passwordMinLength: number
        passwordRequireUppercase: boolean
        passwordRequireLowercase: boolean
        passwordRequireNumbers: boolean
        passwordRequireSpecialChars: boolean
        passwordExpirationDays: number
        maxLoginAttempts: number
        lockoutDurationMinutes: number
        sessionTimeoutMinutes: number
        twoFactorAuthRequired: boolean
        allowedIpRanges: string[]
        sslRequired: boolean
      }
    } catch (error) {
      handleApiError(error, { service: 'SettingsService', method: 'getSecuritySettings' })
      throw error
    }
  }

  /**
   * Update security settings
   */
  static async updateSecuritySettings(settings: {
    passwordMinLength?: number
    passwordRequireUppercase?: boolean
    passwordRequireLowercase?: boolean
    passwordRequireNumbers?: boolean
    passwordRequireSpecialChars?: boolean
    passwordExpirationDays?: number
    maxLoginAttempts?: number
    lockoutDurationMinutes?: number
    sessionTimeoutMinutes?: number
    twoFactorAuthRequired?: boolean
    allowedIpRanges?: string[]
    sslRequired?: boolean
  }): Promise<void> {
    try {
      const response = await apiClient.patch('/settings/security', settings)
      // void method - no return needed
    } catch (error) {
      handleApiError(error, { service: 'SettingsService', method: 'updateSecuritySettings' })
      throw error
    }
  }

  /**
   * Get notification settings
   */
  static async getNotificationSettings(): Promise<{
    emailNotificationsEnabled: boolean
    smsNotificationsEnabled: boolean
    pushNotificationsEnabled: boolean
    notifyOnNewCall: boolean
    notifyOnCallAssignment: boolean
    notifyOnCallStatusChange: boolean
    notifyOnCallEscalation: boolean
    notifyOnSLABreach: boolean
    emailTemplates: {
      newCall: string
      callAssignment: string
      callResolution: string
      slaWarning: string
    }
    smtpSettings: {
      host: string
      port: number
      username: string
      password: string
      encryption: 'none' | 'tls' | 'ssl'
      fromEmail: string
      fromName: string
    }
  }> {
    try {
      const response = await apiClient.get('/settings/notifications')
      return response.data as {
        emailNotificationsEnabled: boolean
        smsNotificationsEnabled: boolean
        pushNotificationsEnabled: boolean
        notifyOnNewCall: boolean
        notifyOnCallAssignment: boolean
        notifyOnCallStatusChange: boolean
        notifyOnCallEscalation: boolean
        notifyOnSLABreach: boolean
        emailTemplates: {
          newCall: string
          callAssignment: string
          callResolution: string
          slaWarning: string
        }
        smtpSettings: {
          host: string
          port: number
          username: string
          password: string
          encryption: 'none' | 'tls' | 'ssl'
          fromEmail: string
          fromName: string
        }
      }
    } catch (error) {
      handleApiError(error, { service: 'SettingsService', method: 'getNotificationSettings' })
      throw error
    }
  }

  /**
   * Update notification settings
   */
  static async updateNotificationSettings(settings: {
    emailNotificationsEnabled?: boolean
    smsNotificationsEnabled?: boolean
    pushNotificationsEnabled?: boolean
    notifyOnNewCall?: boolean
    notifyOnCallAssignment?: boolean
    notifyOnCallStatusChange?: boolean
    notifyOnCallEscalation?: boolean
    notifyOnSLABreach?: boolean
    emailTemplates?: {
      newCall?: string
      callAssignment?: string
      callResolution?: string
      slaWarning?: string
    }
    smtpSettings?: {
      host?: string
      port?: number
      username?: string
      password?: string
      encryption?: 'none' | 'tls' | 'ssl'
      fromEmail?: string
      fromName?: string
    }
  }): Promise<void> {
    try {
      const response = await apiClient.patch('/settings/notifications', settings)
      // void method - no return needed
    } catch (error) {
      handleApiError(error, { service: 'SettingsService', method: 'updateNotificationSettings' })
      throw error
    }
  }

  /**
   * Get call management settings
   */
  static async getCallSettings(): Promise<{
    autoAssignmentEnabled: boolean
    autoAssignmentRules: {
      priority: string
      workUnit?: string
      category?: string
      assignTo: 'round_robin' | 'least_busy' | 'specific_user'
      specificUserId?: number
    }[]
    escalationRules: {
      priority: string
      escalateAfterMinutes: number
      escalateTo: number[]
    }[]
    slaTargets: {
      priority: string
      responseTimeMinutes: number
      resolutionTimeMinutes: number
    }[]
    defaultPriority: 'low' | 'medium' | 'high' | 'urgent'
    allowCustomerSelfAssignment: boolean
    requireApprovalForClosure: boolean
    mandatoryFields: string[]
  }> {
    try {
      const response = await apiClient.get('/settings/calls')
      return response.data as {
        autoAssignmentEnabled: boolean
        autoAssignmentRules: {
          priority: string
          workUnit?: string
          category?: string
          assignTo: 'round_robin' | 'least_busy' | 'specific_user'
          specificUserId?: number
        }[]
        escalationRules: {
          priority: string
          escalateAfterMinutes: number
          escalateTo: number[]
        }[]
        slaTargets: {
          priority: string
          responseTimeMinutes: number
          resolutionTimeMinutes: number
        }[]
        defaultPriority: 'low' | 'medium' | 'high' | 'urgent'
        allowCustomerSelfAssignment: boolean
        requireApprovalForClosure: boolean
        mandatoryFields: string[]
      }
    } catch (error) {
      handleApiError(error, { service: 'SettingsService', method: 'getCallSettings' })
      throw error
    }
  }

  /**
   * Update call management settings
   */
  static async updateCallSettings(settings: {
    autoAssignmentEnabled?: boolean
    autoAssignmentRules?: {
      priority: string
      workUnit?: string
      category?: string
      assignTo: 'round_robin' | 'least_busy' | 'specific_user'
      specificUserId?: number
    }[]
    escalationRules?: {
      priority: string
      escalateAfterMinutes: number
      escalateTo: number[]
    }[]
    slaTargets?: {
      priority: string
      responseTimeMinutes: number
      resolutionTimeMinutes: number
    }[]
    defaultPriority?: 'low' | 'medium' | 'high' | 'urgent'
    allowCustomerSelfAssignment?: boolean
    requireApprovalForClosure?: boolean
    mandatoryFields?: string[]
  }): Promise<void> {
    try {
      const response = await apiClient.patch('/settings/calls', settings)
      // void method - no return needed
    } catch (error) {
      handleApiError(error, { service: 'SettingsService', method: 'updateCallSettings' })
      throw error
    }
  }

  /**
   * Get UI settings
   */
  static async getUISettings(): Promise<{
    theme: 'light' | 'dark' | 'auto'
    primaryColor: string
    secondaryColor: string
    sidebarCollapsed: boolean
    showBreadcrumbs: boolean
    showNotifications: boolean
    itemsPerPage: number
    dateTimeFormat: string
    customCSS?: string
    logoUrl?: string
    faviconUrl?: string
  }> {
    try {
      const response = await apiClient.get('/settings/ui')
      return response.data as {
        theme: 'light' | 'dark' | 'auto'
        primaryColor: string
        secondaryColor: string
        sidebarCollapsed: boolean
        showBreadcrumbs: boolean
        showNotifications: boolean
        itemsPerPage: number
        dateTimeFormat: string
        customCSS?: string
        logoUrl?: string
        faviconUrl?: string
      }
    } catch (error) {
      handleApiError(error, { service: 'SettingsService', method: 'getUISettings' })
      throw error
    }
  }

  /**
   * Update UI settings
   */
  static async updateUISettings(settings: {
    theme?: 'light' | 'dark' | 'auto'
    primaryColor?: string
    secondaryColor?: string
    sidebarCollapsed?: boolean
    showBreadcrumbs?: boolean
    showNotifications?: boolean
    itemsPerPage?: number
    dateTimeFormat?: string
    customCSS?: string
    logoUrl?: string
    faviconUrl?: string
  }): Promise<void> {
    try {
      const response = await apiClient.patch('/settings/ui', settings)
      // void method - no return needed
    } catch (error) {
      handleApiError(error, { service: 'SettingsService', method: 'updateUISettings' })
      throw error
    }
  }

  /**
   * Get backup settings
   */
  static async getBackupSettings(): Promise<{
    autoBackupEnabled: boolean
    backupFrequency: 'daily' | 'weekly' | 'monthly'
    backupTime: string
    retentionDays: number
    backupLocation: 'local' | 's3' | 'ftp'
    s3Settings?: {
      bucket: string
      region: string
      accessKey: string
      secretKey: string
    }
    ftpSettings?: {
      host: string
      port: number
      username: string
      password: string
      path: string
    }
    includeAttachments: boolean
    compressBackups: boolean
  }> {
    try {
      const response = await apiClient.get('/settings/backup')
      return response.data as {
        autoBackupEnabled: boolean
        backupFrequency: 'daily' | 'weekly' | 'monthly'
        backupTime: string
        retentionDays: number
        backupLocation: 'local' | 's3' | 'ftp'
        s3Settings?: {
          bucket: string
          region: string
          accessKey: string
          secretKey: string
        }
        ftpSettings?: {
          host: string
          port: number
          username: string
          password: string
          path: string
        }
        includeAttachments: boolean
        compressBackups: boolean
      }
    } catch (error) {
      handleApiError(error, { service: 'SettingsService', method: 'getBackupSettings' })
      throw error
    }
  }

  /**
   * Update backup settings
   */
  static async updateBackupSettings(settings: {
    autoBackupEnabled?: boolean
    backupFrequency?: 'daily' | 'weekly' | 'monthly'
    backupTime?: string
    retentionDays?: number
    backupLocation?: 'local' | 's3' | 'ftp'
    s3Settings?: {
      bucket?: string
      region?: string
      accessKey?: string
      secretKey?: string
    }
    ftpSettings?: {
      host?: string
      port?: number
      username?: string
      password?: string
      path?: string
    }
    includeAttachments?: boolean
    compressBackups?: boolean
  }): Promise<void> {
    try {
      const response = await apiClient.patch('/settings/backup', settings)
      // void method - no return needed
    } catch (error) {
      handleApiError(error, { service: 'SettingsService', method: 'updateBackupSettings' })
      throw error
    }
  }

  /**
   * Get integration settings
   */
  static async getIntegrationSettings(): Promise<{
    ldapEnabled: boolean
    ldapSettings?: {
      server: string
      port: number
      baseDN: string
      bindDN: string
      bindPassword: string
      userFilter: string
      groupFilter: string
      sslEnabled: boolean
    }
    ssoEnabled: boolean
    ssoSettings?: {
      provider: 'saml' | 'oauth2' | 'oidc'
      entityId: string
      ssoUrl: string
      certificate: string
      attributeMapping: {
        email: string
        firstName: string
        lastName: string
        role: string
      }
    }
    webhooksEnabled: boolean
    webhookEndpoints: {
      id: string
      name: string
      url: string
      events: string[]
      secret: string
      isActive: boolean
    }[]
    apiRateLimit: {
      enabled: boolean
      requestsPerMinute: number
      requestsPerHour: number
    }
  }> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SETTINGS.INTEGRATIONS)
      return response.data as {
        ldapEnabled: boolean
        ldapSettings?: {
          server: string
          port: number
          baseDN: string
          bindDN: string
          bindPassword: string
          userFilter: string
          groupFilter: string
          sslEnabled: boolean
        }
        ssoEnabled: boolean
        ssoSettings?: {
          provider: 'saml' | 'oauth2' | 'oidc'
          entityId: string
          ssoUrl: string
          certificate: string
          attributeMapping: {
            email: string
            firstName: string
            lastName: string
            role: string
          }
        }
        webhooksEnabled: boolean
        webhookEndpoints: {
          id: string
          name: string
          url: string
          events: string[]
          secret: string
          isActive: boolean
        }[]
        apiRateLimit: {
          enabled: boolean
          requestsPerMinute: number
          requestsPerHour: number
        }
      }
    } catch (error) {
      handleApiError(error, { service: 'SettingsService', method: 'getIntegrationSettings' })
      throw error
    }
  }

  /**
   * Update integration settings
   */
  static async updateIntegrationSettings(settings: {
    ldapEnabled?: boolean
    ldapSettings?: {
      server?: string
      port?: number
      baseDN?: string
      bindDN?: string
      bindPassword?: string
      userFilter?: string
      groupFilter?: string
      sslEnabled?: boolean
    }
    ssoEnabled?: boolean
    ssoSettings?: {
      provider?: 'saml' | 'oauth2' | 'oidc'
      entityId?: string
      ssoUrl?: string
      certificate?: string
      attributeMapping?: {
        email?: string
        firstName?: string
        lastName?: string
        role?: string
      }
    }
    webhooksEnabled?: boolean
    webhookEndpoints?: {
      id?: string
      name?: string
      url?: string
      events?: string[]
      secret?: string
      isActive?: boolean
    }[]
    apiRateLimit?: {
      enabled?: boolean
      requestsPerMinute?: number
      requestsPerHour?: number
    }
  }): Promise<void> {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.SETTINGS.INTEGRATIONS, settings)
      // void method - no return needed
    } catch (error) {
      handleApiError(error, { service: 'SettingsService', method: 'updateIntegrationSettings' })
      throw error
    }
  }

  /**
   * Test SMTP configuration
   */
  static async testSMTPSettings(settings: {
    host: string
    port: number
    username: string
    password: string
    encryption: 'none' | 'tls' | 'ssl'
    fromEmail: string
    testEmail: string
  }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post('/settings/test-smtp', settings)
      return response.data as { success: boolean; message: string; responseTime?: number }
    } catch (error) {
      handleApiError(error, { service: 'SettingsService', method: 'testSMTPSettings' })
      throw error
    }
  }

  /**
   * Test LDAP connection
   */
  static async testLDAPConnection(settings: {
    server: string
    port: number
    baseDN: string
    bindDN: string
    bindPassword: string
    sslEnabled: boolean
  }): Promise<{ success: boolean; message: string; userCount?: number }> {
    try {
      const response = await apiClient.post('/settings/test-ldap', settings)
      return response.data as { success: boolean; message: string }
    } catch (error) {
      handleApiError(error, { service: 'SettingsService', method: 'testLDAPConnection' })
      throw error
    }
  }

  /**
   * Test webhook endpoint
   */
  static async testWebhook(webhookId: string): Promise<{ success: boolean; message: string; responseTime?: number }> {
    try {
      const response = await apiClient.post(`/settings/test-webhook/${webhookId}`)
      return response.data as { success: boolean; message: string; responseTime?: number }
    } catch (error) {
      handleApiError(error, { service: 'SettingsService', method: 'testWebhook' })
      throw error
    }
  }

  /**
   * Reset settings to default
   */
  static async resetToDefaults(
    category?: 'general' | 'security' | 'notifications' | 'calls' | 'ui' | 'backup' | 'integrations'
  ): Promise<void> {
    try {
      const endpoint = category 
        ? `${API_ENDPOINTS.SETTINGS.RESET}/${category}`
        : API_ENDPOINTS.SETTINGS.RESET
      
      const response = await apiClient.post(endpoint)
      // void method - no return needed
    } catch (error) {
      handleApiError(error, { service: 'SettingsService', method: 'resetToDefaults' })
      throw error
    }
  }

  /**
   * Export settings configuration
   */
  static async exportSettings(): Promise<{ downloadUrl: string; filename: string }> {
    try {
      const response = await apiClient.post('/settings/export')
      return response.data as { downloadUrl: string; filename: string }
    } catch (error) {
      handleApiError(error, { service: 'SettingsService', method: 'exportSettings' })
      throw error
    }
  }

  /**
   * Import settings configuration
   */
  static async importSettings(file: File): Promise<{ success: boolean; message: string; importedSettings: string[] }> {
    try {
      const formData = new FormData()
      formData.append('settings', file)

      const response = await apiClient.upload(
        '/settings/import',
        formData
      )
      return response.data as { success: boolean; message: string; importedSettings: string[] }
    } catch (error) {
      handleApiError(error, { service: 'SettingsService', method: 'importSettings' })
      throw error
    }
  }
}

export default SettingsService