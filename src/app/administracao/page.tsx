"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditDialog } from "@/components/edit-dialog";
import { DeleteDialog } from "@/components/confrmation-dialog";
import { ViewDetailsDialog } from "@/components/view-details-dialog";
import { SystemNoticesManagement } from "@/components/system-notices-management";
import { useAuth } from "@/contexts/auth-context";
import {
  Users,
  Settings,
  Shield,
  Database,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  HardDrive,
  ArrowRight,
  Megaphone,
  FolderTree,
} from "lucide-react";
import { UserRole } from "@/types/auth";
import Link from "next/link";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalTechnicians: number;
}

interface RecentActivity {
  id: string;
  action: string;
  type: string;
  details: string;
  severity: string;
  timestamp: string;
}

const adminModules = [
  {
    title: "Gerenciar Usuários",
    description: "Adicionar, editar e gerenciar usuários do sistema",
    icon: Users,
    href: "/administracao/usuarios",
    stats: "usuários",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Categorias e Subcategorias",
    description: "Gerenciar categorias e subcategorias de chamados",
    icon: FolderTree,
    href: "/administracao/categorias",
    stats: "Configurar categorias",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  {
    title: "Configurações do Dashboard",
    description: "Personalizar configurações e preferências do sistema",
    icon: Settings,
    href: "/administracao/configuracoes-dashboard",
    stats: "Configurações gerais",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Segurança e Permissões",
    description: "Gerenciar roles e permissões de acesso",
    icon: Shield,
    href: "/administracao/seguranca",
    stats: "4 níveis de acesso",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Backup e Restauração",
    description: "Gerenciar backups e restauração de dados",
    icon: Database,
    href: "/administracao/backup",
    stats: "Último backup: hoje",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
];

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "success":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case "error":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default:
      return <Activity className="h-4 w-4 text-blue-500" />;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("pt-BR");
};

export default function AdministrationPage() {
  const { user } = useAuth();
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalTechnicians: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);

        // TODO: Replace with actual API calls to Go backend
        // const statsResponse = await fetch('/api/admin/stats');
        // const activitiesResponse = await fetch('/api/admin/activities');
        //
        // const stats = await statsResponse.json();
        // const activities = await activitiesResponse.json();
        //
        // setAdminStats(stats);
        // setRecentActivities(activities);

        // Temporary placeholder data
        setAdminStats({
          totalUsers: 0,
          activeUsers: 0,
          inactiveUsers: 0,
          totalTechnicians: 0,
        });
        setRecentActivities([]);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const getFilteredModules = () => {
    if (user?.role === "admin") {
      // Admins veem apenas módulos específicos
      return adminModules.filter(
        (module) =>
          module.title === "Gerenciar Usuários" ||
          module.title === "Configurações do Dashboard"
      );
    }
    // Desenvolvedores veem todos os módulos
    return adminModules;
  };

  const filteredModules = getFilteredModules();

  if (loading) {
    return (
      <DashboardLayout
        allowedRoles={["developer" as UserRole, "admin" as UserRole]}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Carregando dados...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      allowedRoles={["developer" as UserRole, "admin" as UserRole]}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Administração
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerenciar usuários, configurações e sistema
            </p>
          </div>
        </div>

        {/* System Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Usuários
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {adminStats.activeUsers} ativos, {adminStats.inactiveUsers}{" "}
                inativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Técnicos</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {adminStats.totalTechnicians}
              </div>
              <p className="text-xs text-muted-foreground">Técnicos ativos</p>
            </CardContent>
          </Card>
        </div>

        {/* System Notices Management - Only for Developer */}
        {user?.role === "developer" && <SystemNoticesManagement />}

        {/* Administration Modules */}
        <Card>
          <CardHeader>
            <CardTitle>Módulos de Administração</CardTitle>
            <CardDescription>
              Acesse as diferentes áreas de administração do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredModules.map((module, index) => {
                const IconComponent = module.icon;
                return (
                  <Link key={index} href={module.href}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-lg ${module.bgColor}`}>
                            <IconComponent
                              className={`h-6 w-6 ${module.color}`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground mb-1">
                              {module.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {module.description}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {module.title === "Gerenciar Usuários"
                                ? `${adminStats.totalUsers} ${module.stats}`
                                : module.stats}
                            </Badge>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Últimas ações administrativas realizadas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-4 p-3 rounded-lg border"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                      {getSeverityIcon(activity.severity)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">
                          {activity.action}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {activity.details}
                      </p>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(activity.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhuma atividade recente
                </p>
              </div>
            )}
            <div className="mt-4 text-center">
              <Button variant="outline">Ver Todas as Atividades</Button>
            </div>
          </CardContent>
        </Card>

        {/* System Health - Only for Developer */}
        {user?.role === "developer" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Status do Sistema</span>
              </CardTitle>
              <CardDescription>
                Monitoramento em tempo real do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">
                        Sistema Online
                      </p>
                      <p className="text-sm text-green-700">
                        Todos os serviços funcionando
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 border-green-200"
                  >
                    Operacional
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-900">
                        Manutenção Programada
                      </p>
                      <p className="text-sm text-yellow-700">
                        Domingo, 02:00 - 04:00
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-yellow-100 text-yellow-800 border-yellow-200"
                  >
                    Agendado
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
