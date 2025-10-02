"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  ChevronRight,
  Home,
  Clock,
  User,
  Settings,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

interface TopNavbarProps {
  sidebarCollapsed: boolean;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
  createdAt: string;
}

const routeLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/chamados": "Chamados",
  "/area-do-tecnico": "Área do Técnico",
  "/relatorios": "Relatórios",
  "/administracao": "Administração",
  "/administracao/usuarios": "Usuários",
  "/administracao/configuracoes-dashboard": "Configurações do Dashboard",
};

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/chamados" }];

  let currentPath = "";
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label =
      routeLabels[currentPath] ||
      segment.charAt(0).toUpperCase() + segment.slice(1);

    breadcrumbs.push({
      label,
      href: index === segments.length - 1 ? undefined : currentPath,
    });
  });

  return breadcrumbs;
}

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "info":
      return <Bell className="h-4 w-4 text-blue-500" />;
    case "success":
      return <Bell className="h-4 w-4 text-green-500" />;
    case "warning":
      return <Bell className="h-4 w-4 text-yellow-500" />;
    case "error":
      return <Bell className="h-4 w-4 text-red-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

export function TopNavbar({ sidebarCollapsed }: TopNavbarProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const breadcrumbs = useMemo(() => generateBreadcrumbs(pathname), [pathname]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );
  const recentNotifications = useMemo(
    () => notifications.slice(0, 5),
    [notifications]
  );

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);

        // TODO: Replace with actual API call to Go backend
        // const response = await fetch('/api/notifications', {
        //   headers: {
        //     'Authorization': `Bearer ${user?.token}`,
        //   },
        // });
        // const data = await response.json();

        // For now, set empty array until backend is ready
        setNotifications([]);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      // TODO: Replace with actual API call to Go backend
      // await fetch(`/api/notifications/${id}/read`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${user?.token}`,
      //   },
      // });

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      // TODO: Replace with actual API call to Go backend
      // await fetch('/api/notifications/read-all', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${user?.token}`,
      //   },
      // });

      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  }, []);

  return (
    <header
      className={cn(
        "flex items-center justify-between h-16 px-6 bg-background border-b transition-all duration-300",
        sidebarCollapsed ? "ml-16" : "ml-64"
      )}
    >
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-foreground transition-colors flex items-center"
              >
                {index === 0 && <Home className="h-4 w-4 mr-1" />}
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium flex items-center">
                {index === 0 && <Home className="h-4 w-4 mr-1" />}
                {item.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Right side actions */}
      <div className="flex items-center space-x-2">
        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end">
            <div className="flex items-center justify-between p-2">
              <h3 className="font-semibold text-sm">Notificações</h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs h-6 px-2"
                >
                  Marcar todas como lidas
                </Button>
              )}
            </div>
            <DropdownMenuSeparator />

            {loading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Carregando notificações...
              </div>
            ) : recentNotifications.length > 0 ? (
              <>
                <div className="max-h-80 overflow-y-auto">
                  {recentNotifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={cn(
                        "flex items-start space-x-3 p-3 cursor-pointer",
                        !notification.read && "bg-muted/50"
                      )}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground truncate">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {notification.time}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>

                {notifications.length > 5 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link
                        href="/notificacoes"
                        className="flex items-center justify-center p-2 text-sm font-medium text-primary hover:text-primary/80"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver todas as notificações
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Nenhuma notificação
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6" />

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}
