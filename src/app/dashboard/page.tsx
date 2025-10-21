"use client";
import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Phone,
  PhoneCall,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  TrendingUp,
  Plus,
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  Settings,
  Award,
  Target,
} from "lucide-react";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { NewCallWizard } from "@/components/new-call-wizard";
import {
  getStatusBadge,
  getPriorityBadge,
  getUnitBadge,
} from "@/lib/badge-utils";
import Link from "next/link";
import { GoCallsService } from "@/services/go-calls.service";
import { GoCallFilters } from "@/types/go-backend";

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

interface DashboardStats {
  infra: string;
  atic: string;
  tempoMedio: string;
  notaMedia: string;
}

interface RecentCall {
  id: string;
  caller: string;
  issue: string;
  priority: string;
  status: string;
  workUnit: string;
  assignedTo?: string;
  createdAt: string;
}

interface TopPerformer {
  name: string;
  email: string;
  calls: number;
}

interface EvolutionData {
  labels: string[];
  datasets: {
    resolvidos: number[];
    abertos: number[];
    fechados: number[];
  };
}

interface StatusData {
  novo: number;
  fechado: number;
  "em-atendimento": number;
}

interface CallsByTechnician {
  name: string;
  calls: number;
  resolved: number;
  pending: number;
}

export default function DashboardPage() {
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

  const [timeRange, setTimeRange] = useState("month");
  const [loading, setLoading] = useState(true);

  // State for dashboard data
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    infra: "Infraestrutura",
    atic: "ATIC",
    tempoMedio: "2h 30m",
    notaMedia: "4.5",
  });

  const [recentCalls, setRecentCalls] = useState<RecentCall[]>([]);
  const [evolutionData, setEvolutionData] = useState<EvolutionData>({
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: {
      resolvidos: [12, 19, 3, 5, 2, 3],
      abertos: [2, 3, 20, 5, 1, 4],
      fechados: [3, 10, 13, 15, 22, 30],
    },
  });

  const [statusData, setStatusData] = useState<StatusData>({
    novo: 5,
    fechado: 25,
    "em-atendimento": 15,
  });

  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [callsByTechnician, setCallsByTechnician] = useState<
    CallsByTechnician[]
  >([]);

  // Load config from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem("dashboardConfig");
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Carregar chamados recentes do backend Go (apenas para exibição)
        const recentCallsResponse = await GoCallsService.getCalls(
          { page: 1, limit: 10, sortBy: "createdAt", sortOrder: "desc" },
          {} as GoCallFilters
        );

        // Converter os dados para o formato esperado pelo dashboard
        const formattedRecentCalls: RecentCall[] = recentCallsResponse.data.map(
          (call: any) => ({
            id: call.id,
            caller:
              call.caller || call.createdBy?.name || "Usuário não identificado",
            issue: call.title || call.issue || "Problema não especificado",
            priority: call.priority || "low",
            status: call.status || "open",
            workUnit: call.workUnit || "Não informado",
            assignedTo: call.assignedTo?.name || undefined,
            createdAt: call.createdAt || new Date().toISOString(),
          })
        );

        setRecentCalls(formattedRecentCalls);

        // Carregar TODOS os chamados para calcular estatísticas corretas
        const allCallsResponse = await GoCallsService.getCalls(
          { page: 1, limit: 1000, sortBy: "createdAt", sortOrder: "desc" },
          {} as GoCallFilters
        );

        // Calcular estatísticas de status baseadas em TODOS os chamados
        const statusCounts = allCallsResponse.data.reduce(
          (acc: any, call: any) => {
            const status = call.status || "open";
            if (status === "open") acc.novo = (acc.novo || 0) + 1;
            else if (status === "resolved" || status === "closed")
              acc.fechado = (acc.fechado || 0) + 1;
            else if (status === "in_progress" || status === "pending")
              acc["em-atendimento"] = (acc["em-atendimento"] || 0) + 1;
            return acc;
          },
          { novo: 0, fechado: 0, "em-atendimento": 0 }
        );

        setStatusData(statusCounts);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Em caso de erro, manter dados vazios
        setRecentCalls([]);
        setStatusData({ novo: 0, fechado: 0, "em-atendimento": 0 });
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange]);

  const SimpleChart = ({ data, type }: { data: any; type: string }) => {
    if (type === "line") {
      const chartData = data.labels.map((label: string, index: number) => ({
        month: label,
        resolvidos: data.datasets.resolvidos[index],
        abertos: data.datasets.abertos[index],
        fechados: data.datasets.fechados[index],
      }));

      const chartConfig = {
        resolvidos: {
          label: "Resolvidos",
          color: "hsl(var(--chart-1))",
        },
        abertos: {
          label: "Abertos",
          color: "hsl(var(--chart-2))",
        },
        fechados: {
          label: "Fechados",
          color: "hsl(var(--chart-3))",
        },
      };

      return (
        <ChartContainer config={chartConfig} className="h-64">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              className="text-xs"
            />
            <YAxis tickLine={false} axisLine={false} className="text-xs" />
            <Tooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="resolvidos"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--chart-1))" }}
            />
            <Line
              type="monotone"
              dataKey="abertos"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--chart-2))" }}
            />
            <Line
              type="monotone"
              dataKey="fechados"
              stroke="hsl(var(--chart-3))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--chart-3))" }}
            />
          </LineChart>
        </ChartContainer>
      );
    }

    if (type === "bar") {
      const chartData = Object.entries(data).map(([key, value]) => ({
        status:
          key === "novo"
            ? "Novo"
            : key === "fechado"
            ? "Fechado"
            : "Em Atendimento",
        value: value,
        fill:
          key === "novo"
            ? "hsl(var(--chart-4))"
            : key === "fechado"
            ? "hsl(var(--chart-5))"
            : "hsl(var(--chart-1))",
      }));

      const chartConfig = {
        value: {
          label: "Chamados",
        },
      };

      return (
        <>
          <ChartContainer config={chartConfig} className="h-64">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="status"
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <YAxis tickLine={false} axisLine={false} className="text-xs" />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" radius={4} />
            </BarChart>
          </ChartContainer>
          <div className="flex justify-center space-x-4 mt-4 flex-wrap">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-sm font-medium">{item.status}</span>
                <Badge variant="outline" className="text-xs">
                  {String(item.value)}
                </Badge>
              </div>
            ))}
          </div>
        </>
      );
    }

    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        Gráfico {type}
      </div>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">
              Carregando dashboard...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const ExecutiveDashboard = () => (
    <>
      {/* Executive Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-chart-2 to-chart-2/80 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">
                  CATEGORIAS COM MAIS CHAMADOS
                </p>
                <p className="text-3xl font-bold mt-2">
                  {dashboardStats.infra}
                </p>
              </div>
              <Target className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-chart-3 to-chart-3/80 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">
                  UNIDADE COM MAIS CHAMADOS
                </p>
                <p className="text-3xl font-bold mt-2">{dashboardStats.atic}</p>
              </div>
              <Users className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-chart-1 to-chart-1/80 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">
                  TEMPO MÉDIO DE ATENDIMENTO
                </p>
                <p className="text-3xl font-bold mt-2">
                  {dashboardStats.tempoMedio}
                </p>
              </div>
              <Clock className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-chart-4 to-chart-4/80 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">NOTA MÉDIA</p>
                <p className="text-3xl font-bold mt-2">
                  {dashboardStats.notaMedia}
                </p>
              </div>
              <Award className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      {config.showCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {config.chartTypes.evolution && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Evolução dos chamados
                </CardTitle>
                <CardDescription>Mês Atual</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <SimpleChart data={evolutionData} type="line" />
                <div className="flex justify-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-chart-1 rounded"></div>
                    <span className="text-sm">Resolvidos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-chart-2 rounded"></div>
                    <span className="text-sm">Abertos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-chart-3 rounded"></div>
                    <span className="text-sm">Fechados</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {config.chartTypes.status && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Status dos chamados
                </CardTitle>
                <CardDescription>Mês Atual</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <SimpleChart data={statusData} type="bar" />
              </CardContent>
            </Card>
          )}

          {/* Technicians Chart */}
          {config.chartTypes.technicians && (
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Chamados por Técnico
                </CardTitle>
                <CardDescription>
                  Distribuição de chamados por técnico
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart
                    data={callsByTechnician}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 60,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="calls" fill="#3b82f6" name="Total" />
                    <Bar dataKey="resolved" fill="#10b981" name="Resolvidos" />
                    <Bar dataKey="pending" fill="#f59e0b" name="Pendentes" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Top Performers and Recent Calls - Only in Executive Dashboard */}
      {config.showTopPerformers && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Pessoas que abriram mais chamados / mês</CardTitle>
              <CardDescription>Top performers do mês atual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.length > 0 ? (
                  topPerformers.map(
                    (performer: TopPerformer, index: number) => (
                      <div
                        key={performer.email}
                        className="flex items-center space-x-4"
                      >
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <Users className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{performer.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {performer.email}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{performer.calls}</p>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhum dado disponível
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chamados Recentes</CardTitle>
              <CardDescription>
                Últimos chamados registradas no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCalls.length > 0 ? (
                  recentCalls.map((call: RecentCall) => (
                    <div
                      key={call.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                          {call.status === "Em atendimento" && (
                            <PhoneCall className="h-5 w-5 text-blue-600" />
                          )}
                          {call.status === "Em atendimento" && (
                            <Clock className="h-5 w-5 text-orange-600" />
                          )}
                          {call.status === "Fechado" && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{call.caller}</span>
                            {getPriorityBadge(call.priority)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {call.issue}
                          </p>
                          <div className="mt-1">
                            {getUnitBadge(call.workUnit)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(call.status)}
                        <p className="text-xs text-muted-foreground">
                          {call.assignedTo
                            ? `Atribuída a ${call.assignedTo}`
                            : "Não atribuída"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {call.createdAt}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhum chamado recente
                  </p>
                )}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline">Ver Todos os Chamados</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );

  const OperationalDashboard = () => (
    <>
      {/* Layout with Cards (1/3) and Charts (2/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Column - Cards (1/3 width) - Centralized vertically */}
        <div className="flex flex-col justify-center space-y-6">
          <Card className="bg-gradient-to-br from-red-500/90 to-red-600/90 text-white border-0">
            <CardContent className="p-8 h-80 flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-100 text-sm font-medium mb-4">
                  CHAMADOS NOVOS
                </p>
                <p className="text-7xl font-bold text-red-50">
                  {statusData.novo}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-4 to-chart-4/80 text-white border-0">
            <CardContent className="p-8 h-80 flex items-center justify-center">
              <div className="text-center">
                <p className="text-white/80 text-sm font-medium mb-4">
                  CHAMADOS ATRIBUÍDOS
                </p>
                <p className="text-7xl font-bold">
                  {statusData["em-atendimento"]}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Charts (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {config.showCharts && (
            <>
              {config.chartTypes.evolution && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Evolução dos chamados
                    </CardTitle>
                    <CardDescription>Mês Atual</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <SimpleChart data={evolutionData} type="line" />
                    <div className="flex justify-center space-x-6 mt-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-chart-1 rounded"></div>
                        <span className="text-sm">Resolvidos</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-chart-2 rounded"></div>
                        <span className="text-sm">Abertos</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-chart-3 rounded"></div>
                        <span className="text-sm">Fechados</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {config.chartTypes.status && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Status dos chamados
                    </CardTitle>
                    <CardDescription>Mês Atual</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <SimpleChart data={statusData} type="bar" />
                  </CardContent>
                </Card>
              )}

              {/* Technicians Chart */}
              {config.chartTypes.technicians && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Chamados por Técnico
                    </CardTitle>
                    <CardDescription>
                      Distribuição de chamados por técnico
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart
                        data={callsByTechnician}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 60,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={60}
                          fontSize={12}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="calls" fill="#3b82f6" name="Total" />
                        <Bar
                          dataKey="resolved"
                          fill="#10b981"
                          name="Resolvidos"
                        />
                        <Bar
                          dataKey="pending"
                          fill="#f59e0b"
                          name="Pendentes"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Visão geral do sistema de suporte
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <NewCallWizard
              trigger={
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Abrir Novo Chamado
                </Button>
              }
              onCallCreated={(data) => {
                console.log("Novo chamado criado no dashboard:", data);
                // Aqui você pode implementar a lógica para salvar o chamado
              }}
            />
            <Select
              value={config.dashboardType}
              onValueChange={(value: DashboardType) => {
                const newConfig = { ...config, dashboardType: value };
                setConfig(newConfig);
                localStorage.setItem(
                  "dashboardConfig",
                  JSON.stringify(newConfig)
                );
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="executive">Dashboard Executivo</SelectItem>
                <SelectItem value="operational">
                  Dashboard Operacional
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Hoje</SelectItem>
                <SelectItem value="week">Esta Semana</SelectItem>
                <SelectItem value="month">Este Mês</SelectItem>
                <SelectItem value="quarter">Este Trimestre</SelectItem>
                <SelectItem value="year">Este Ano</SelectItem>
              </SelectContent>
            </Select>
            <Link href="/administracao/configuracoes-dashboard">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Removendo completamente a seção de filtros */}
        {/* {config.showFilters && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Hoje</SelectItem>
                    <SelectItem value="week">Esta Semana</SelectItem>
                    <SelectItem value="month">Este Mês</SelectItem>
                    <SelectItem value="quarter">Este Trimestre</SelectItem>
                    <SelectItem value="year">Este Ano</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="Em atendimento">Em atendimento</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Fechado">Fechado</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Prioridades</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="low">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )} */}

        {/* Dashboard Content */}
        {config.dashboardType === "executive" ? (
          <ExecutiveDashboard />
        ) : (
          <OperationalDashboard />
        )}
      </div>
    </DashboardLayout>
  );
}

const SimpleChart = ({ data, type }: { data: any; type: string }) => {
  if (type === "line") {
    const chartData = data.labels.map((label: string, index: number) => ({
      month: label,
      resolvidos: data.datasets.resolvidos[index],
      abertos: data.datasets.abertos[index],
      fechados: data.datasets.fechados[index],
    }));

    const chartConfig = {
      resolvidos: {
        label: "Resolvidos",
        color: "hsl(var(--chart-1))",
      },
      abertos: {
        label: "Abertos",
        color: "hsl(var(--chart-2))",
      },
      fechados: {
        label: "Fechados",
        color: "hsl(var(--chart-3))",
      },
    };

    return (
      <ChartContainer config={chartConfig} className="h-64">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            className="text-xs"
          />
          <YAxis tickLine={false} axisLine={false} className="text-xs" />
          <Tooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="resolvidos"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--chart-1))" }}
          />
          <Line
            type="monotone"
            dataKey="abertos"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--chart-2))" }}
          />
          <Line
            type="monotone"
            dataKey="fechados"
            stroke="hsl(var(--chart-3))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--chart-3))" }}
          />
        </LineChart>
      </ChartContainer>
    );
  }

  if (type === "bar") {
    const chartData = Object.entries(data).map(([key, value]) => ({
      status:
        key === "novo"
          ? "Novo"
          : key === "fechado"
          ? "Fechado"
          : "Em Atendimento",
      value: value,
      fill:
        key === "novo"
          ? "hsl(var(--chart-4))"
          : key === "fechado"
          ? "hsl(var(--chart-5))"
          : "hsl(var(--chart-1))",
    }));

    const chartConfig = {
      value: {
        label: "Chamados",
      },
    };

    return (
      <>
        <ChartContainer config={chartConfig} className="h-64">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="status"
              tickLine={false}
              axisLine={false}
              className="text-xs"
            />
            <YAxis tickLine={false} axisLine={false} className="text-xs" />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" radius={4} />
          </BarChart>
        </ChartContainer>
        <div className="flex justify-center space-x-4 mt-4 flex-wrap">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-sm font-medium">{item.status}</span>
              <Badge variant="outline" className="text-xs">
                {String(item.value)}
              </Badge>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="h-64 flex items-center justify-center text-muted-foreground">
      Gráfico {type}
    </div>
  );
};
