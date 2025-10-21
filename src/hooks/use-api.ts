import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  AuthService,
  CallsService,
  UsersService,
  DashboardService,
  ReportsService,
  SettingsService,
  NotificationsService,
  ServiceUtils,
  SERVICES_CONFIG,
} from "@/services";
import {
  PaginationParams,
  PaginatedResponse,
  CallResponse,
  UserResponse,
  NotificationResponse,
  DashboardStats,
  CallFilters,
  UserFilters,
} from "@/types/api";
import { AppError, ErrorHandler } from "@/lib/error-handler";

// Generic API state interface
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Generic API hook
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = [],
  options: {
    immediate?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
  } = {}
) {
  const { immediate = true, onSuccess, onError } = options;
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });
  const mountedRef = useRef(true);

  const execute = useCallback(async () => {
    console.log("🎯 useApi.execute - Iniciando execução");
    console.log("🔍 useApi.execute - mountedRef.current:", mountedRef.current);
    if (!mountedRef.current) {
      console.log("❌ useApi.execute - Componente não montado, cancelando");
      return;
    }

    console.log("⏳ useApi.execute - Definindo loading=true");
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      console.log("📞 useApi.execute - Chamando apiCall()");
      const data = await apiCall();
      console.log("✅ useApi.execute - apiCall retornou:", data);

      if (mountedRef.current) {
        console.log(
          "💾 useApi.execute - Salvando dados e definindo loading=false"
        );
        setState({ data, loading: false, error: null });
        onSuccess?.(data);
      }
      return data;
    } catch (error) {
      console.log("❌ useApi.execute - Erro capturado:", error);
      const errorMessage =
        error instanceof AppError
          ? ErrorHandler.getUserFriendlyMessage(error)
          : ErrorHandler.formatErrorMessage(error);

      if (mountedRef.current) {
        setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
        onError?.(errorMessage);
      }
      throw error;
    }
  }, dependencies);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  useEffect(() => {
    mountedRef.current = true;
    console.log(
      "🔧 useApi - Componente montado, mountedRef.current:",
      mountedRef.current
    );
    return () => {
      console.log(
        "🔧 useApi - Componente desmontado, definindo mountedRef.current = false"
      );
      mountedRef.current = false;
    };
  }, []);

  return useMemo(
    () => ({
      ...state,
      execute,
      refetch: execute,
    }),
    [state, execute]
  );
}

// Mutation hook for API calls that modify data
export function useMutation<TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: string, variables: TVariables) => void;
    onSettled?: (
      data: TData | null,
      error: string | null,
      variables: TVariables
    ) => void;
  } = {}
) {
  const { onSuccess, onError, onSettled } = options;
  const [state, setState] = useState<ApiState<TData>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(
    async (variables: TVariables) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const data = await mutationFn(variables);
        setState({ data, loading: false, error: null });
        onSuccess?.(data, variables);
        onSettled?.(data, null, variables);
        return data;
      } catch (error) {
        const errorMessage =
          error instanceof AppError
            ? ErrorHandler.getUserFriendlyMessage(error)
            : ErrorHandler.formatErrorMessage(error);

        setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
        onError?.(errorMessage, variables);
        onSettled?.(null, errorMessage, variables);
        throw error;
      }
    },
    [mutationFn, onSuccess, onError, onSettled]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return useMemo(
    () => ({
      ...state,
      mutate,
      reset,
    }),
    [state, mutate, reset]
  );
}

