import { apiClient, handleApiResponse,  API_ENDPOINTS } from '@/lib/api-client'
import { handleApiError } from '@/lib/error-handler'
import { ReportRequest, ReportResponse } from '@/types/api'

export class ReportsService {
  /**
   * Generate a new report
   */
  static async generateReport(request: ReportRequest): Promise<ReportResponse> {
    try {
      const response = await apiClient.post<ReportResponse>(
        API_ENDPOINTS.REPORTS.GENERATE,
        request
      )
      return response.data as ReportResponse
    } catch (error) {
      handleApiError(error, { service: 'ReportsService', method: 'generateReport' })
      throw error
    }
  }

  /**
   * Get list of available reports
   */
  static async getReports(filters?: {
    type?: string
    status?: 'pending' | 'processing' | 'completed' | 'failed'
    createdBy?: number
    dateFrom?: string
    dateTo?: string
  }): Promise<ReportResponse[]> {
    try {
      const response = await apiClient.get<ReportResponse[]>(
        API_ENDPOINTS.REPORTS.LIST,
        filters
      )
      return response.data as ReportResponse[]
    } catch (error) {
      handleApiError(error, { service: 'ReportsService', method: 'getReports' })
      throw error
    }
  }

  /**
   * Get a specific report by ID
   */
  static async getReport(id: number): Promise<ReportResponse> {
    try {
      const response = await apiClient.get<ReportResponse>(
        API_ENDPOINTS.REPORTS.GET(id.toString())
      )
      return response.data as ReportResponse
    } catch (error) {
      handleApiError(error, { service: 'ReportsService', method: 'getReport' })
      throw error
    }
  }

  /**
   * Download a completed report
   */
  static async downloadReport(id: number): Promise<{ downloadUrl: string; filename: string }> {
    try {
      const response = await apiClient.get<{
        downloadUrl: string
        filename: string
      }>(
        `${API_ENDPOINTS.REPORTS.GET(id.toString())}/download`
      )
      return response.data as { downloadUrl: string; filename: string }
    } catch (error) {
      handleApiError(error, { service: 'ReportsService', method: 'downloadReport' })
      throw error
    }
  }

