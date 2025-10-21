"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { GoAuthService, NotificationsService } from "@/services";
import { UserResponse, NotificationResponse } from "@/types/api";
import { UserRole } from "@/types/auth";
import { BackendUser } from "@/types/backend";
import { apiClient } from "@/lib/api-client";

// Application state interface
interface AppState {
  // Authentication
  user: BackendUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // UI State
  sidebarCollapsed: boolean;
  theme: "light" | "dark" | "system";

  // Notifications
  notifications: NotificationResponse[];
  unreadCount: number;

  // Global loading states
  globalLoading: boolean;

  // Error handling
  globalError: string | null;
}

// Action types
type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: BackendUser | null }
  | { type: "SET_AUTHENTICATED"; payload: boolean }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_SIDEBAR_COLLAPSED"; payload: boolean }
  | { type: "SET_THEME"; payload: "light" | "dark" | "system" }
  | { type: "SET_NOTIFICATIONS"; payload: NotificationResponse[] }
  | { type: "SET_UNREAD_COUNT"; payload: number }
  | { type: "ADD_NOTIFICATION"; payload: NotificationResponse }
  | { type: "MARK_NOTIFICATION_READ"; payload: number }
  | { type: "REMOVE_NOTIFICATION"; payload: number }
  | { type: "SET_GLOBAL_LOADING"; payload: boolean }
  | { type: "SET_GLOBAL_ERROR"; payload: string | null }
  | { type: "CLEAR_ERROR" }
  | { type: "RESET_STATE" };

// Initial state
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  sidebarCollapsed: false,
  theme: "system",
  notifications: [],
  unreadCount: 0,
  globalLoading: false,
  globalError: null,
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: action.payload !== null,
      };

    case "SET_AUTHENTICATED":
      return { ...state, isAuthenticated: action.payload };

    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };

    case "SET_SIDEBAR_COLLAPSED":
      return { ...state, sidebarCollapsed: action.payload };

    case "SET_THEME":
      return { ...state, theme: action.payload };

    case "SET_NOTIFICATIONS":
      return { ...state, notifications: action.payload };

    case "SET_UNREAD_COUNT":
      return { ...state, unreadCount: action.payload };

    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };

    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload
            ? { ...notification, isRead: true }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };

    case "REMOVE_NOTIFICATION":
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload
        ),
        unreadCount:
          notification && !notification.isRead
            ? Math.max(0, state.unreadCount - 1)
            : state.unreadCount,
      };

    case "SET_GLOBAL_LOADING":
      return { ...state, globalLoading: action.payload };

    case "SET_GLOBAL_ERROR":
      return { ...state, globalError: action.payload };

    case "CLEAR_ERROR":
      return { ...state, globalError: null };

    case "RESET_STATE":
      return { ...initialState, isLoading: false };

    default:
      return state;
  }
}

