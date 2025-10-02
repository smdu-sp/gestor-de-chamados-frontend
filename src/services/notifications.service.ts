import { apiClient, handleApiResponse,  API_ENDPOINTS } from '@/lib/api-client'
import { handleApiError } from '@/lib/error-handler'
import { NotificationResponse, PaginationParams, PaginatedResponse } from '@/types/api'

export class NotificationsService {
  /**
   * Get user notifications with pagination
   */
  static async getNotifications(
    pagination: PaginationParams,
    filters?: {
      isRead?: boolean
      type?: string
      dateFrom?: string
      dateTo?: string
    }
  ): Promise<PaginatedResponse<NotificationResponse>> {
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: pagination.sortBy,
        sortOrder: pagination.sortOrder,
        ...filters,
      }

      const response = await apiClient.get<PaginatedResponse<NotificationResponse>>(
        API_ENDPOINTS.NOTIFICATIONS.LIST,
        params
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'NotificationsService', method: 'getNotifications' })
      throw error
    }
  }

  /**
   * Get unread notifications count
   */
  static async getUnreadCount(): Promise<{ count: number }> {
    try {
      const response = await apiClient.get<{ count: number }>(
        API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'NotificationsService', method: 'getUnreadCount' })
      throw error
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: number): Promise<void> {
    try {
      const response = await apiClient.patch(
        API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId.toString())
      )
      handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'NotificationsService', method: 'markAsRead' })
      throw error
    }
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(): Promise<void> {
    try {
      const response = await apiClient.patch(
        API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ
      )
      handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'NotificationsService', method: 'markAllAsRead' })
      throw error
    }
  }

  /**
   * Delete a notification
   */
  static async deleteNotification(notificationId: number): Promise<void> {
    try {
      const response = await apiClient.delete(
        `/notifications/${notificationId}`
      )
      handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'NotificationsService', method: 'deleteNotification' })
      throw error
    }
  }

  /**
   * Delete all notifications
   */
  static async deleteAllNotifications(): Promise<void> {
    try {
      const response = await apiClient.delete('/notifications/all')
      handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'NotificationsService', method: 'deleteAllNotifications' })
      throw error
    }
  }

  /**
   * Get recent notifications (for dropdown/sidebar)
   */
  static async getRecentNotifications(limit: number = 10): Promise<NotificationResponse[]> {
    try {
      const response = await apiClient.get<NotificationResponse[]>(
        '/notifications/recent',
        { limit }
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'NotificationsService', method: 'getRecentNotifications' })
      throw error
    }
  }

  /**
   * Create a new notification (admin only)
   */
  static async createNotification(data: {
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    recipients: number[] | 'all'
    actionUrl?: string
    scheduledFor?: string
  }): Promise<NotificationResponse> {
    try {
      const response = await apiClient.post<NotificationResponse>(
        '/notifications',
        data
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'NotificationsService', method: 'createNotification' })
      throw error
    }
  }

  /**
   * Get notification preferences for current user
   */
  static async getNotificationPreferences(): Promise<{
    emailNotifications: boolean
    pushNotifications: boolean
    smsNotifications: boolean
    notificationTypes: {
      type: string
      email: boolean
      push: boolean
      sms: boolean
    }[]
    quietHours: {
      enabled: boolean
      startTime: string
      endTime: string
      timezone: string
    }
  }> {
    try {
      const response = await apiClient.get<{
        emailNotifications: boolean
        pushNotifications: boolean
        smsNotifications: boolean
        notificationTypes: {
          type: string
          email: boolean
          push: boolean
          sms: boolean
        }[]
        quietHours: {
          enabled: boolean
          startTime: string
          endTime: string
          timezone: string
        }
      }>('/notifications/preferences')
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'NotificationsService', method: 'getNotificationPreferences' })
      throw error
    }
  }

  /**
   * Update notification preferences
   */
  static async updateNotificationPreferences(preferences: {
    emailNotifications?: boolean
    pushNotifications?: boolean
    smsNotifications?: boolean
    notificationTypes?: {
      type: string
      email?: boolean
      push?: boolean
      sms?: boolean
    }[]
    quietHours?: {
      enabled?: boolean
      startTime?: string
      endTime?: string
      timezone?: string
    }
  }): Promise<void> {
    try {
      const response = await apiClient.patch(
        '/notifications/preferences',
        preferences
      )
      handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'NotificationsService', method: 'updateNotificationPreferences' })
      throw error
    }
  }

  /**
   * Subscribe to push notifications
   */
  static async subscribeToPush(subscription: {
    endpoint: string
    keys: {
      p256dh: string
      auth: string
    }
  }): Promise<void> {
    try {
      const response = await apiClient.post(
        '/notifications/push/subscribe',
        subscription
      )
      handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'NotificationsService', method: 'subscribeToPush' })
      throw error
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  static async unsubscribeFromPush(): Promise<void> {
    try {
      const response = await apiClient.post('/notifications/push/unsubscribe')
      handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'NotificationsService', method: 'unsubscribeFromPush' })
      throw error
    }
  }

  /**
   * Test notification delivery
   */
  static async testNotification(type: 'email' | 'push' | 'sms'): Promise<{
    success: boolean
    message: string
  }> {
    try {
      const response = await apiClient.post<{
        success: boolean
        message: string
      }>(
        `/notifications/test/${type}`
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'NotificationsService', method: 'testNotification' })
      throw error
    }
  }

  /**
   * Get notification templates (admin only)
   */
  static async getNotificationTemplates(): Promise<{
    id: string
    name: string
    subject: string
    emailTemplate: string
    pushTemplate: string
    smsTemplate: string
    variables: string[]
    isActive: boolean
  }[]> {
    try {
      const response = await apiClient.get<{
        id: string
        name: string
        subject: string
        emailTemplate: string
        pushTemplate: string
        smsTemplate: string
        variables: string[]
        isActive: boolean
      }[]>('/notifications/templates')
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'NotificationsService', method: 'getNotificationTemplates' })
      throw error
    }
  }

  /**
   * Update notification template (admin only)
   */
  static async updateNotificationTemplate(
    templateId: string,
    template: {
      name?: string
      subject?: string
      emailTemplate?: string
      pushTemplate?: string
      smsTemplate?: string
      isActive?: boolean
    }
  ): Promise<void> {
    try {
      const response = await apiClient.patch(
        `/notifications/templates/${templateId}`,
        template
      )
      handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'NotificationsService', method: 'updateNotificationTemplate' })
      throw error
    }
  }

  /**
   * Send bulk notification (admin only)
   */
  static async sendBulkNotification(data: {
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    recipients: {
      userIds?: number[]
      roles?: string[]
      workUnits?: string[]
      all?: boolean
    }
    channels: ('email' | 'push' | 'sms' | 'in_app')[]
    scheduledFor?: string
    actionUrl?: string
  }): Promise<{
    notificationId: number
    recipientCount: number
    scheduledFor?: string
  }> {
    try {
      const response = await apiClient.post<{
        notificationId: number
        recipientCount: number
        scheduledFor?: string
      }>(
        '/notifications/bulk',
        data
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'NotificationsService', method: 'sendBulkNotification' })
      throw error
    }
  }

  /**
   * Get notification delivery status (admin only)
   */
  static async getDeliveryStatus(notificationId: number): Promise<{
    notificationId: number
    totalRecipients: number
    deliveryStats: {
      channel: string
      sent: number
      delivered: number
      failed: number
      pending: number
    }[]
    failureReasons: {
      reason: string
      count: number
    }[]
  }> {
    try {
      const response = await apiClient.get<{
        notificationId: number
        totalRecipients: number
        deliveryStats: {
          channel: string
          sent: number
          delivered: number
          failed: number
          pending: number
        }[]
        failureReasons: {
          reason: string
          count: number
        }[]
      }>(
        `/notifications/${notificationId}/delivery-status`
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'NotificationsService', method: 'getDeliveryStatus' })
      throw error
    }
  }

  /**
   * Get notification analytics (admin only)
   */
  static async getNotificationAnalytics(filters?: {
    dateFrom?: string
    dateTo?: string
    type?: string
    channel?: string
  }): Promise<{
    totalSent: number
    totalDelivered: number
    totalFailed: number
    deliveryRate: number
    byType: {
      type: string
      sent: number
      delivered: number
      failed: number
    }[]
    byChannel: {
      channel: string
      sent: number
      delivered: number
      failed: number
    }[]
    trends: {
      date: string
      sent: number
      delivered: number
      failed: number
    }[]
  }> {
    try {
      const response = await apiClient.get<{
        totalSent: number
        totalDelivered: number
        totalFailed: number
        deliveryRate: number
        byType: {
          type: string
          sent: number
          delivered: number
          failed: number
        }[]
        byChannel: {
          channel: string
          sent: number
          delivered: number
          failed: number
        }[]
        trends: {
          date: string
          sent: number
          delivered: number
          failed: number
        }[]
      }>(
        '/notifications/analytics',
        filters
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'NotificationsService', method: 'getNotificationAnalytics' })
      throw error
    }
  }

  /**
   * Get system alerts (admin only)
   */
  static async getSystemAlerts(): Promise<{
    id: string
    type: 'system' | 'security' | 'performance' | 'maintenance'
    severity: 'low' | 'medium' | 'high' | 'critical'
    title: string
    message: string
    timestamp: string
    isResolved: boolean
    resolvedAt?: string
    resolvedBy?: number
    metadata?: any
  }[]> {
    try {
      const response = await apiClient.get<{
        id: string
        type: 'system' | 'performance' | 'security' | 'maintenance'
        severity: 'low' | 'medium' | 'high' | 'critical'
        title: string
        message: string
        timestamp: string
        isResolved: boolean
        resolvedAt?: string
        resolvedBy?: number
        metadata?: any
      }[]>('/notifications/system-alerts')
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'NotificationsService', method: 'getSystemAlerts' })
      throw error
    }
  }

  /**
   * Resolve system alert (admin only)
   */
  static async resolveSystemAlert(
    alertId: string,
    resolution?: string
  ): Promise<void> {
    try {
      const response = await apiClient.patch(
        `/notifications/system-alerts/${alertId}/resolve`,
        { resolution }
      )
      handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'NotificationsService', method: 'resolveSystemAlert' })
      throw error
    }
  }

  /**
   * Configure alert rules (admin only)
   */
  static async configureAlertRules(rules: {
    id?: string
    name: string
    type: 'system' | 'security' | 'performance' | 'business'
    condition: {
      metric: string
      operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte'
      threshold: number
      duration?: number
    }
    severity: 'low' | 'medium' | 'high' | 'critical'
    actions: {
      type: 'email' | 'push' | 'sms' | 'webhook'
      recipients?: string[]
      webhookUrl?: string
    }[]
    isActive: boolean
  }[]): Promise<void> {
    try {
      const response = await apiClient.post(
        '/notifications/alert-rules',
        { rules }
      )
      handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'NotificationsService', method: 'configureAlertRules' })
      throw error
    }
  }

  /**
   * Get alert rules (admin only)
   */
  static async getAlertRules(): Promise<{
    id: string
    name: string
    type: string
    condition: {
      metric: string
      operator: string
      threshold: number
      duration?: number
    }
    severity: string
    actions: {
      type: string
      recipients?: string[]
      webhookUrl?: string
    }[]
    isActive: boolean
    lastTriggered?: string
    triggerCount: number
  }[]> {
    try {
      const response = await apiClient.get<{
        id: string
        name: string
        type: string
        condition: {
          metric: string
          operator: string
          threshold: number
          duration?: number
        }
        severity: string
        actions: {
          type: string
          recipients?: string[]
          webhookUrl?: string
        }[]
        isActive: boolean
        lastTriggered?: string
        triggerCount: number
        createdAt: string
        updatedAt: string
      }[]>('/notifications/alert-rules')
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'NotificationsService', method: 'getAlertRules' })
      throw error
    }
  }
}

export default NotificationsService