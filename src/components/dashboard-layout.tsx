"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { Sidebar } from "@/components/sidebar";
import { TopNavbar } from "@/components/top-navbar";
import { SystemNoticeBar } from "@/components/system-notice-bar";
import { UserRole } from "@/types/auth";

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function DashboardLayout({
  children,
  allowedRoles,
}: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Carregar estado do localStorage na inicialização
  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-collapsed");
    if (savedState !== null) {
      setSidebarCollapsed(JSON.parse(savedState));
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const newState = !prev;
      // Salvar estado no localStorage
      localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
      return newState;
    });
  }, []);

  const mainClassName = useMemo(
    () =>
      `flex-1 overflow-auto transition-all duration-300 ${
        sidebarCollapsed ? "ml-16" : "ml-64"
      }`,
    [sidebarCollapsed]
  );

  const noticeBarClassName = useMemo(
    () =>
      `transition-all duration-300 ${
        sidebarCollapsed ? "ml-16" : "ml-64"
      }`,
    [sidebarCollapsed]
  );

  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <div className="fixed left-0 top-0 h-full z-30">
          <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <TopNavbar sidebarCollapsed={sidebarCollapsed} />

          {/* System Notice Bar - com margem para respeitar a sidebar */}
          <div className={noticeBarClassName}>
            <SystemNoticeBar />
          </div>

          {/* Page Content */}
          <main className={mainClassName}>
            <div className="p-6">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
