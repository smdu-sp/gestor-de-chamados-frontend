"use client";

import React, { useState, useEffect } from "react";
import { X, AlertTriangle, Info, Wrench, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "./ui/button";

interface SystemNotice {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "maintenance";
  priority: "low" | "medium" | "high";
  isActive: boolean;
  targetRoles?: string[];
  createdAt: string;
  expiresAt?: string;
}

const getNoticeIcon = (type: SystemNotice["type"]) => {
  switch (type) {
    case "info":
      return <Info className="h-4 w-4" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4" />;
    case "error":
      return <AlertCircle className="h-4 w-4" />;
    case "maintenance":
      return <Wrench className="h-4 w-4" />;
    default:
      return <Info className="h-4 w-4" />;
  }
};

const getNoticeStyles = (type: SystemNotice["type"]) => {
  switch (type) {
    case "info":
      return "bg-blue-50 border-blue-200 text-blue-800";
    case "warning":
      return "bg-yellow-50 border-yellow-200 text-yellow-800";
    case "error":
      return "bg-red-50 border-red-200 text-red-800";
    case "maintenance":
      return "bg-orange-50 border-orange-200 text-orange-800";
    default:
      return "bg-blue-50 border-blue-200 text-blue-800";
  }
};

export function SystemNoticeBar() {
  const { user } = useAuth();
  const [notices, setNotices] = useState<SystemNotice[]>([]);
  const [dismissedNotices, setDismissedNotices] = useState<string[]>([]);

  useEffect(() => {
    const loadNotices = async () => {
      try {
        // TODO: Replace with backend API call
        // const response = await SystemService.getActiveNotices();
        // const activeNotices = response.data.filter(notice => {
        //   if (!notice.isActive) return false;
        //
        //   // Verificar se o aviso é para o role do usuário
        //   if (notice.targetRoles && notice.targetRoles.length > 0) {
        //     return notice.targetRoles.includes(user?.role || "");
        //   }
        //
        //   // Se não tem targetRoles específicos, mostra para todos
        //   return true;
        // });

        // Temporary empty array until backend is implemented
        const activeNotices: SystemNotice[] = [];

        // Carregar avisos dispensados do localStorage
        const dismissed = JSON.parse(
          localStorage.getItem("dismissedNotices") || "[]"
        );
        setDismissedNotices(dismissed);

        // Filtrar avisos não dispensados
        const visibleNotices = activeNotices.filter(
          (notice) => !dismissed.includes(notice.id)
        );
        setNotices(visibleNotices);
      } catch (error) {
        console.error("Error loading system notices:", error);
      }
    };

    loadNotices();
  }, [user]);

  const dismissNotice = (noticeId: string) => {
    const newDismissed = [...dismissedNotices, noticeId];
    setDismissedNotices(newDismissed);
    localStorage.setItem("dismissedNotices", JSON.stringify(newDismissed));
    setNotices(notices.filter((notice) => notice.id !== noticeId));
  };

  if (notices.length === 0) return null;

  return (
    <div className="space-y-1">
      {notices.map((notice) => (
        <div
          key={notice.id}
          className={cn(
            "flex items-center justify-between px-4 py-2 border-b text-sm",
            getNoticeStyles(notice.type)
          )}
        >
          <div className="flex items-center space-x-3 flex-1">
            <div className="flex-shrink-0">{getNoticeIcon(notice.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{notice.title}</span>
                {notice.priority === "high" && (
                  <span className="px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded">
                    URGENTE
                  </span>
                )}
              </div>
              <p className="text-xs opacity-90 mt-0.5">{notice.message}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dismissNotice(notice.id)}
            className="h-6 w-6 p-0 text-current hover:bg-white/20"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
}