// Paginated data hook
export function usePaginatedApi<T>(
  apiCall: (
    pagination: PaginationParams,
    filters?: any
  ) => Promise<PaginatedResponse<T>>,
  initialPagination: Partial<PaginationParams> = {},
  initialFilters: any = {},
  options: {
    immediate?: boolean;
    onSuccess?: (data: PaginatedResponse<T>) => void;
    onError?: (error: string) => void;
  } = {}
) {
  const [pagination, setPagination] = useState<PaginationParams>(
    ServiceUtils.validatePagination(initialPagination)
  );
  const [filters, setFilters] = useState(initialFilters);

  console.log("🔍 usePaginatedApi - Estado atual:", { pagination, filters });

  const { data, loading, error, execute } = useApi(
    () => {
      console.log("🎯 usePaginatedApi - apiCall wrapper sendo executada");
      return apiCall(pagination, filters);
    },
    [pagination, filters],
    options
  );

  const goToPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const changePageSize = useCallback((limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  const changeSorting = useCallback(
    (sortBy: string, sortOrder: "asc" | "desc" = "desc") => {
      setPagination((prev) => ({ ...prev, sortBy, sortOrder, page: 1 }));
    },
    []
  );

  const updateFilters = useCallback((newFilters: any) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setPagination(ServiceUtils.validatePagination(initialPagination));
  }, [initialFilters, initialPagination]);

  return {
    data,
    loading,
    error,
    pagination,
    filters,
    refetch: execute,
    goToPage,
    changePageSize,
    changeSorting,
    updateFilters,
    resetFilters,
  };
}

// Authentication hooks
export function useAuth() {
  const login = useMutation(AuthService.login);
  const logout = useMutation(AuthService.logout);
  const refreshToken = useMutation(AuthService.refreshToken);
  const changePassword = useMutation(AuthService.changePassword);

  return {
    login,
    logout,
    refreshToken,
    changePassword,
  };
}

// Calls hooks
export function useCalls(
  initialPagination?: Partial<PaginationParams>,
  initialFilters?: CallFilters
) {
  return usePaginatedApi(
    CallsService.getCalls,
    initialPagination,
    initialFilters
  );
}

export function useCall(id: number) {
  return useApi(() => CallsService.getCall(id), [id]);
}

export function useCallMutations() {
  const createCall = useMutation(CallsService.createCall);
  const updateCall = useMutation(({ id, data }: { id: number; data: any }) =>
    CallsService.updateCall(id, data)
  );
  const deleteCall = useMutation(CallsService.deleteCall);
  const assignCall = useMutation(
    ({ callId, technicianId }: { callId: number; technicianId: number }) =>
      CallsService.assignCall(callId, technicianId)
  );
  const changeStatus = useMutation(
    ({
      callId,
      status,
      resolution,
    }: {
      callId: number;
      status: any;
      resolution?: string;
    }) => CallsService.changeStatus(callId, status, resolution)
  );

  return {
    createCall,
    updateCall,
    deleteCall,
    assignCall,
    changeStatus,
  };
}

export function useMyAssignedCalls(
  initialPagination?: Partial<PaginationParams>,
  initialFilters?: Omit<CallFilters, "assignedTo">
) {
  return usePaginatedApi(
    CallsService.getMyAssignedCalls,
    initialPagination,
    initialFilters
  );
}

// Users hooks
export function useUsers(
  initialPagination?: Partial<PaginationParams>,
  initialFilters?: UserFilters
) {
  return usePaginatedApi(
    UsersService.getUsers,
    initialPagination,
    initialFilters
  );
}

export function useUser(id: number) {
  return useApi(() => UsersService.getUser(id), [id]);
}

export function useCurrentUser() {
  return useApi(UsersService.getCurrentUser);
}

export function useUserMutations() {
  const createUser = useMutation(UsersService.createUser);
  const updateUser = useMutation(({ id, data }: { id: number; data: any }) =>
    UsersService.updateUser(id, data)
  );
  const deleteUser = useMutation(UsersService.deleteUser);
  const toggleUserStatus = useMutation(UsersService.toggleUserStatus);
  const resetUserPassword = useMutation(UsersService.resetUserPassword);
  const updateProfile = useMutation(UsersService.updateProfile);

  return {
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    resetUserPassword,
    updateProfile,
  };
}

export function useTechnicians() {
  return useApi(UsersService.getTechnicians);
}

// Dashboard hooks
export function useDashboardStats(filters?: any) {
  return useApi(() => DashboardService.getDashboardStats(filters), [filters]);
}

export function useRecentCalls(limit: number = 10) {
  return useApi(() => DashboardService.getRecentCalls(limit), [limit]);
}

export function useDashboardCharts(filters?: any) {
  const callsByStatus = useApi(
    () => DashboardService.getCallsByStatus(filters),
    [filters]
  );
  const callsByPriority = useApi(
    () => DashboardService.getCallsByPriority(filters),
    [filters]
  );
  const callsByCategory = useApi(
    () => DashboardService.getCallsByCategory(filters),
    [filters]
  );
  const technicianPerformance = useApi(
    () => DashboardService.getTechnicianPerformance(filters),
    [filters]
  );
  const monthlyTrends = useApi(
    () => DashboardService.getMonthlyTrends(filters),
    [filters]
  );

  return {
    callsByStatus,
    callsByPriority,
    callsByCategory,
    technicianPerformance,
    monthlyTrends,
  };
}

// Real-time dashboard hook with auto-refresh
export function useRealTimeDashboard(
  filters?: any,
  refreshInterval: number = SERVICES_CONFIG.DASHBOARD_REFRESH_INTERVAL_MS
) {
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout>();

  const dashboardStats = useApi(
    () => DashboardService.getDashboardStats(filters),
    [filters],
    { immediate: true }
  );

  const realTimeMetrics = useApi(DashboardService.getRealTimeMetrics, [], {
    immediate: true,
  });

  useEffect(() => {
    if (isAutoRefresh) {
      intervalRef.current = setInterval(() => {
        dashboardStats.refetch();
        realTimeMetrics.refetch();
      }, refreshInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    isAutoRefresh,
    refreshInterval,
    dashboardStats.refetch,
    realTimeMetrics.refetch,
  ]);

  return {
    dashboardStats,
    realTimeMetrics,
    isAutoRefresh,
    setIsAutoRefresh,
    refreshNow: () => {
      dashboardStats.refetch();
      realTimeMetrics.refetch();
    },
  };
}

// Notifications hooks
export function useNotifications(
  initialPagination?: Partial<PaginationParams>,
  filters?: any
) {
  return usePaginatedApi(
    NotificationsService.getNotifications,
    initialPagination,
    filters
  );
}

export function useUnreadNotificationsCount() {
  return useApi(NotificationsService.getUnreadCount);
}

export function useRecentNotifications(limit: number = 10) {
  return useApi(
    () => NotificationsService.getRecentNotifications(limit),
    [limit]
  );
}

export function useNotificationMutations() {
  const markAsRead = useMutation(NotificationsService.markAsRead);
  const markAllAsRead = useMutation(NotificationsService.markAllAsRead);
  const deleteNotification = useMutation(
    NotificationsService.deleteNotification
  );
  const createNotification = useMutation(
    NotificationsService.createNotification
  );

  return {
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
  };
}

// Settings hooks
export function useSettings() {
  return useApi(SettingsService.getSettings);
}

export function useSettingsMutations() {
  const updateSettings = useMutation(SettingsService.updateSettings);
  const updateGeneralSettings = useMutation(
    SettingsService.updateGeneralSettings
  );
  const updateSecuritySettings = useMutation(
    SettingsService.updateSecuritySettings
  );
  const updateNotificationSettings = useMutation(
    SettingsService.updateNotificationSettings
  );

  return {
    updateSettings,
    updateGeneralSettings,
    updateSecuritySettings,
    updateNotificationSettings,
  };
}

// Reports hooks
export function useReports(filters?: any) {
  return useApi(() => ReportsService.getReports(filters), [filters]);
}

export function useReportMutations() {
  const generateReport = useMutation(ReportsService.generateReport);
  const deleteReport = useMutation(ReportsService.deleteReport);
  const scheduleReport = useMutation(ReportsService.scheduleReport);

  return {
    generateReport,
    deleteReport,
    scheduleReport,
  };
}

// Debounced search hook
export function useDebouncedSearch<T>(
  searchFn: (
    query: string,
    pagination: PaginationParams,
    filters?: any
  ) => Promise<PaginatedResponse<T>>,
  delay: number = 300,
  initialPagination?: Partial<PaginationParams>,
  initialFilters?: any
) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, delay]);

  const searchResults = usePaginatedApi(
    (pagination, filters) => searchFn(debouncedQuery, pagination, filters),
    initialPagination,
    initialFilters,
    { immediate: false }
  );

  useEffect(() => {
    if (debouncedQuery) {
      searchResults.refetch();
    }
  }, [debouncedQuery, searchResults.refetch]);

  return {
    query,
    setQuery,
    debouncedQuery,
    ...searchResults,
  };
}

// File upload hook
export function useFileUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const uploadFile = useCallback(
    async (file: File, onProgress?: (progress: number) => void) => {
      try {
        setIsUploading(true);
        setError(null);

        // TODO: Replace with actual file upload implementation
        // const response = await FileService.upload(file, onProgress);
        // return response;

        // For now, throw an error to indicate not implemented
        throw new Error("File upload not implemented yet");
      } catch (error) {
        const appError = ErrorHandler.createAppError(error);
        setError(appError);
        throw appError;
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  const upload = useMutation(
    async ({
      callId,
      file,
      description,
    }: {
      callId: number;
      file: File;
      description?: string;
    }) => {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate progress updates (in real implementation, this would come from the upload service)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      try {
        const result = await CallsService.uploadAttachment(
          callId,
          file,
          description
        );
        setUploadProgress(100);
        return result;
      } finally {
        clearInterval(progressInterval);
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 500);
      }
    },
    {
      onError: () => {
        setIsUploading(false);
        setUploadProgress(0);
      },
    }
  );

  return {
    upload: upload.mutate,
    uploadFile,
    uploadProgress,
    isUploading,
    error: error || upload.error,
    reset: upload.reset,
  };
}