// Context interface
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;

  // Authentication actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;

  // UI actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;

  // Notification actions
  loadNotifications: () => Promise<void>;
  markNotificationAsRead: (id: number) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  removeNotification: (id: number) => Promise<void>;

  // Utility functions
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  clearError: () => void;
  setGlobalLoading: (loading: boolean) => void;
  setGlobalError: (error: string | null) => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize app on mount
  useEffect(() => {
    initializeApp();
  }, []);

  // Theme effect
  useEffect(() => {
    const root = window.document.documentElement;

    if (state.theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.toggle("dark", systemTheme === "dark");
    } else {
      root.classList.toggle("dark", state.theme === "dark");
    }
  }, [state.theme]);

  // Notification polling effect
  useEffect(() => {
    if (state.isAuthenticated) {
      const interval = setInterval(() => {
        loadNotifications();
      }, 30000); // Poll every 30 seconds

      return () => clearInterval(interval);
    }
  }, [state.isAuthenticated]);

  // Initialize application
  const initializeApp = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      // Check if user is already authenticated
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const user = await GoAuthService.getCurrentUser();
          dispatch({ type: "SET_USER", payload: user });
          await loadNotifications();
        } catch (error) {
          // Token might be expired, try to refresh
          try {
            // Usar TokenManager diretamente para tentar refresh
            const refreshToken = localStorage.getItem("refresh_token");
            if (refreshToken) {
              // Fazer refresh manualmente usando fetch
              const refreshResponse = await fetch(
                `${process.env.NEXT_PUBLIC_GO_API_URL}/auth/refresh`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ refresh_token: refreshToken }),
                }
              );

              if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json();
                if (refreshData.access_token) {
                  localStorage.setItem(
                    "access_token",
                    refreshData.access_token
                  );
                  if (refreshData.refresh_token) {
                    localStorage.setItem(
                      "refresh_token",
                      refreshData.refresh_token
                    );
                  }
                  const user = await GoAuthService.getCurrentUser();
                  dispatch({ type: "SET_USER", payload: user });
                  await loadNotifications();
                } else {
                  throw new Error("Failed to refresh token");
                }
              } else {
                throw new Error("Failed to refresh token");
              }
            } else {
              throw new Error("No refresh token available");
            }
          } catch (refreshError) {
            // Refresh failed, clear tokens
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            dispatch({ type: "SET_USER", payload: null });
          }
        }
      }

      // Load theme from localStorage
      const savedTheme = localStorage.getItem("theme") as
        | "light"
        | "dark"
        | "system";
      if (savedTheme) {
        dispatch({ type: "SET_THEME", payload: savedTheme });
      }

      // Load sidebar state from localStorage
      const sidebarCollapsed =
        localStorage.getItem("sidebar-collapsed") === "true";
      dispatch({ type: "SET_SIDEBAR_COLLAPSED", payload: sidebarCollapsed });
    } catch (error) {
      dispatch({
        type: "SET_GLOBAL_ERROR",
        payload: "Failed to initialize application",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Authentication actions
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: "SET_GLOBAL_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const response = await GoAuthService.login({ login: email, password });

      // Store tokens
      localStorage.setItem("access_token", response.accessToken);
      if (response.refreshToken) {
        localStorage.setItem("refresh_token", response.refreshToken);
      }

      // User is already in the response
      dispatch({ type: "SET_USER", payload: response.user });

      // Load notifications
      await loadNotifications();
    } catch (error: any) {
      dispatch({
        type: "SET_GLOBAL_ERROR",
        payload: error.message || "Login failed",
      });
      throw error;
    } finally {
      dispatch({ type: "SET_GLOBAL_LOADING", payload: false });
    }
  };

  const logout = async () => {
    try {
      dispatch({ type: "SET_GLOBAL_LOADING", payload: true });

      await GoAuthService.logout();

      // Clear tokens
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      // Reset state
      dispatch({ type: "RESET_STATE" });
    } catch (error) {
      // Handle logout error silently - Even if logout fails, clear local state
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      dispatch({ type: "RESET_STATE" });
    } finally {
      dispatch({ type: "SET_GLOBAL_LOADING", payload: false });
    }
  };

  const refreshAuth = async () => {
    try {
      // GoAuthService não tem refreshToken implementado ainda, usar api-client diretamente
      const refreshed = await (apiClient as any).refreshToken();
      if (refreshed) {
        const user = await GoAuthService.getCurrentUser();
        dispatch({ type: "SET_USER", payload: user });
      } else {
        throw new Error("Failed to refresh token");
      }
    } catch (error) {
      // Refresh failed, logout user
      await logout();
      throw error;
    }
  };

  // UI actions
  const toggleSidebar = () => {
    dispatch({ type: "TOGGLE_SIDEBAR" });
    localStorage.setItem(
      "sidebar-collapsed",
      (!state.sidebarCollapsed).toString()
    );
  };

  const setSidebarCollapsed = (collapsed: boolean) => {
    dispatch({ type: "SET_SIDEBAR_COLLAPSED", payload: collapsed });
    localStorage.setItem("sidebar-collapsed", collapsed.toString());
  };

  const setTheme = (theme: "light" | "dark" | "system") => {
    dispatch({ type: "SET_THEME", payload: theme });
    localStorage.setItem("theme", theme);
  };

  // Notification actions
  const loadNotifications = async () => {
    try {
      const [notifications, unreadCount] = await Promise.all([
        NotificationsService.getRecentNotifications(20),
        NotificationsService.getUnreadCount(),
      ]);

      dispatch({ type: "SET_NOTIFICATIONS", payload: notifications });
      dispatch({ type: "SET_UNREAD_COUNT", payload: unreadCount.count || 0 });
    } catch (error) {
      // Handle notification loading error silently
    }
  };

  const markNotificationAsRead = async (id: number) => {
    try {
      await NotificationsService.markAsRead(id);
      dispatch({ type: "MARK_NOTIFICATION_READ", payload: id });
    } catch (error) {
      // Handle notification marking error silently
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await NotificationsService.markAllAsRead();
      dispatch({ type: "SET_UNREAD_COUNT", payload: 0 });
      dispatch({
        type: "SET_NOTIFICATIONS",
        payload: state.notifications.map((n) => ({ ...n, isRead: true })),
      });
    } catch (error) {
      // Handle bulk notification marking error silently
    }
  };

  const removeNotification = async (id: number) => {
    try {
      await NotificationsService.deleteNotification(id);
      dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
    } catch (error) {
      // Handle notification removal error silently
    }
  };

  // Utility functions
  const hasRole = (role: UserRole): boolean => {
    if (!state.user) return false;
    // Mapear permissão do backend Go para role do frontend
    const roleMap: { [key: string]: UserRole } = {
      USR: "user",
      ADM: "admin",
      SUP: "technician",
      DEV: "developer",
    };
    const userRole = roleMap[state.user.permissao] || "user";
    return userRole === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!state.user) return false;
    // Mapear permissão do backend Go para role do frontend
    const roleMap: { [key: string]: UserRole } = {
      USR: "user",
      ADM: "admin",
      SUP: "technician",
      DEV: "developer",
    };
    const userRole = roleMap[state.user.permissao] || "user";
    return roles.includes(userRole);
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const setGlobalLoading = (loading: boolean) => {
    dispatch({ type: "SET_GLOBAL_LOADING", payload: loading });
  };

  const setGlobalError = (error: string | null) => {
    dispatch({ type: "SET_GLOBAL_ERROR", payload: error });
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    login,
    logout,
    refreshAuth,
    toggleSidebar,
    setSidebarCollapsed,
    setTheme,
    loadNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification,
    hasRole,
    hasAnyRole,
    clearError,
    setGlobalLoading,
    setGlobalError,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

// Hook to use the app context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

// Selector hooks for specific parts of state
export function useAuth() {
  const { state, login, logout, refreshAuth } = useApp();
  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login,
    logout,
    refreshAuth,
  };
}

export function useTheme() {
  const { state, setTheme } = useApp();
  return {
    theme: state.theme,
    setTheme,
  };
}

export function useSidebar() {
  const { state, toggleSidebar, setSidebarCollapsed } = useApp();
  return {
    isCollapsed: state.sidebarCollapsed,
    toggle: toggleSidebar,
    setCollapsed: setSidebarCollapsed,
  };
}

export function useNotifications() {
  const {
    state,
    loadNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification,
  } = useApp();

  return {
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    loadNotifications,
    markAsRead: markNotificationAsRead,
    markAllAsRead: markAllNotificationsAsRead,
    remove: removeNotification,
  };
}

export function usePermissions() {
  const { hasRole, hasAnyRole } = useApp();
  return {
    hasRole,
    hasAnyRole,
    isAdmin: hasRole("admin"),
    isTechnician: hasAnyRole(["admin", "technician"]),
    isDeveloper: hasRole("developer"),
  };
}
