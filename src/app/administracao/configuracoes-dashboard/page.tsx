"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  Monitor,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";
import { UserRole } from "@/types/auth";

type DashboardType = "executive" | "operational";

interface DashboardConfig {
  dashboardType: DashboardType;
  showCharts: boolean;
  showFilters: boolean;
  showRecentCalls: boolean;
  showTopPerformers: boolean;
  chartTypes: {
    evolution: boolean;
    status: boolean;
    categories: boolean;
    performance: boolean;
    technicians: boolean;
  };
  refreshInterval: number;
  defaultTimeRange: string;
}

export default function DashboardSettingsPage() {
  const [config, setConfig] = useState<DashboardConfig>({
    dashboardType: "executive",
    showCharts: true,
    showFilters: true,
    showRecentCalls: true,
    showTopPerformers: true,
    chartTypes: {
      evolution: true,
      status: true,
      categories: false,
      performance: true,
      technicians: false,
    },
    refreshInterval: 30,
    defaultTimeRange: "month",
  });

  const handleSave = () => {
    // In a real app, this would save to backend/localStorage
    console.log("Saving dashboard config:", config);
    // You could also use a context or state management library
    localStorage.setItem("dashboardConfig", JSON.stringify(config));
  };

  const updateConfig = (key: keyof DashboardConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const updateChartType = (
    chartType: keyof DashboardConfig["chartTypes"],
    enabled: boolean
  ) => {
    setConfig((prev) => ({
      ...prev,
      chartTypes: {
        ...prev.chartTypes,
        [chartType]: enabled,
      },
    }));
  };

  return (
    <DashboardLayout
      allowedRoles={["admin" as UserRole, "developer" as UserRole]}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Configurações do Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Personalize a visualização e funcionalidades do dashboard
            </p>
          </div>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Salvar Configurações
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dashboard Type */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Tipo de Dashboard
              </CardTitle>
              <CardDescription>
                Escolha o modelo de dashboard mais adequado para sua função
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    config.dashboardType === "executive"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => updateConfig("dashboardType", "executive")}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Dashboard Executivo</h3>
                      <p className="text-sm text-muted-foreground">
                        Foco em métricas gerais, gráficos de evolução e
                        indicadores de performance
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </div>

                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    config.dashboardType === "operational"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => updateConfig("dashboardType", "operational")}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Dashboard Operacional</h3>
                      <p className="text-sm text-muted-foreground">
                        Foco em chamados ativos, atribuições e ranking de
                        técnicos
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      <Clock className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Display Options */}
          <Card>
            <CardHeader>
              <CardTitle>Opções de Exibição</CardTitle>
              <CardDescription>
                Configure quais elementos serão exibidos no dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-charts">Exibir Gráficos</Label>
                <Switch
                  id="show-charts"
                  checked={config.showCharts}
                  onCheckedChange={(checked) =>
                    updateConfig("showCharts", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-filters">Exibir Filtros</Label>
                <Switch
                  id="show-filters"
                  checked={config.showFilters}
                  onCheckedChange={(checked) =>
                    updateConfig("showFilters", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-recent">Chamados Recentes</Label>
                <Switch
                  id="show-recent"
                  checked={config.showRecentCalls}
                  onCheckedChange={(checked) =>
                    updateConfig("showRecentCalls", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-performers">Top Performers</Label>
                <Switch
                  id="show-performers"
                  checked={config.showTopPerformers}
                  onCheckedChange={(checked) =>
                    updateConfig("showTopPerformers", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Chart Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Configuração de Gráficos
              </CardTitle>
              <CardDescription>
                Selecione quais gráficos serão exibidos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="chart-evolution">Evolução dos Chamados</Label>
                <Switch
                  id="chart-evolution"
                  checked={config.chartTypes.evolution}
                  onCheckedChange={(checked) =>
                    updateChartType("evolution", checked)
                  }
                  disabled={!config.showCharts}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="chart-status">Status dos Chamados</Label>
                <Switch
                  id="chart-status"
                  checked={config.chartTypes.status}
                  onCheckedChange={(checked) =>
                    updateChartType("status", checked)
                  }
                  disabled={!config.showCharts}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="chart-categories">Categorias</Label>
                <Switch
                  id="chart-categories"
                  checked={config.chartTypes.categories}
                  onCheckedChange={(checked) =>
                    updateChartType("categories", checked)
                  }
                  disabled={!config.showCharts}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="chart-performance">Performance</Label>
                <Switch
                  id="chart-performance"
                  checked={config.chartTypes.performance}
                  onCheckedChange={(checked) =>
                    updateChartType("performance", checked)
                  }
                  disabled={!config.showCharts}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="chart-technicians">Chamados por Técnico</Label>
                <Switch
                  id="chart-technicians"
                  checked={config.chartTypes.technicians}
                  onCheckedChange={(checked) =>
                    updateChartType("technicians", checked)
                  }
                  disabled={!config.showCharts}
                />
              </div>
            </CardContent>
          </Card>

          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Ajustes de atualização e período padrão
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Intervalo de Atualização</Label>
                <Select
                  value={config.refreshInterval.toString()}
                  onValueChange={(value) =>
                    updateConfig("refreshInterval", parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 segundos</SelectItem>
                    <SelectItem value="30">30 segundos</SelectItem>
                    <SelectItem value="60">1 minuto</SelectItem>
                    <SelectItem value="300">5 minutos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Período Padrão</Label>
                <Select
                  value={config.defaultTimeRange}
                  onValueChange={(value) =>
                    updateConfig("defaultTimeRange", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Hoje</SelectItem>
                    <SelectItem value="week">Esta Semana</SelectItem>
                    <SelectItem value="month">Este Mês</SelectItem>
                    <SelectItem value="quarter">Este Trimestre</SelectItem>
                    <SelectItem value="year">Este Ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Prévia da Configuração</CardTitle>
            <CardDescription>
              Visualize como ficará o dashboard com as configurações atuais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span>Tipo de Dashboard:</span>
                  <Badge
                    variant={
                      config.dashboardType === "executive"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {config.dashboardType === "executive"
                      ? "Executivo"
                      : "Operacional"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Gráficos Habilitados:</span>
                  <span>
                    {Object.values(config.chartTypes).filter(Boolean).length} de
                    4
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Atualização:</span>
                  <span>A cada {config.refreshInterval}s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Período Padrão:</span>
                  <span>
                    {config.defaultTimeRange === "day" && "Hoje"}
                    {config.defaultTimeRange === "week" && "Esta Semana"}
                    {config.defaultTimeRange === "month" && "Este Mês"}
                    {config.defaultTimeRange === "quarter" && "Este Trimestre"}
                    {config.defaultTimeRange === "year" && "Este Ano"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
