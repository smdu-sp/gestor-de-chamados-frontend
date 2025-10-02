"use client";

import React, { useState, useMemo, useCallback } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  Users,
  Clock,
  CheckCircle,
  Star,
  FileText,
  Table,
} from "lucide-react";
import { UserRole } from "@/types/auth";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

// Mock data for reports
const reportData = {
  overview: {
    totalCalls: 1247,
    resolvedCalls: 1089,
    avgResolutionTime: 2.3, // hours
    customerSatisfaction: 94.2, // percentage
    activeCallsChange: 12, // percentage change
    resolutionTimeChange: -8, // percentage change
    satisfactionChange: 3, // percentage change
  },
  callsByCategory: [
    { category: "Hardware", count: 456, percentage: 36.6 },
    { category: "Software", count: 389, percentage: 31.2 },
    { category: "Network", count: 234, percentage: 18.8 },
    { category: "Access", count: 168, percentage: 13.4 },
  ],
  callsByPriority: [
    { priority: "Alta", count: 187, percentage: 15.0, color: "text-red-600" },
    {
      priority: "Média",
      count: 623,
      percentage: 49.9,
      color: "text-yellow-600",
    },
    {
      priority: "Baixa",
      count: 437,
      percentage: 35.1,
      color: "text-green-600",
    },
  ],
  callsByStatus: [
    {
      status: "Resolvidas",
      count: 1089,
      percentage: 87.3,
      color: "text-green-600",
    },
    { status: "Ativas", count: 98, percentage: 7.9, color: "text-blue-600" },
    {
      status: "Pendentes",
      count: 60,
      percentage: 4.8,
      color: "text-orange-600",
    },
  ],
  technicianPerformance: [
    {
      name: "Carlos Santos",
      callsResolved: 234,
      avgResolutionTime: 1.8,
      satisfaction: 96.5,
      efficiency: "Excelente",
    },
    {
      name: "Ana Lima",
      callsResolved: 198,
      avgResolutionTime: 2.1,
      satisfaction: 94.2,
      efficiency: "Muito Bom",
    },
    {
      name: "Pedro Costa",
      callsResolved: 167,
      avgResolutionTime: 2.5,
      satisfaction: 91.8,
      efficiency: "Bom",
    },
    {
      name: "Maria Silva",
      callsResolved: 145,
      avgResolutionTime: 2.8,
      satisfaction: 89.3,
      efficiency: "Regular",
    },
  ],
  monthlyTrend: [
    { month: "Jan", calls: 98, resolved: 89 },
    { month: "Fev", calls: 112, resolved: 98 },
    { month: "Mar", calls: 134, resolved: 121 },
    { month: "Abr", calls: 156, resolved: 142 },
    { month: "Mai", calls: 143, resolved: 134 },
    { month: "Jun", calls: 167, resolved: 156 },
    { month: "Jul", calls: 189, resolved: 178 },
    { month: "Ago", calls: 201, resolved: 187 },
    { month: "Set", calls: 178, resolved: 165 },
    { month: "Out", calls: 156, resolved: 149 },
    { month: "Nov", calls: 134, resolved: 128 },
    { month: "Dez", calls: 89, resolved: 82 },
  ],
  callsByTechnician: [
    { technician: "Carlos Santos", calls: 234 },
    { technician: "Ana Lima", calls: 198 },
    { technician: "Pedro Costa", calls: 167 },
    { technician: "Maria Silva", calls: 145 },
    { technician: "João Oliveira", calls: 123 },
    { technician: "Fernanda Rocha", calls: 98 },
  ],
};

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("last-30-days");
  const [reportType, setReportType] = useState("overview");

  // Função para exportar em CSV
  const exportToCSV = useCallback(() => {
    const csvData = [];

    // Cabeçalho do relatório
    csvData.push(["Relatório de Suporte Técnico"]);
    csvData.push(["Período:", dateRange]);
    csvData.push(["Data de Geração:", new Date().toLocaleDateString("pt-BR")]);
    csvData.push([""]); // Linha em branco

    // Dados gerais
    csvData.push(["RESUMO GERAL"]);
    csvData.push(["Total de Chamados", reportData.overview.totalCalls]);
    csvData.push(["Chamados Resolvidos", reportData.overview.resolvedCalls]);
    csvData.push([
      "Tempo Médio de Resolução (horas)",
      reportData.overview.avgResolutionTime,
    ]);
    csvData.push([
      "Satisfação do Cliente (%)",
      reportData.overview.customerSatisfaction,
    ]);
    csvData.push([""]); // Linha em branco

    // Chamados por categoria
    csvData.push(["CHAMADOS POR CATEGORIA"]);
    csvData.push(["Categoria", "Quantidade", "Percentual"]);
    reportData.callsByCategory.forEach((item) => {
      csvData.push([item.category, item.count, `${item.percentage}%`]);
    });
    csvData.push([""]); // Linha em branco

    // Performance dos técnicos
    csvData.push(["PERFORMANCE DOS TÉCNICOS"]);
    csvData.push([
      "Nome",
      "Chamados Resolvidos",
      "Tempo Médio (horas)",
      "Satisfação (%)",
      "Eficiência",
    ]);
    reportData.technicianPerformance.forEach((tech) => {
      csvData.push([
        tech.name,
        tech.callsResolved,
        tech.avgResolutionTime,
        `${tech.satisfaction}%`,
        tech.efficiency,
      ]);
    });

    // Converter para string CSV
    const csvContent = csvData
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    // Criar e baixar arquivo
    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `relatorio-suporte-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [dateRange]);

  // Função para exportar em PDF (usando jsPDF)
  const exportToPDF = useCallback(() => {
    // Simulação de geração de PDF
    const pdfContent = `
RELATÓRIO DE SUPORTE TÉCNICO
============================

Período: ${dateRange}
Data de Geração: ${new Date().toLocaleDateString("pt-BR")}

RESUMO GERAL
------------
Total de Chamados: ${reportData.overview.totalCalls}
Chamados Resolvidos: ${reportData.overview.resolvedCalls}
Tempo Médio de Resolução: ${reportData.overview.avgResolutionTime} horas
Satisfação do Cliente: ${reportData.overview.customerSatisfaction}%

CHAMADOS POR CATEGORIA
---------------------
${reportData.callsByCategory
  .map((item) => `${item.category}: ${item.count} (${item.percentage}%)`)
  .join("\n")}

PERFORMANCE DOS TÉCNICOS
-----------------------
${reportData.technicianPerformance
  .map(
    (tech) =>
      `${tech.name}: ${tech.callsResolved} chamados, ${tech.avgResolutionTime}h média, ${tech.satisfaction}% satisfação`
  )
  .join("\n")}

TENDÊNCIA MENSAL
---------------
${reportData.monthlyTrend
  .map(
    (month) =>
      `${month.month}: ${month.calls} chamados, ${month.resolved} resolvidos`
  )
  .join("\n")}
    `;

    // Criar blob e baixar como arquivo de texto (simulando PDF)
    const blob = new Blob([pdfContent], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `relatorio-suporte-${new Date().toISOString().split("T")[0]}.txt`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Mostrar mensagem de sucesso
    alert("Relatório PDF gerado com sucesso! (Arquivo .txt para demonstração)");
  }, [dateRange]);

  const getEfficiencyColor = useCallback((efficiency: string) => {
    switch (efficiency) {
      case "Excelente":
        return "text-chart-3";
      case "Muito Bom":
        return "text-chart-4";
      case "Bom":
        return "text-chart-2";
      case "Regular":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  }, []);

  const getEfficiencyBadge = useCallback((efficiency: string) => {
    switch (efficiency) {
      case "Excelente":
        return "default";
      case "Muito Bom":
        return "secondary";
      case "Bom":
        return "outline";
      case "Regular":
        return "destructive";
      default:
        return "outline";
    }
  }, []);

  const { overview } = reportData;

  return (
    <DashboardLayout
      allowedRoles={["admin" as UserRole, "developer" as UserRole]}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
            <p className="text-muted-foreground mt-1">
              Análise e métricas do sistema de suporte
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={exportToPDF}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Exportar como PDF
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={exportToCSV}
                  className="flex items-center gap-2"
                >
                  <Table className="h-4 w-4" />
                  Exportar como CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros de Relatório
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Período</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-7-days">Últimos 7 dias</SelectItem>
                    <SelectItem value="last-30-days">
                      Últimos 30 dias
                    </SelectItem>
                    <SelectItem value="last-90-days">
                      Últimos 90 dias
                    </SelectItem>
                    <SelectItem value="last-year">Último ano</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tipo de Relatório</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Visão Geral</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="trends">Tendências</SelectItem>
                    <SelectItem value="satisfaction">Satisfação</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button className="w-full">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Chamados
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overview.totalCalls.toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                {overview.activeCallsChange > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                )}
                <span
                  className={
                    overview.activeCallsChange > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {Math.abs(overview.activeCallsChange)}%
                </span>
                <span className="ml-1">vs mês anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taxa de Resolução
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {((overview.resolvedCalls / overview.totalCalls) * 100).toFixed(
                  1
                )}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                {overview.resolvedCalls} de {overview.totalCalls} chamados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overview.avgResolutionTime}h
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingDown className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-green-600">
                  {Math.abs(overview.resolutionTimeChange)}%
                </span>
                <span className="ml-1">melhoria</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {overview.customerSatisfaction}%
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-green-600">
                  +{overview.satisfactionChange}%
                </span>
                <span className="ml-1">vs mês anterior</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calls by Category Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Chamados por Categoria</CardTitle>
              <CardDescription>
                Distribuição das chamados por categoria
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ChartContainer
                config={{
                  hardware: {
                    label: "Hardware",
                    color: "hsl(var(--chart-1))",
                  },
                  software: {
                    label: "Software",
                    color: "hsl(var(--chart-2))",
                  },
                  network: {
                    label: "Network",
                    color: "hsl(var(--chart-3))",
                  },
                  access: {
                    label: "Access",
                    color: "hsl(var(--chart-4))",
                  },
                }}
                className="h-80 w-full"
              >
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={reportData.callsByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percentage }) =>
                        `${category} ${percentage}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {reportData.callsByCategory.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`hsl(var(--chart-${index + 1}))`}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Calls by Priority Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Chamados por Prioridade</CardTitle>
              <CardDescription>
                Distribuição das chamados por nível de prioridade
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ChartContainer
                config={{
                  alta: {
                    label: "Alta",
                    color: "hsl(var(--chart-1))",
                  },
                  media: {
                    label: "Média",
                    color: "hsl(var(--chart-2))",
                  },
                  baixa: {
                    label: "Baixa",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-80 w-full"
              >
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={reportData.callsByPriority}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="priority"
                      tickLine={false}
                      axisLine={false}
                      className="text-xs"
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      className="text-xs"
                    />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--chart-2))"
                      name="Chamados"
                      radius={4}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trend and Calls by Technician */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Tendência Mensal</CardTitle>
              <CardDescription>
                Evolução dos chamados ao longo do ano
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ChartContainer
                config={{
                  calls: {
                    label: "Chamados Abertos",
                    color: "hsl(var(--chart-4))",
                  },
                  resolved: {
                    label: "Chamados Resolvidos",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-80 w-full"
              >
                <BarChart data={reportData.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    className="text-xs"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    className="text-xs"
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="calls"
                    fill="hsl(var(--chart-4))"
                    name="Chamados Abertos"
                    radius={4}
                  />
                  <Bar
                    dataKey="resolved"
                    fill="hsl(var(--chart-3))"
                    name="Chamados Resolvidos"
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-chart-4 rounded"></div>
                  <span className="text-sm font-medium">Chamados Abertos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-chart-3 rounded"></div>
                  <span className="text-sm font-medium">
                    Chamados Resolvidos
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calls by Technician Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Chamados por Técnico</CardTitle>
              <CardDescription>
                Número de chamados atendidos por cada técnico
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ChartContainer
                config={{
                  calls: {
                    label: "Chamados",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-80 w-full"
              >
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart
                    data={reportData.callsByTechnician}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="technician"
                      tickLine={false}
                      axisLine={false}
                      className="text-xs"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      className="text-xs"
                    />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="calls"
                      fill="hsl(var(--chart-1))"
                      name="Chamados"
                      radius={4}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
