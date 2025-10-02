"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PhoneCall,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Search,
  Eye,
  Edit,
  Archive,
  ArrowRightLeft,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { UserRole } from "@/types/auth";
import { EditDialog } from "@/components/edit-dialog";
import { ArchiveCallDialog } from "@/components/confrmation-dialog";
import { ChatResponseDialog } from "@/components/chat-response-dialog";
import { ViewDetailsDialog } from "@/components/view-details-dialog";
import {
  getStatusBadge,
  getPriorityBadge,
  getUnitBadge,
} from "@/lib/badge-utils";
// TODO: Integrar com backend - remover imports de mock data
// import { assignedCalls, mockAuthUsers, mockCalls } from "@/lib/mock-data";
import { useAuth } from "@/contexts/auth-context";
import { TechnicianCategory } from "@/types/auth";
import { CallsService } from "@/services/calls.service";
import { UsersService } from "@/services/users.service";
import { CALL_CATEGORIES, CALL_STATUS, CALL_PRIORITIES } from "@/lib/constants";

export default function TechnicianAreaPage() {
  const { user } = useAuth();
  const [selectedCall, setSelectedCall] = useState<any | null>(null);
  const [newNote, setNewNote] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState<
    TechnicianCategory | "all"
  >("all");
  const [technicianFilter, setTechnicianFilter] = useState("all");

  // Estados para o dialog de transferência
  const [selectedTransferCategory, setSelectedTransferCategory] = useState<
    TechnicianCategory | ""
  >("");
  const [selectedTechnician, setSelectedTechnician] = useState<string>("");
  const [transferNote, setTransferNote] = useState("");

  // Estados para o dialog de atribuição (admin)
  const [selectedAssignCategory, setSelectedAssignCategory] = useState<
    TechnicianCategory | ""
  >("");
  const [selectedAssignTechnician, setSelectedAssignTechnician] =
    useState<string>("");
  const [assignNote, setAssignNote] = useState("");

  // TODO: Integrar com backend - substituir por dados reais da API
  const [assignedCallsState, setAssignedCallsState] = useState<any[]>([]);
  const [unassignedCallsState, setUnassignedCallsState] = useState<any[]>([]);
  const [availableTechnicians, setAvailableTechnicians] = useState<any[]>([]);

  // TODO: Integrar com backend - carregar dados dos chamados
  useEffect(() => {
    const loadCalls = async () => {
      try {
        setLoading(true);

        // Carregar chamados atribuídos ao técnico logado ou todos (se admin)
        const assignedCallsResponse = await CallsService.getCalls(
          { page: 1, limit: 100 },
          {
            assignedTo:
              user?.role === "technician" ? [parseInt(user.id)] : undefined,
            status: ["in_progress", "pending"],
          }
        );
        setAssignedCallsState(assignedCallsResponse.data);

        // Carregar chamados não atribuídos
        const unassignedCallsResponse = await CallsService.getCalls(
          { page: 1, limit: 100 },
          {
            // Não use assignedTo: null, o tipo não aceita null
            status: ["open"],
          }
        );
        // Filtrar somente os não atribuídos no client
        setUnassignedCallsState(
          (unassignedCallsResponse.data || []).filter((c: any) => !c.assignedTo)
        );

        // Carregar lista de técnicos (se admin)
        if (user?.role === "admin" || user?.role === "developer") {
          const techniciansResponse = await UsersService.getUsers(
            { page: 1, limit: 100 },
            { role: ["technician"] }
          );
          setAvailableTechnicians(techniciansResponse.data);
        }
      } catch (error) {
        console.error("Erro ao carregar chamados:", error);
        toast.error("Erro ao carregar chamados");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadCalls();
    }
  }, [user]);

  // TODO: Integrar com backend - implementar atribuição de chamado
  const handleAssignCall = useCallback(
    async (callId: string) => {
      if (!user) return;

      try {
        await CallsService.assignCall(parseInt(callId), parseInt(user.id));

        // Recarregar dados após atribuição
        const assignedCallsResponse = await CallsService.getCalls(
          { page: 1, limit: 100 },
          {
            assignedTo: [parseInt(user.id)],
            status: ["in_progress", "pending"],
          }
        );
        setAssignedCallsState(assignedCallsResponse.data);

        const unassignedCallsResponse = await CallsService.getCalls(
          { page: 1, limit: 100 },
          {
            status: ["open"],
          }
        );
        setUnassignedCallsState(
          (unassignedCallsResponse.data || []).filter((c: any) => !c.assignedTo)
        );

        toast.success(`Chamado ${callId} atribuído com sucesso!`);
      } catch (error) {
        console.error("Erro ao atribuir chamado:", error);
        toast.error("Erro ao atribuir chamado");
      }
    },
    [user]
  );

  // TODO: Integrar com backend - filtrar técnicos por categoria
  const getAvailableTechnicians = useMemo(() => {
    if (!selectedTransferCategory) return [];

    return availableTechnicians.filter(
      (tech) =>
        tech.role === "technician" &&
        tech.technicianCategories?.includes(selectedTransferCategory)
    );
  }, [selectedTransferCategory, availableTechnicians]);

  // TODO: Integrar com backend - filtrar técnicos por categoria (atribuição admin)
  const getAvailableAssignTechnicians = useMemo(() => {
    if (!selectedAssignCategory) return [];

    return availableTechnicians.filter(
      (tech) =>
        tech.role === "technician" &&
        tech.technicianCategories?.includes(selectedAssignCategory)
    );
  }, [selectedAssignCategory, availableTechnicians]);

  // TODO: Integrar com backend - implementar transferência de chamado
  const handleTransferCall = useCallback(
    async (callId: string) => {
      if (!selectedTechnician || !selectedTransferCategory) {
        toast.error("Selecione a categoria e o técnico para transferir!");
        return;
      }

      try {
        await CallsService.assignCall(
          parseInt(callId),
          parseInt(selectedTechnician)
        );

        // Reset dos estados
        setSelectedTransferCategory("");
        setSelectedTechnician("");
        setTransferNote("");

        toast.success("Chamado transferido com sucesso!");
      } catch (error) {
        console.error("Erro ao transferir chamado:", error);
        toast.error("Erro ao transferir chamado");
      }
    },
    [selectedTransferCategory, selectedTechnician, transferNote]
  );

  // TODO: Integrar com backend - implementar atribuição admin
  const handleAdminAssignCall = useCallback(
    async (callId: string) => {
      if (!selectedAssignTechnician || !selectedAssignCategory) {
        toast.error("Selecione a categoria e o técnico para atribuir!");
        return;
      }

      try {
        await CallsService.assignCall(
          parseInt(callId),
          parseInt(selectedAssignTechnician)
        );

        // Reset dos estados
        setSelectedAssignCategory("");
        setSelectedAssignTechnician("");
        setAssignNote("");

        const selectedTech = availableTechnicians.find(
          (tech) => tech.id === selectedAssignTechnician
        );

        toast.success(
          `Chamado ${callId} atribuído para ${selectedTech?.name} com sucesso!`
        );
      } catch (error) {
        console.error("Erro ao atribuir chamado:", error);
        toast.error("Erro ao atribuir chamado");
      }
    },
    [selectedAssignTechnician, selectedAssignCategory, availableTechnicians]
  );

  // TODO: Integrar com backend - implementar adição de nota
  const handleAddNote = useCallback(async () => {
    if (!selectedCall || !newNote.trim()) return;

    try {
      // Implementar chamada para API de comentários
      console.log("Adding note:", newNote, "to call:", selectedCall.id);
      setNewNote("");
      toast.success("Nota adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar nota:", error);
      toast.error("Erro ao adicionar nota");
    }
  }, [selectedCall, newNote]);

  // TODO: Integrar com backend - implementar mudança de status
  const handleStatusChange = useCallback(async () => {
    if (!selectedCall || !newStatus) return;

    try {
      await CallsService.changeStatus(
        parseInt(selectedCall.id),
        newStatus as any
      );
      setNewStatus("");
      toast.success("Status alterado com sucesso!");
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      toast.error("Erro ao alterar status");
    }
  }, [selectedCall, newStatus]);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR");
  }, []);

  const formatTimeSpent = useCallback((minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }, []);

  const filteredCalls = useMemo(() => {
    return assignedCallsState.filter((call: any) => {
      const matchesSearch =
        call.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.caller?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.issue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.id?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || call.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || call.priority === priorityFilter;
      const matchesTechnician =
        technicianFilter === "all" ||
        ((user?.role === "admin" || user?.role === "developer") &&
          call.assignedTo?.name &&
          call.assignedTo.name
            .toLowerCase()
            .includes(technicianFilter.toLowerCase()));

      return (
        matchesSearch && matchesStatus && matchesPriority && matchesTechnician
      );
    });
  }, [
    assignedCallsState,
    searchTerm,
    statusFilter,
    priorityFilter,
    technicianFilter,
    user?.role,
  ]);

  if (loading) {
    return (
      <DashboardLayout
        allowedRoles={[
          "technician" as UserRole,
          "admin" as UserRole,
          "developer" as UserRole,
        ]}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Carregando chamados...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      allowedRoles={[
        "technician" as UserRole,
        "admin" as UserRole,
        "developer" as UserRole,
      ]}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Área do Técnico
            </h1>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Chamados Ativos
              </CardTitle>
              <PhoneCall className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {
                  assignedCallsState.filter(
                    (call) => call.status === "in_progress"
                  ).length
                }
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Alta Prioridade
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {
                  assignedCallsState.filter((call) => call.priority === "high")
                    .length
                }
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Total</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {/* TODO: Integrar com backend - calcular tempo real */}
                {formatTimeSpent(
                  assignedCallsState.reduce(
                    (total, call) => total + (call.timeSpent || 0),
                    0
                  )
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Resolvidos Hoje
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {/* TODO: Integrar com backend - contar chamados resolvidos hoje */}
              <div className="text-2xl font-bold text-green-600">0</div>
            </CardContent>
          </Card>
        </div>

        {/* Novos Chamados Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Novos Chamados
            </CardTitle>
            <CardDescription>
              {user?.role === "admin" || user?.role === "developer"
                ? "Todos os chamados não atribuídos do sistema"
                : `Chamados não atribuídos das suas categorias: ${
                    user?.technicianCategories?.join(", ") ||
                    "Nenhuma categoria"
                  }`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {unassignedCallsState.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum chamado novo disponível</p>
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Protocolo</TableHead>
                      <TableHead>Solicitante</TableHead>
                      <TableHead>Unidade</TableHead>
                      <TableHead>Problema</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Prioridade</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unassignedCallsState.map((call) => (
                      <TableRow key={call.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{call.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{call.caller}</div>
                        </TableCell>
                        <TableCell>{getUnitBadge(call.workUnit)}</TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div
                              className="font-medium truncate"
                              title={call.issue}
                            >
                              {call.issue?.length > 40
                                ? `${call.issue.substring(0, 40)}...`
                                : call.issue}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{call.category}</Badge>
                        </TableCell>
                        <TableCell>{getPriorityBadge(call.priority)}</TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(call.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {user?.role === "admin" ||
                            user?.role === "developer" ? (
                              // Botão para administradores - atribuir a qualquer técnico
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      // Reset dos estados ao abrir o dialog
                                      setSelectedAssignCategory("");
                                      setSelectedAssignTechnician("");
                                      setAssignNote("");
                                    }}
                                  >
                                    <UserCheck className="h-4 w-4 mr-1" />
                                    Atribuir
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Atribuir Chamado</DialogTitle>
                                    <DialogDescription>
                                      Atribuir o chamado {call.id} para um
                                      técnico
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="assign-category">
                                        Categoria do Chamado
                                      </Label>
                                      <Select
                                        value={selectedAssignCategory}
                                        onValueChange={(
                                          value: TechnicianCategory
                                        ) => setSelectedAssignCategory(value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecione a categoria" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {/* TODO: Integrar com backend - carregar categorias dinamicamente */}
                                          <SelectItem value="MANUTENÇÃO">
                                            MANUTENÇÃO
                                          </SelectItem>
                                          <SelectItem value="VOIP">
                                            VOIP
                                          </SelectItem>
                                          <SelectItem value="IMPRESSORA">
                                            IMPRESSORA
                                          </SelectItem>
                                          <SelectItem value="SISTEMAS">
                                            SISTEMAS
                                          </SelectItem>
                                          <SelectItem value="COMPUTADOR">
                                            COMPUTADOR
                                          </SelectItem>
                                          <SelectItem value="INFRAESTRUTURA">
                                            INFRAESTRUTURA
                                          </SelectItem>
                                          <SelectItem value="SOFTWARE">
                                            SOFTWARE
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label htmlFor="assign-technician">
                                        Técnico Responsável
                                      </Label>
                                      <Select
                                        value={selectedAssignTechnician}
                                        onValueChange={
                                          setSelectedAssignTechnician
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Escolha um técnico" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {getAvailableAssignTechnicians.length >
                                          0 ? (
                                            getAvailableAssignTechnicians.map(
                                              (tech) => (
                                                <SelectItem
                                                  key={tech.id}
                                                  value={tech.id}
                                                >
                                                  {tech.name} - {tech.workUnit}
                                                </SelectItem>
                                              )
                                            )
                                          ) : (
                                            <SelectItem
                                              value="no-tech"
                                              disabled
                                            >
                                              Nenhum técnico disponível para
                                              esta categoria
                                            </SelectItem>
                                          )}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label htmlFor="assign-note">
                                        Observações (opcional)
                                      </Label>
                                      <Textarea
                                        id="assign-note"
                                        placeholder="Adicione observações sobre a atribuição..."
                                        value={assignNote}
                                        onChange={(e) =>
                                          setAssignNote(e.target.value)
                                        }
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedAssignCategory("");
                                        setSelectedAssignTechnician("");
                                        setAssignNote("");
                                      }}
                                    >
                                      Cancelar
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        handleAdminAssignCall(call.id)
                                      }
                                      disabled={
                                        !selectedAssignTechnician ||
                                        !selectedAssignCategory
                                      }
                                    >
                                      Atribuir
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            ) : (
                              // Botão para técnicos - atribuir para si mesmo
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAssignCall(call.id)}
                              >
                                <UserCheck className="h-4 w-4 mr-1" />
                                Assumir
                              </Button>
                            )}
                            <ViewDetailsDialog
                              trigger={
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  Detalhes
                                </Button>
                              }
                              title={`Detalhes do Chamado ${call.id}`}
                              fields={[
                                { label: "Solicitante", value: call.caller },
                                {
                                  label: "Unidade",
                                  value: call.workUnit,
                                  type: "unit",
                                },
                                {
                                  label: "Problema",
                                  value: call.issue || call.title,
                                },
                                {
                                  label: "Categoria",
                                  value: call.category,
                                  type: "category",
                                },
                                {
                                  label: "Prioridade",
                                  value: call.priority,
                                  type: "priority",
                                },
                                {
                                  label: "Status",
                                  value: call.status,
                                  type: "status",
                                },
                                {
                                  label: "Criado em",
                                  value: call.createdAt,
                                  type: "date",
                                },
                                {
                                  label: "Atualizado em",
                                  value: call.updatedAt,
                                  type: "date",
                                },
                              ]}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Meus Chamados Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PhoneCall className="h-5 w-5 text-blue-500" />
              {user?.role === "admin" || user?.role === "developer"
                ? "Todos os Chamados Atribuídos"
                : "Meus Chamados"}
            </CardTitle>
            <CardDescription>
              {user?.role === "admin" || user?.role === "developer"
                ? "Todos os chamados atribuídos no sistema"
                : "Chamados atribuídos a você"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Filtros */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por protocolo, solicitante ou problema..."
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
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="in_progress">Em Atendimento</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="resolved">Resolvido</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Prioridades</SelectItem>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
                {(user?.role === "admin" || user?.role === "developer") && (
                  <Input
                    placeholder="Filtrar por técnico..."
                    value={technicianFilter}
                    onChange={(e) => setTechnicianFilter(e.target.value)}
                    className="w-[200px]"
                  />
                )}
              </div>

              {/* Tabela de Chamados */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Protocolo</TableHead>
                      <TableHead>Solicitante</TableHead>
                      <TableHead>Unidade</TableHead>
                      <TableHead>Problema</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Prioridade</TableHead>
                      <TableHead>Data</TableHead>
                      {(user?.role === "admin" ||
                        user?.role === "developer") && (
                        <TableHead>Técnico</TableHead>
                      )}
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCalls.map((call) => (
                      <TableRow key={call.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{call.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{call.caller}</div>
                          <div className="text-sm text-muted-foreground">
                            {call.email}
                          </div>
                        </TableCell>
                        <TableCell>{getUnitBadge(call.workUnit)}</TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div
                              className="font-medium truncate"
                              title={call.issue}
                            >
                              {call.issue?.length > 40
                                ? `${call.issue.substring(0, 40)}...`
                                : call.issue}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(call.status)}</TableCell>
                        <TableCell>{getPriorityBadge(call.priority)}</TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(call.createdAt)}
                          </div>
                        </TableCell>
                        {(user?.role === "admin" ||
                          user?.role === "developer") && (
                          <TableCell>
                            <div className="text-sm">
                              {call.assignedTo?.name}
                            </div>
                          </TableCell>
                        )}
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <ViewDetailsDialog
                              trigger={
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  Detalhes
                                </Button>
                              }
                              title={`Detalhes do Chamado ${call.id}`}
                              fields={[
                                { label: "Solicitante", value: call.caller },
                                {
                                  label: "Unidade",
                                  value: call.workUnit,
                                  type: "unit",
                                },
                                {
                                  label: "Problema",
                                  value: call.issue || call.title,
                                },
                                {
                                  label: "Categoria",
                                  value: call.category,
                                  type: "category",
                                },
                                {
                                  label: "Prioridade",
                                  value: call.priority,
                                  type: "priority",
                                },
                                {
                                  label: "Status",
                                  value: call.status,
                                  type: "status",
                                },
                                {
                                  label: "Criado em",
                                  value: call.createdAt,
                                  type: "date",
                                },
                                {
                                  label: "Atualizado em",
                                  value: call.updatedAt,
                                  type: "date",
                                },
                              ]}
                            />

                            <EditDialog
                              trigger={
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4 mr-1" />
                                  Editar
                                </Button>
                              }
                              title={`Editar Chamado ${call.id}`}
                              fields={[
                                {
                                  name: "issue",
                                  label: "Problema",
                                  type: "text",
                                  value: call.issue || "",
                                },
                                {
                                  name: "category",
                                  label: "Categoria",
                                  type: "select",
                                  value: call.category || "",
                                  options: Object.values(CALL_CATEGORIES).map(
                                    (c: string) => ({
                                      value: c,
                                      label: c,
                                    })
                                  ),
                                },
                                {
                                  name: "priority",
                                  label: "Prioridade",
                                  type: "select",
                                  value: call.priority || "",
                                  options: CALL_PRIORITIES.map(
                                    (p: { value: string; label: string }) => ({
                                      value: p.value,
                                      label: p.label,
                                    })
                                  ),
                                },
                                {
                                  name: "description",
                                  label: "Descrição",
                                  type: "textarea",
                                  value: call.description || "",
                                },
                              ]}
                              onSubmit={async (data) => {
                                try {
                                  await CallsService.updateCall(
                                    parseInt(call.id),
                                    {
                                      category: data.category,
                                      priority: data.priority,
                                      description: data.description,
                                    }
                                  );
                                  toast.success(
                                    "Chamado atualizado com sucesso!"
                                  );
                                } catch (error) {
                                  console.error(
                                    "Erro ao atualizar chamado:",
                                    error
                                  );
                                  toast.error("Erro ao atualizar chamado");
                                }
                              }}
                            />

                            <ChatResponseDialog
                              trigger={
                                <Button variant="ghost" size="sm">
                                  <MessageSquare className="h-4 w-4 mr-1" />
                                  Chat
                                </Button>
                              }
                              callData={{
                                id: String(call.id),
                                protocol: String(call.id),
                                caller: call.caller,
                                email: call.createdBy?.email || "",
                                phone: "",
                                workUnit: call.workUnit,
                                issue: call.issue || call.title,
                                description: call.description,
                                category: call.category,
                                priority: call.priority,
                                status: call.status,
                                assignedTo: call.assignedTo?.name,
                                createdAt: call.createdAt,
                                updatedAt: call.updatedAt,
                                notes:
                                  (call.comments || []).map((c: any) => ({
                                    id: String(c.id),
                                    content: c.content,
                                    author: c.author?.name || "",
                                    timestamp: c.createdAt,
                                    isInternal: false,
                                  })) || [],
                              }}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredCalls.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {searchTerm ||
                      statusFilter !== "all" ||
                      priorityFilter !== "all"
                        ? "Nenhum chamado encontrado"
                        : "Nenhum chamado atribuído"}
                    </h3>
                    <p className="text-muted-foreground">
                      {searchTerm ||
                      statusFilter !== "all" ||
                      priorityFilter !== "all"
                        ? "Tente ajustar os filtros de pesquisa."
                        : "Você não possui chamados atribuídos no momento."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