  /**
   * Delete a report
   */
  static async deleteReport(id: number): Promise<void> {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.REPORTS.DELETE(id.toString()))
      // No return needed for void methods
    } catch (error) {
      handleApiError(error, { service: 'ReportsService', method: 'deleteReport' })
      throw error
    }
  }

  /**
   * Get calls summary report
   */
  static async getCallsSummaryReport(filters: {
    dateFrom: string
    dateTo: string
    workUnit?: string
    category?: string
    priority?: string
    status?: string
    format?: 'json' | 'pdf' | 'excel'
  }): Promise<{
    totalCalls: number
    resolvedCalls: number
    pendingCalls: number
    averageResolutionTime: number
    customerSatisfactionRating: number
    callsByStatus: { status: string; count: number }[]
    callsByPriority: { priority: string; count: number }[]
    callsByCategory: { category: string; count: number }[]
    topIssues: { issue: string; count: number }[]
    downloadUrl?: string
  }> {
    try {
      const response = await apiClient.get<{
        totalCalls: number
        resolvedCalls: number
        pendingCalls: number
        averageResolutionTime: number
        customerSatisfactionRating: number
        callsByStatus: {
          status: string
          count: number
        }[]
        callsByPriority: {
          priority: string
          count: number
        }[]
        callsByCategory: {
          category: string
          count: number
        }[]
        topIssues: {
          issue: string
          count: number
        }[]
        downloadUrl?: string
      }>(
        '/reports/calls-summary',
        filters
      )
      return response.data as {
        totalCalls: number
        resolvedCalls: number
        pendingCalls: number
        averageResolutionTime: number
        customerSatisfactionRating: number
        callsByStatus: { status: string; count: number }[]
        callsByPriority: { priority: string; count: number }[]
        callsByCategory: { category: string; count: number }[]
        topIssues: { issue: string; count: number }[]
        downloadUrl?: string
      }
    } catch (error) {
      handleApiError(error, { service: 'ReportsService', method: 'getCallsSummaryReport' })
      throw error
    }
  }

  /**
   * Get technician performance report
   */
  static async getTechnicianPerformanceReport(filters: {
    dateFrom: string
    dateTo: string
    technicianId?: number
    workUnit?: string
    format?: 'json' | 'pdf' | 'excel'
  }): Promise<{
    technicians: {
      id: number
      name: string
      email: string
      workUnit: string
      callsAssigned: number
      callsResolved: number
      averageResolutionTime: number
      customerSatisfactionRating: number
      totalTimeSpent: number
      efficiency: number
    }[]
    summary: {
      totalTechnicians: number
      averageResolutionTime: number
      averageCustomerSatisfaction: number
      totalCallsHandled: number
    }
    downloadUrl?: string
  }> {
    try {
      const response = await apiClient.get<{
        technicians: {
          id: number
          name: string
          email: string
          workUnit: string
          callsAssigned: number
          callsResolved: number
          averageResolutionTime: number
          customerSatisfactionRating: number
          totalTimeSpent: number
          efficiency: number
        }[]
        summary: {
          totalTechnicians: number
          averageResolutionTime: number
          averageCustomerSatisfaction: number
          totalCallsHandled: number
        }
        downloadUrl?: string
      }>(
        '/reports/technician-performance',
        filters
      )
      return response.data as {
        technicians: {
          id: number
          name: string
          email: string
          workUnit: string
          callsAssigned: number
          callsResolved: number
          averageResolutionTime: number
          customerSatisfactionRating: number
          totalTimeSpent: number
          efficiency: number
        }[]
        summary: {
          totalTechnicians: number
          averageResolutionTime: number
          averageCustomerSatisfaction: number
          totalCallsHandled: number
        }
        downloadUrl?: string
      }
    } catch (error) {
      handleApiError(error, { service: 'ReportsService', method: 'getTechnicianPerformanceReport' })
      throw error
    }
  }

  /**
   * Get customer satisfaction report
   */
  static async getCustomerSatisfactionReport(filters: {
    dateFrom: string
    dateTo: string
    workUnit?: string
    category?: string
    format?: 'json' | 'pdf' | 'excel'
  }): Promise<{
    overallRating: number
    totalResponses: number
    ratingDistribution: { rating: number; count: number; percentage: number }[]
    trendData: { period: string; rating: number; responses: number }[]
    byCategory: { category: string; rating: number; responses: number }[]
    byTechnician: { technicianId: number; name: string; rating: number; responses: number }[]
    feedback: { rating: number; comment: string; date: string; category: string }[]
    downloadUrl?: string
  }> {
    try {
      const response = await apiClient.get<{
        overallRating: number
        totalResponses: number
        ratingDistribution: {
          rating: number
          count: number
          percentage: number
        }[]
        trendData: {
          period: string
          rating: number
          responses: number
        }[]
        byCategory: {
          category: string
          rating: number
          responses: number
        }[]
        byTechnician: {
          technicianId: number
          name: string
          rating: number
          responses: number
        }[]
        feedback: {
          rating: number
          comment: string
          date: string
          category: string
        }[]
        downloadUrl?: string
      }>(
        '/reports/customer-satisfaction',
        filters
      )
      return response.data as {
        overallRating: number
        totalResponses: number
        ratingDistribution: { rating: number; count: number; percentage: number }[]
        trendData: { period: string; rating: number; responses: number }[]
        byCategory: { category: string; rating: number; responses: number }[]
        byTechnician: { technicianId: number; name: string; rating: number; responses: number }[]
        feedback: { rating: number; comment: string; date: string; category: string }[]
        downloadUrl?: string
      }
    } catch (error) {
      handleApiError(error, { service: 'ReportsService', method: 'getCustomerSatisfactionReport' })
      throw error
    }
  }

  /**
   * Get SLA compliance report
   */
  static async getSLAComplianceReport(filters: {
    dateFrom: string
    dateTo: string
    workUnit?: string
    priority?: string
    format?: 'json' | 'pdf' | 'excel'
  }): Promise<{
    overallCompliance: number
    totalCalls: number
    breachedCalls: number
    complianceByPriority: {
      priority: string
      compliance: number
      totalCalls: number
      breachedCalls: number
      averageResolutionTime: number
      slaTarget: number
    }[]
    complianceByCategory: {
      category: string
      compliance: number
      totalCalls: number
      breachedCalls: number
    }[]
    complianceByTechnician: {
      technicianId: number
      name: string
      compliance: number
      totalCalls: number
      breachedCalls: number
    }[]
    trendData: { period: string; compliance: number; totalCalls: number }[]
    downloadUrl?: string
  }> {
    try {
      const response = await apiClient.get<{
        overallCompliance: number
        totalCalls: number
        breachedCalls: number
        complianceByPriority: {
          priority: string
          compliance: number
          totalCalls: number
          breachedCalls: number
          averageResolutionTime: number
          slaTarget: number
        }[]
        complianceByCategory: {
          category: string
          compliance: number
          totalCalls: number
          breachedCalls: number
          averageResolutionTime: number
          slaTarget: number
        }[]
        complianceByTechnician: {
          technicianId: number
          name: string
          compliance: number
          totalCalls: number
          breachedCalls: number
        }[]
        trendData: {
          period: string
          compliance: number
          totalCalls: number
          breachedCalls: number
        }[]
        downloadUrl?: string
      }>(
        '/reports/sla-compliance',
        filters
      )
      return response.data as {
        overallCompliance: number
        totalCalls: number
        breachedCalls: number
        complianceByPriority: {
          priority: string
          compliance: number
          totalCalls: number
          breachedCalls: number
          averageResolutionTime: number
          slaTarget: number
        }[]
        complianceByCategory: {
          category: string
          compliance: number
          totalCalls: number
          breachedCalls: number
        }[]
        complianceByTechnician: {
          technicianId: number
          name: string
          compliance: number
          totalCalls: number
          breachedCalls: number
        }[]
        trendData: { period: string; compliance: number; totalCalls: number }[]
        downloadUrl?: string
      }
    } catch (error) {
      handleApiError(error, { service: 'ReportsService', method: 'getSLAComplianceReport' })
      throw error
    }
  }

  /**
   * Get workload distribution report
   */
  static async getWorkloadDistributionReport(filters: {
    dateFrom: string
    dateTo: string
    format?: 'json' | 'pdf' | 'excel'
  }): Promise<{
    workUnits: {
      name: string
      totalCalls: number
      activeCalls: number
      resolvedCalls: number
      averageResolutionTime: number
      techniciansCount: number
      workloadPerTechnician: number
    }[]
    summary: {
      totalWorkUnits: number
      totalCalls: number
      averageWorkloadPerUnit: number
      mostBusyUnit: string
      leastBusyUnit: string
    }
    downloadUrl?: string
  }> {
    try {
      const response = await apiClient.get<{
        workUnits: {
          name: string
          totalCalls: number
          activeCalls: number
          resolvedCalls: number
          averageResolutionTime: number
          techniciansCount: number
          workloadPerTechnician: number
        }[]
        summary: {
          totalWorkUnits: number
          totalCalls: number
          averageWorkloadPerUnit: number
          mostBusyUnit: string
          leastBusyUnit: string
        }
        downloadUrl?: string
      }>(
        '/reports/workload-distribution',
        filters
      )
      return response.data as {
        workUnits: {
          name: string
          totalCalls: number
          activeCalls: number
          resolvedCalls: number
          averageResolutionTime: number
          techniciansCount: number
          workloadPerTechnician: number
        }[]
        summary: {
          totalWorkUnits: number
          totalCalls: number
          averageWorkloadPerUnit: number
          mostBusyUnit: string
          leastBusyUnit: string
        }
        downloadUrl?: string
      }
    } catch (error) {
      handleApiError(error, { service: 'ReportsService', method: 'getWorkloadDistributionReport' })
      throw error
    }
  }

  /**
   * Get system usage report
   */
  static async getSystemUsageReport(filters: {
    dateFrom: string
    dateTo: string
    format?: 'json' | 'pdf' | 'excel'
  }): Promise<{
    userActivity: {
      totalUsers: number
      activeUsers: number
      totalLogins: number
      averageSessionDuration: number
      peakUsageHours: { hour: number; userCount: number }[]
    }
    systemMetrics: {
      averageResponseTime: number
      uptime: number
      errorRate: number
      peakLoad: number
    }
    featureUsage: {
      feature: string
      usageCount: number
      uniqueUsers: number
    }[]
    downloadUrl?: string
  }> {
    try {
      const response = await apiClient.get<{
        userActivity: {
          totalUsers: number
          activeUsers: number
          totalLogins: number
          averageSessionDuration: number
          peakUsageHours: {
            hour: number
            userCount: number
          }[]
        }
        systemMetrics: {
          averageResponseTime: number
          uptime: number
          errorRate: number
          peakLoad: number
        }
        featureUsage: {
          feature: string
          usageCount: number
          uniqueUsers: number
          averageUsageTime: number
        }[]
        downloadUrl?: string
      }>(
        '/reports/system-usage',
        filters
      )
      return response.data as {
        userActivity: {
          totalUsers: number
          activeUsers: number
          totalLogins: number
          averageSessionDuration: number
          peakUsageHours: { hour: number; userCount: number }[]
        }
        systemMetrics: {
          averageResponseTime: number
          uptime: number
          errorRate: number
          peakLoad: number
        }
        featureUsage: {
          feature: string
          usageCount: number
          uniqueUsers: number
        }[]
        downloadUrl?: string
      }
    } catch (error) {
      handleApiError(error, { service: 'ReportsService', method: 'getSystemUsageReport' })
      throw error
    }
  }

  /**
   * Get custom report
   */
  static async getCustomReport(config: {
    name: string
    description?: string
    dateFrom: string
    dateTo: string
    metrics: string[]
    groupBy?: string[]
    filters?: Record<string, any>
    format?: 'json' | 'pdf' | 'excel'
  }): Promise<{
    reportType: string
    dateRange: { start: string; end: string }
    data: Array<Record<string, any>>
    summary: {
      totalRecords: number
      generatedAt: string
      filters: Record<string, any>
    }
    columns: Array<{
      key: string
      label: string
      type: string
    }>
    downloadUrl?: string
  }> {
    try {
      const response = await apiClient.post(
        '/reports/custom',
        config
      )
      return response.data as {
        reportType: string;
        dateRange: { start: string; end: string };
        data: Array<Record<string, any>>;
        summary: {
          totalRecords: number;
          generatedAt: string;
          filters: Record<string, any>;
        };
        columns: Array<{
          key: string;
          label: string;
          type: string;
        }>;
        downloadUrl?: string;
      }
    } catch (error) {
      handleApiError(error, { service: 'ReportsService', method: 'getCustomReport' })
      throw error
    }
  }

  /**
   * Get available report templates
   */
  static async getReportTemplates(): Promise<{
    id: string
    name: string
    description: string
    category: string
    parameters: {
      name: string
      type: string
      required: boolean
      defaultValue?: any
      options?: any[]
    }[]
  }[]> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.REPORTS.TEMPLATES)
      return response.data as {
        id: string;
        name: string;
        description: string;
        category: string;
        parameters: {
          name: string;
          type: string;
          required: boolean;
          defaultValue?: any;
          options?: any[];
        }[];
      }[]
    } catch (error) {
      handleApiError(error, { service: 'ReportsService', method: 'getReportTemplates' })
      throw error
    }
  }

  /**
   * Schedule a recurring report
   */
  static async scheduleReport(config: {
    templateId: string
    name: string
    description?: string
    parameters: Record<string, any>
    schedule: {
      frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
      time: string // HH:mm format
      dayOfWeek?: number // 0-6 for weekly
      dayOfMonth?: number // 1-31 for monthly
    }
    recipients: string[]
    format: 'pdf' | 'excel'
    isActive: boolean
  }): Promise<{ id: number }> {
    try {
      const response = await apiClient.post(
        '/reports/schedule',
        config
      )
      return response.data as { id: number }
    } catch (error) {
      handleApiError(error, { service: 'ReportsService', method: 'scheduleReport' })
      throw error
    }
  }

  /**
   * Get scheduled reports
   */
  static async getScheduledReports(): Promise<{
    id: number
    name: string
    description?: string
    templateId: string
    templateName: string
    schedule: {
      frequency: string
      time: string
      dayOfWeek?: number
      dayOfMonth?: number
    }
    recipients: string[]
    format: string
    isActive: boolean
    lastRun?: string
    nextRun: string
    createdAt: string
  }[]> {
    try {
      const response = await apiClient.get('/reports/scheduled')
      return response.data as {
        id: number
        name: string
        description?: string
        templateId: string
        templateName: string
        schedule: {
          frequency: string
          time: string
          dayOfWeek?: number
          dayOfMonth?: number
        }
        recipients: string[]
        format: string
        isActive: boolean
        lastRun?: string
        nextRun: string
        createdAt: string
      }[]
    } catch (error) {
      handleApiError(error, { service: 'ReportsService', method: 'getScheduledReports' })
      throw error
    }
  }

  /**
   * Update scheduled report
   */
  static async updateScheduledReport(
    id: number,
    updates: Partial<{
      name: string
      description: string
      parameters: Record<string, any>
      schedule: {
        frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
        time: string
        dayOfWeek?: number
        dayOfMonth?: number
      }
      recipients: string[]
      format: 'pdf' | 'excel'
      isActive: boolean
    }>
  ): Promise<void> {
    try {
      const response = await apiClient.patch(
        `/reports/scheduled/${id}`,
        updates
      )
      // No return needed for void methods
    } catch (error) {
      handleApiError(error, { service: 'ReportsService', method: 'updateScheduledReport' })
      throw error
    }
  }

  /**
   * Delete scheduled report
   */
  static async deleteScheduledReport(id: number): Promise<void> {
    try {
      const response = await apiClient.delete(`/reports/scheduled/${id}`)
      handleApiResponse(response)
    } catch (error) {
      handleApiError(error, { service: 'ReportsService', method: 'deleteScheduledReport' })
      throw error
    }
  }

  /**
   * Get report execution history
   */
  static async getReportHistory(filters?: {
    reportId?: number
    templateId?: string
    status?: 'pending' | 'processing' | 'completed' | 'failed'
    dateFrom?: string
    dateTo?: string
  }): Promise<{
    id: number
    reportId?: number
    templateId?: string
    templateName: string
    status: string
    startedAt: string
    completedAt?: string
    duration?: number
    fileSize?: number
    downloadUrl?: string
    error?: string
  }[]> {
    try {
      const response = await apiClient.get(
        '/reports/history',
        filters
      )
      return response.data as {
        id: number
        reportId?: number
        templateId?: string
        templateName: string
        status: string
        startedAt: string
        completedAt?: string
        duration?: number
        fileSize?: number
        downloadUrl?: string
        error?: string
      }[]
    } catch (error) {
      handleApiError(error, { service: 'ReportsService', method: 'getReportHistory' })
      throw error
    }
  }
}

export default ReportsService