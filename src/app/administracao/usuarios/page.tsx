"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Users, Search, Plus, Edit, UserCheck, UserX } from "lucide-react";
import { UserRole } from "@/types/auth";
import { UserResponse } from "@/types/api";
import { getRoleBadge } from "@/lib/badge-utils";
import { ViewDetailsDialog } from "@/components/view-details-dialog";
import { EditDialog } from "@/components/edit-dialog";
// import { UsersService } from "@/services/users.service"; // Comentado temporariamente
import { GoUsersService } from "@/services/go-users.service"; // Usando o adaptador Go

export default function UsersPage() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as UserRole,
    workUnit: "",
    status: "active",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Usando o serviço adaptador do Go temporariamente
      const fetchedUsers = await GoUsersService.getUsers();
      setUsers(fetchedUsers);

      // TODO: Quando o backend estiver completo, voltar para:
      // const fetchedUsers = await UsersService.getUsers();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar usuários"
      );
      console.error("Erro ao carregar usuários:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  // TODO: Implementar outras funções quando o backend Go estiver completo
  // const handleSubmit = async (userData: any) => { ... }
  // const handleEdit = async (id: string, userData: any) => { ... }
  // const handleDelete = async (id: string) => { ... }
  // const toggleUserStatus = async (userId: string) => { ... }

  const handleCreateUser = async () => {
    try {
      // TODO: Implementar quando o backend Go tiver o endpoint de criação de usuário
      console.log(
        "Criação de usuário será implementada quando o backend Go estiver completo:",
        newUser
      );

      // Temporariamente, apenas feche o dialog
      setIsNewUserDialogOpen(false);
      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "user",
        workUnit: "",
        status: "active",
      });

      // TODO: Quando implementado, descomente:
      // await GoUsersService.createUser({
      //   name: newUser.name,
      //   email: newUser.email,
      //   password: newUser.password,
      //   role: newUser.role,
      //   workUnit: newUser.workUnit,
      // });
      // await loadUsers();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    try {
      // TODO: Implementar quando o backend Go tiver o endpoint de toggle de status
      console.log(
        "Toggle de status será implementado quando o backend Go estiver completo:",
        userId
      );

      // Temporariamente, apenas feche o dialog
      setConfirmDialogOpen(false);
      setUserToToggle(null);

      // TODO: Quando implementado, descomente:
      // await GoUsersService.toggleUserStatus(parseInt(userId));
      // await loadUsers();
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p>Carregando usuários...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
        <Dialog
          open={isNewUserDialogOpen}
          onOpenChange={setIsNewUserDialogOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
              <DialogDescription>
                Preencha as informações do novo usuário
                {/* TODO: Remover esta mensagem quando o backend estiver completo */}
                <br />
                <span className="text-yellow-600 text-sm">
                  (Funcionalidade será implementada quando o backend Go estiver
                  completo)
                </span>
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Função</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value: UserRole) =>
                      setNewUser({ ...newUser, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="technician">Técnico</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workUnit">Unidade de Trabalho</Label>
                  <Input
                    id="workUnit"
                    value={newUser.workUnit}
                    onChange={(e) =>
                      setNewUser({ ...newUser, workUnit: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsNewUserDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreateUser}>Criar Usuário</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Gerenciamento de Usuários</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="suspended">Suspenso</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Funções</SelectItem>
                <SelectItem value="user">Usuário</SelectItem>
                <SelectItem value="technician">Técnico</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="developer">Desenvolvedor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último Login</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{user.workUnit}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "active" ? "default" : "secondary"
                      }
                    >
                      {user.status === "active"
                        ? "Ativo"
                        : user.status === "inactive"
                        ? "Inativo"
                        : "Suspenso"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : "Nunca"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setUserToToggle(user.id);
                          setConfirmDialogOpen(true);
                        }}
                        title={
                          user.status === "active" ? "Desativar" : "Ativar"
                        }
                      >
                        {user.status === "active" ? (
                          <UserX className="h-4 w-4" />
                        ) : (
                          <UserCheck className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum usuário encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Ação</DialogTitle>
            <DialogDescription>
              {userToToggle &&
              users.find((u) => u.id === userToToggle)?.status === "active"
                ? "Tem certeza que deseja desativar este usuário?"
                : "Tem certeza que deseja ativar este usuário?"}
              {/* TODO: Remover esta mensagem quando o backend estiver completo */}
              <br />
              <span className="text-yellow-600 text-sm">
                (Funcionalidade será implementada quando o backend Go estiver
                completo)
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={() =>
                userToToggle && handleToggleUserStatus(userToToggle)
              }
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
