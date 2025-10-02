import { apiClient, handleApiResponse,  API_ENDPOINTS } from '@/lib/api-client'
import { handleApiError } from '@/lib/error-handler'
import { DashboardStats } from '@/types/api'

export class DashboardService {
  /**
   * Get dashboard overview statistics
   */
  static async getDashboardStats(filters?: {
    dateFrom?: string
    dateTo?: string
    workUnit?: string
  }): Promise<DashboardStats> {
    try {
      const response = await apiClient.get<DashboardStats>(
        API_ENDPOINTS.DASHBOARD.STATS,
        filters
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'DashboardService', method: 'getDashboardStats' })
      throw error
    }
  }

  /**
   * Get recent calls for dashboard
   */
  static async getRecentCalls(limit: number = 10): Promise<{
    id: number
    title: string
    status: string
    priority: string
    createdAt: string
    assignedTo?: {
      id: number
      name: string
      avatar?: string
    }
    customer: {
      id: number
      name: string
      email: string
    }
  }[]> {
    try {
      const response = await apiClient.get<{
        id: number
        title: string
        status: string
        priority: string
        createdAt: string
        assignedTo?: {
          id: number
          name: string
          avatar?: string
        }
        customer: {
          id: number
          name: string
          email: string
        }
      }[]>(
        API_ENDPOINTS.DASHBOARD.RECENT_CALLS,
        { limit }
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'DashboardService', method: 'getRecentCalls' })
      throw error
    }
  }

  /**
   * Get calls by status for dashboard charts
   */
  static async getCallsByStatus(filters?: {
    dateFrom?: string
    dateTo?: string
    workUnit?: string
  }): Promise<{
    status: string
    count: number
    percentage: number
  }[]> {
    try {
      const response = await apiClient.get<{
        status: string
        count: number
        percentage: number
      }[]>(
        API_ENDPOINTS.DASHBOARD.CALLS_BY_STATUS,
        filters
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'DashboardService', method: 'getCallsByStatus' })
      throw error
    }
  }

  /**
   * Get calls by priority for dashboard charts
   */
  static async getCallsByPriority(filters?: {
    dateFrom?: string
    dateTo?: string
    workUnit?: string
  }): Promise<{
    priority: string
    count: number
    percentage: number
  }[]> {
    try {
      const response = await apiClient.get<{
        priority: string
        count: number
        percentage: number
      }[]>(
        API_ENDPOINTS.DASHBOARD.CALLS_BY_PRIORITY,
        filters
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'DashboardService', method: 'getCallsByPriority' })
      throw error
    }
  }

  /**
   * Get calls by category for dashboard charts
   */
  static async getCallsByCategory(filters?: {
    dateFrom?: string
    dateTo?: string
    workUnit?: string
  }): Promise<{
    category: string
    count: number
    percentage: number
  }[]> {
    try {
      const response = await apiClient.get<{
        category: string
        count: number
        percentage: number
      }[]>(
        API_ENDPOINTS.DASHBOARD.CALLS_BY_CATEGORY,
        filters
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'DashboardService', method: 'getCallsByCategory' })
      throw error
    }
  }

  /**
   * Get technician performance data
   */
  static async getTechnicianPerformance(filters?: {
    dateFrom?: string
    dateTo?: string
    workUnit?: string
    limit?: number
  }): Promise<{
    technicianId: number
    technicianName: string
    avatar?: string
    callsResolved: number
    averageResolutionTime: number
    customerSatisfactionRating: number
    totalTimeSpent: number
  }[]> {
    try {
      const response = await apiClient.get<{
        technicianId: number
        technicianName: string
        avatar?: string
        callsResolved: number
        averageResolutionTime: number
        customerSatisfactionRating: number
        totalTimeSpent: number
      }[]>(
        API_ENDPOINTS.DASHBOARD.TECHNICIAN_PERFORMANCE,
        filters
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'DashboardService', method: 'getTechnicianPerformance' })
      throw error
    }
  }

  /**
   * Get monthly trends data
   */
  static async getMonthlyTrends(filters?: {
    months?: number
    workUnit?: string
  }): Promise<{
    month: string
    totalCalls: number
    resolvedCalls: number
    averageResolutionTime: number
    customerSatisfaction: number
  }[]> {
    try {
      const response = await apiClient.get<{
        month: string
        totalCalls: number
        resolvedCalls: number
        averageResolutionTime: number
        customerSatisfaction: number
      }[]>(
        API_ENDPOINTS.DASHBOARD.MONTHLY_TRENDS,
        filters
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'DashboardService', method: 'getMonthlyTrends' })
      throw error
    }
  }

  /**
   * Get daily activity data
   */
  static async getDailyActivity(filters?: {
    days?: number
    workUnit?: string
  }): Promise<{
    date: string
    callsCreated: number
    callsResolved: number
    callsInProgress: number
  }[]> {
    try {
      const response = await apiClient.get<{
        date: string
        callsCreated: number
        callsResolved: number
        callsInProgress: number
      }[]>(
        API_ENDPOINTS.DASHBOARD.DAILY_ACTIVITY,
        filters
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'DashboardService', method: 'getDailyActivity' })
      throw error
    }
  }

  /**
   * Get system health metrics
   */
  static async getSystemHealth(): Promise<{
    cpuUsage: number
    memoryUsage: number
    diskUsage: number
    uptime: number
    activeUsers: number
    databaseConnections: number
    responseTime: number
    errorRate: number
  }> {
    try {
      const response = await apiClient.get<{
        cpuUsage: number
        memoryUsage: number
        diskUsage: number
        uptime: number
        activeUsers: number
        databaseConnections: number
        responseTime: number
        errorRate: number
      }>(
        API_ENDPOINTS.DASHBOARD.SYSTEM_HEALTH
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'DashboardService', method: 'getSystemHealth' })
      throw error
    }
  }

  /**
   * Get user activity summary
   */
  static async getUserActivitySummary(filters?: {
    dateFrom?: string
    dateTo?: string
  }): Promise<{
    totalLogins: number
    uniqueUsers: number
    averageSessionDuration: number
    mostActiveUsers: {
      userId: number
      userName: string
      avatar?: string
      loginCount: number
      lastLogin: string
    }[]
  }> {
    try {
      const response = await apiClient.get<{
        totalLogins: number
        uniqueUsers: number
        averageSessionDuration: number
        mostActiveUsers: {
          userId: number
          userName: string
          avatar?: string
          loginCount: number
          lastLogin: string
        }[]
      }>(
        API_ENDPOINTS.DASHBOARD.USER_ACTIVITY,
        filters
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'DashboardService', method: 'getUserActivitySummary' })
      throw error
    }
  }

  /**
   * Get workload distribution
   */
  static async getWorkloadDistribution(filters?: {
    dateFrom?: string
    dateTo?: string
  }): Promise<{
    workUnit: string
    totalCalls: number
    activeCalls: number
    resolvedCalls: number
    averageResolutionTime: number
    techniciansCount: number
  }[]> {
    try {
      const response = await apiClient.get<{
        workUnit: string
        totalCalls: number
        activeCalls: number
        resolvedCalls: number
        averageResolutionTime: number
        techniciansCount: number
      }[]>(
        API_ENDPOINTS.DASHBOARD.WORKLOAD_DISTRIBUTION,
        filters
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'DashboardService', method: 'getWorkloadDistribution' })
      throw error
    }
  }

  /**
   * Get customer satisfaction trends
   */
  static async getCustomerSatisfactionTrends(filters?: {
    dateFrom?: string
    dateTo?: string
    workUnit?: string
  }): Promise<{
    period: string
    averageRating: number
    totalResponses: number
    ratingDistribution: {
      rating: number
      count: number
      percentage: number
    }[]
  }[]> {
    try {
      const response = await apiClient.get<{
        period: string
        averageRating: number
        totalResponses: number
        ratingDistribution: {
          rating: number
          count: number
          percentage: number
        }[]
      }[]>(
        API_ENDPOINTS.DASHBOARD.CUSTOMER_SATISFACTION,
        filters
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'DashboardService', method: 'getCustomerSatisfactionTrends' })
      throw error
    }
  }

  /**
   * Get SLA compliance metrics
   */
  static async getSLACompliance(filters?: {
    dateFrom?: string
    dateTo?: string
    workUnit?: string
  }): Promise<{
    overallCompliance: number
    byPriority: {
      priority: string
      compliance: number
      totalCalls: number
      breachedCalls: number
    }[]
    byCategory: {
      category: string
      compliance: number
      totalCalls: number
      breachedCalls: number
    }[]
  }> {
    try {
      const response = await apiClient.get<{
        overallCompliance: number
        byPriority: {
          priority: string
          compliance: number
          totalCalls: number
          breachedCalls: number
        }[]
        byCategory: {
          category: string
          compliance: number
          totalCalls: number
          breachedCalls: number
        }[]
      }>(
        API_ENDPOINTS.DASHBOARD.SLA_COMPLIANCE,
        filters
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'DashboardService', method: 'getSLACompliance' })
      throw error
    }
  }

  /**
   * Get alerts and notifications
   */
  static async getAlerts(limit: number = 10): Promise<{
    id: number
    type: 'warning' | 'error' | 'info' | 'success'
    title: string
    message: string
    timestamp: string
    isRead: boolean
    actionUrl?: string
  }[]> {
    try {
      const response = await apiClient.get<{
        id: number
        type: 'warning' | 'error' | 'info' | 'success'
        title: string
        message: string
        timestamp: string
        isRead: boolean
        actionUrl?: string
      }[]>(
        API_ENDPOINTS.DASHBOARD.ALERTS,
        { limit }
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'DashboardService', method: 'getAlerts' })
      throw error
    }
  }

  /**
   * Mark alert as read
   */
  static async markAlertAsRead(alertId: number): Promise<void> {
    try {
      const response = await apiClient.patch(
        API_ENDPOINTS.DASHBOARD.MARK_ALERT_READ(alertId.toString())
      )
      handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'DashboardService', method: 'markAlertAsRead' })
      throw error
    }
  }

  /**
   * Get real-time metrics (for live updates)
   */
  static async getRealTimeMetrics(): Promise<{
    activeCalls: number
    onlineTechnicians: number
    avgResponseTime: number
    systemLoad: number
    recentActivity: {
      type: string
      message: string
      timestamp: string
    }[]
  }> {
    try {
      const response = await apiClient.get<{
        activeCalls: number
        onlineTechnicians: number
        avgResponseTime: number
        systemLoad: number
        recentActivity: {
          type: string
          message: string
          timestamp: string
        }[]
      }>(API_ENDPOINTS.DASHBOARD.REAL_TIME_METRICS)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'DashboardService', method: 'getRealTimeMetrics' })
      throw error
    }
  }

  /**
   * Export dashboard data
   */
  static async exportDashboardData(
    type: 'overview' | 'detailed',
    format: 'pdf' | 'excel' = 'pdf',
    filters?: {
      dateFrom?: string
      dateTo?: string
      workUnit?: string
    }
  ): Promise<{ downloadUrl: string; filename: string }> {
    try {
      const response = await apiClient.post<{ downloadUrl: string; filename: string }>(
        API_ENDPOINTS.DASHBOARD.EXPORT,
        {
          type,
          format,
          filters
        }
      )
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'DashboardService', method: 'exportDashboardData' })
      throw error
    }
  }

  /**
   * Get dashboard widgets configuration
   */
  static async getWidgetsConfig(): Promise<{
    widgetId: string
    title: string
    type: string
    position: { x: number; y: number; w: number; h: number }
    isVisible: boolean
    config: any
  }[]> {
    try {
      const response = await apiClient.get<{
        widgetId: string
        title: string
        type: string
        position: { x: number; y: number; w: number; h: number }
        isVisible: boolean
        config: any
      }[]>(API_ENDPOINTS.DASHBOARD.WIDGETS_CONFIG)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'DashboardService', method: 'getWidgetsConfig' })
      throw error
    }
  }

  /**
   * Update dashboard widgets configuration
   */
  static async updateWidgetsConfig(config: {
    widgetId: string
    position?: { x: number; y: number; w: number; h: number }
    isVisible?: boolean
    config?: any
  }[]): Promise<void> {
    try {
      const response = await apiClient.patch(
        API_ENDPOINTS.DASHBOARD.WIDGETS_CONFIG,
        { widgets: config }
      )
      handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'DashboardService', method: 'updateWidgetsConfig' })
      throw error
    }
  }
}

export default DashboardService