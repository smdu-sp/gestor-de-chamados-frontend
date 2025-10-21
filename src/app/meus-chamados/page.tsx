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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Eye,
  MessageSquare,
  Star,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Settings,
  Wrench,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { NewCallWizard } from "@/components/new-call-wizard";
import { GoCallsService } from "@/services/go-calls.service";
import { FeedbackService } from "@/services/feedback.service";
import { useAuth } from "@/contexts/auth-context";
import { usePaginatedApi } from "@/hooks/use-api";
import type { CallResponse, CallFilters, PaginationParams } from "@/types/api";
import type { GoCallFilters } from "@/types/go-backend";

export default function MeusChemadosPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedCall, setSelectedCall] = useState<CallResponse | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

  // Check if user has access to technician area
  const canAccessTechnicianArea =
    user && ["technician", "admin", "developer"].includes(user.role);

  // Configurar filtros para a API
  const getFilters = (): GoCallFilters => {
    const filters: GoCallFilters = {};

    // TEMPORÁRIO: Comentar filtro por usuário para testar
    // if (user?.id) {
    //   filters.createdBy = [user.id];
    // }

    // Adicionar filtros de busca
    if (searchTerm) {
      filters.search = searchTerm;
    }

    // Adicionar filtros de status
    if (statusFilter && statusFilter !== "all") {
      filters.status = [statusFilter];
    }

    // Adicionar filtros de prioridade
    if (priorityFilter && priorityFilter !== "all") {
      filters.priority = [priorityFilter];
    }

    console.log("🔍 Filtros aplicados:", filters);
    console.log("👤 Usuário atual:", user);

    return filters;
  };

  // Usar o hook de paginação
  const {
    data: paginatedResponse,
    loading,
    error,
    pagination,
    goToPage,
    changePageSize,
    updateFilters,
    refetch,
  } = usePaginatedApi(
    (paginationParams, filters) => {
      console.log("🎯 usePaginatedApi - apiCall sendo executada com:", {
        paginationParams,
        filters,
      });
      return GoCallsService.getCalls(paginationParams, filters);
    },
    { page: 1, limit: 20, sortBy: "createdAt", sortOrder: "desc" },
    {}, // Inicializar com filtros vazios
    {
      immediate: false, // Não carregar imediatamente
      onSuccess: (data) => {
        console.log("🎉 usePaginatedApi - Sucesso:", data);
      },
      onError: (error) => {
        console.error("💥 usePaginatedApi - Erro:", error);
      },
    }
  );

  // Atualizar filtros quando mudarem
  useEffect(() => {
    if (user) {
      const filters = getFilters();
      updateFilters(filters);
    }
  }, [user?.id, searchTerm, statusFilter, priorityFilter]); // Dependências específicas

  // Carregar dados inicialmente quando o usuário estiver disponível
  useEffect(() => {
    if (user?.id) {
      console.log("🚀 Carregando chamados para usuário:", user.id);
      console.log("🔧 Chamando refetch...");
      refetch()
        .then((result) => {
          console.log("✅ Refetch concluído com sucesso:", result);
        })
        .catch((error) => {
          console.error("❌ Erro no refetch:", error);
        });
    }
  }, [user?.id, refetch]);

  const calls = paginatedResponse?.data || [];

  console.log("📊 Estado atual:", {
    loading,
    error,
    calls: calls.length,
    paginatedResponse,
    user: user?.id,
  });
  const totalPages = paginatedResponse?.pagination?.totalPages || 0;
  const currentPage = pagination.page;
  const totalItems = paginatedResponse?.pagination?.total || 0;

  const openDetails = (call: CallResponse) => {
    setSelectedCall(call);
    setDetailsDialogOpen(true);
  };

  const openFeedback = async (call: CallResponse) => {
    try {
      // TODO: Backend Go - Verificar se o chamado pode receber feedback
      const canComplete = await FeedbackService.canEvaluateCall(
        call.id.toString()
      );
      if (canComplete) {
        setSelectedCall(call);
        setFeedbackDialogOpen(true);
      }
    } catch (error) {
      console.error("Erro ao verificar feedback:", error);
    }
  };

  const submitFeedback = async (feedback: {
    wasResolved: boolean;
    rating?: number;
    comment?: string;
    reopenReason?: string;
  }) => {
    if (!selectedCall) return;

    try {
      // TODO: Backend Go - Implementar envio de feedback
      await FeedbackService.submitFeedback(
        selectedCall.id.toString(),
        feedback
      );
      setFeedbackDialogOpen(false);
      setSelectedCall(null);
      await refetch();
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
      urgent: "bg-red-200 text-red-900",
    };
    return (
      colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      low: "Baixa",
      medium: "Média",
      high: "Alta",
      urgent: "Urgente",
    };
    return labels[priority as keyof typeof labels] || priority;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "resolved":
      case "closed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      open: "Aberto",
      in_progress: "Em atendimento",
      pending: "Pendente",
      resolved: "Resolvido",
      closed: "Fechado",
    };
    return labels[status as keyof typeof labels] || status;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <div className="text-lg">Carregando seus chamados...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <div className="text-lg text-red-600 mb-2">
              Erro ao carregar chamados
            </div>
            <div className="text-sm text-muted-foreground mb-4">{error}</div>
            <Button onClick={() => refetch()} variant="outline">
              Tentar novamente
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Quick Actions */}
        <div
          className={`grid ${
            canAccessTechnicianArea ? "grid-cols-2" : "grid-cols-1"
          } gap-6 max-w-4xl mx-auto`}
        >
          <NewCallWizard
            trigger={
              <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-card hover:border-red-300 h-32">
                <CardContent className="p-6 h-full flex items-center">
                  <div className="flex items-center space-x-4 w-full">
                    <div className="p-3 bg-red-100 rounded-xl">
                      <Plus className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-red-800">
                        Abrir novo chamado
                      </h3>
                      <p className="text-sm text-red-600 mt-1">
                        Criar uma nova solicitação
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            }
            onCallCreated={(call) => {
              console.log("🎉 Novo chamado criado:", call);
              console.log("🔄 Recarregando lista de chamados...");
              // Recarregar a lista de chamados após criar um novo
              refetch()
                .then(() => {
                  console.log("✅ Lista de chamados recarregada com sucesso");
                })
                .catch((error) => {
                  console.error(
                    "💥 Erro ao recarregar lista de chamados:",
                    error
                  );
                });
            }}
          />

          {canAccessTechnicianArea && (
            <Link
              href={
                user?.role === "admin" ? "/administracao" : "/area-do-tecnico"
              }
            >
              <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-card hover:border-blue-300 h-32">
                <CardContent className="p-6 h-full flex items-center">
                  <div className="flex items-center space-x-4 w-full">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      {user?.role === "admin" ? (
                        <Settings className="h-6 w-6 text-blue-600" />
                      ) : (
                        <Wrench className="h-6 w-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-blue-800">
                        {user?.role === "admin"
                          ? "Área do administrador"
                          : "Área do técnico"}
                      </h3>
                      <p className="text-sm text-blue-600 mt-1">
                        {user?.role === "admin"
                          ? "Gerenciar sistema e usuários"
                          : "Gerenciar chamados técnicos"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
        </div>

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Meus Chamados</h1>
            <p className="text-muted-foreground">
              Acompanhe o status dos seus chamados e forneça feedback
            </p>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Em Andamento
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  calls.filter((c) =>
                    ["open", "in_progress", "pending"].includes(c.status)
                  ).length
                }
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolvidos</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  calls.filter((c) => ["resolved", "closed"].includes(c.status))
                    .length
                }
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cancelados</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {calls.filter((c) => c.status === "closed").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>
              Use os filtros para encontrar chamados específicos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por título ou descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="open">Aberto</SelectItem>
                  <SelectItem value="in_progress">Em atendimento</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="resolved">Resolvido</SelectItem>
                  <SelectItem value="closed">Fechado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as prioridades</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Chamados */}
        <Card>
          <CardHeader>
            <CardTitle>Seus Chamados</CardTitle>
            <CardDescription>
              {calls.length} chamado(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Problema</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Técnico</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calls.map((call) => (
                  <TableRow key={call.id}>
                    <TableCell className="font-mono">#{call.id}</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="font-medium truncate">{call.title}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {call.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {call.category || "Sem categoria"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(call.priority)}>
                        {getPriorityLabel(call.priority) || "Sem prioridade"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(call.status)}
                        <span>{getStatusLabel(call.status)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {call.assignedTo?.name || (
                        <span className="text-muted-foreground">
                          Não atribuído
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(call.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDetails(call)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {["resolved", "closed"].includes(call.status) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openFeedback(call)}
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {calls.length === 0 && !loading && (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhum chamado encontrado
                </h3>
                <p className="text-muted-foreground">
                  Tente ajustar os filtros ou criar um novo chamado.
                </p>
              </div>
            )}

            {/* Controles de Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>
                    Mostrando {(currentPage - 1) * 10 + 1} a{" "}
                    {Math.min(currentPage * 10, totalItems)} de {totalItems}{" "}
                    chamados
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Botão Página Anterior */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>

                  {/* Números das Páginas */}
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNumber}
                          variant={
                            currentPage === pageNumber ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => goToPage(pageNumber)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>

                  {/* Botão Próxima Página */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Seletor de itens por página */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    Itens por página:
                  </span>
                  <Select
                    value={pagination.limit.toString()}
                    onValueChange={(value) => changePageSize(parseInt(value))}
                  >
                    <SelectTrigger className="w-20 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog de Detalhes */}
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Chamado #{selectedCall?.id}</DialogTitle>
              <DialogDescription>
                Informações completas sobre o chamado
              </DialogDescription>
            </DialogHeader>
            {selectedCall && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(selectedCall.status)}
                      <span>{getStatusLabel(selectedCall.status)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Prioridade</label>
                    <div className="mt-1">
                      <Badge
                        className={getPriorityColor(selectedCall.priority)}
                      >
                        {getPriorityLabel(selectedCall.priority)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Categoria</label>
                    <div className="mt-1">
                      <Badge variant="outline">{selectedCall.category}</Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Técnico Responsável
                    </label>
                    <p className="mt-1">
                      {selectedCall.assignedTo?.name || "Não atribuído"}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Título</label>
                  <p className="mt-1">{selectedCall.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Descrição</label>
                  <p className="mt-1">{selectedCall.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      Data de Criação
                    </label>
                    <p className="mt-1">
                      {new Date(selectedCall.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Última Atualização
                    </label>
                    <p className="mt-1">
                      {new Date(selectedCall.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog de Feedback */}
        <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Avaliar Chamado #{selectedCall?.id}</DialogTitle>
              <DialogDescription>
                Seu feedback nos ajuda a melhorar nossos serviços
              </DialogDescription>
            </DialogHeader>
            {/* TODO: Backend Go - Implementar formulário de feedback */}
            <div className="space-y-4">
              <p>Formulário de feedback será implementado aqui</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
