"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Shield,
  Key,
  Users,
  Settings,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { SettingsService } from "@/services/settings.service";

// Types for security management

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
}

interface SecurityLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  ip: string;
  status: "success" | "failed" | "warning";
  details: string;
}

const getStatusIcon = (status: SecurityLog["status"]) => {
  switch (status) {
    case "success":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "failed":
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

const getStatusBadge = (status: SecurityLog["status"]) => {
  switch (status) {
    case "success":
      return <Badge className="bg-green-100 text-green-800">Sucesso</Badge>;
    case "failed":
      return <Badge className="bg-red-100 text-red-800">Falha</Badge>;
    case "warning":
      return <Badge className="bg-yellow-100 text-yellow-800">Aviso</Badge>;
    default:
      return <Badge variant="outline">Desconhecido</Badge>;
  }
};

export default function SecurityPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAge: 90,
    preventReuse: 5,
  });

  // Load security data from backend
  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API calls when backend is ready
      // const [rolesResponse, permissionsResponse, logsResponse] = await Promise.all([
      //   SecurityService.getRoles(),
      //   SecurityService.getPermissions(),
      //   SecurityService.getSecurityLogs()
      // ]);
      // setRoles(rolesResponse);
      // setPermissions(permissionsResponse);
      // setSecurityLogs(logsResponse);
      
      // For now, set empty arrays
      setRoles([]);
      setPermissions([]);
      setSecurityLogs([]);
    } catch (error) {
      console.error("Erro ao carregar dados de segurança:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePasswordPolicy = async () => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // await SettingsService.updatePasswordPolicy(passwordPolicy);
      console.log("Password policy updated:", passwordPolicy);
    } catch (error) {
      console.error("Error updating password policy:", error);
    }
  };

  const handleCreateRole = async (roleData: Omit<Role, 'id' | 'userCount'>) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // const newRole = await SettingsService.createRole(roleData);
      // setRoles([...roles, newRole]);
      console.log("Creating role:", roleData);
    } catch (error) {
      console.error("Error creating role:", error);
    }
  };

  const handleUpdateRole = async (roleId: string, updates: Partial<Role>) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // await SettingsService.updateRole(roleId, updates);
      // await loadSecurityData();
      console.log("Updating role:", roleId, updates);
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Segurança</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p>Carregando configurações de segurança...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Segurança</h1>
      </div>

      {/* Password Policy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <span>Política de Senhas</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minLength">Comprimento Mínimo</Label>
              <Input
                id="minLength"
                type="number"
                value={passwordPolicy.minLength}
                onChange={(e) => setPasswordPolicy({
                  ...passwordPolicy,
                  minLength: parseInt(e.target.value)
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxAge">Validade (dias)</Label>
              <Input
                id="maxAge"
                type="number"
                value={passwordPolicy.maxAge}
                onChange={(e) => setPasswordPolicy({
                  ...passwordPolicy,
                  maxAge: parseInt(e.target.value)
                })}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Switch
                id="requireUppercase"
                checked={passwordPolicy.requireUppercase}
                onCheckedChange={(checked) => setPasswordPolicy({
                  ...passwordPolicy,
                  requireUppercase: checked
                })}
              />
              <Label htmlFor="requireUppercase">Exigir letras maiúsculas</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="requireLowercase"
                checked={passwordPolicy.requireLowercase}
                onCheckedChange={(checked) => setPasswordPolicy({
                  ...passwordPolicy,
                  requireLowercase: checked
                })}
              />
              <Label htmlFor="requireLowercase">Exigir letras minúsculas</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="requireNumbers"
                checked={passwordPolicy.requireNumbers}
                onCheckedChange={(checked) => setPasswordPolicy({
                  ...passwordPolicy,
                  requireNumbers: checked
                })}
              />
              <Label htmlFor="requireNumbers">Exigir números</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="requireSpecialChars"
                checked={passwordPolicy.requireSpecialChars}
                onCheckedChange={(checked) => setPasswordPolicy({
                  ...passwordPolicy,
                  requireSpecialChars: checked
                })}
              />
              <Label htmlFor="requireSpecialChars">Exigir caracteres especiais</Label>
            </div>
          </div>
          
          <Button onClick={handleUpdatePasswordPolicy}>
            Salvar Política de Senhas
          </Button>
        </CardContent>
      </Card>

      {/* Roles and Permissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Funções</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {roles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma função configurada</p>
                <p className="text-sm">As funções serão carregadas quando o backend estiver disponível</p>
              </div>
            ) : (
              <div className="space-y-2">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{role.displayName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {role.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {role.userCount} usuários
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedRole(role);
                          setShowRoleDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {!role.isSystem && (
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Permissões</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {permissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma permissão configurada</p>
                <p className="text-sm">As permissões serão carregadas quando o backend estiver disponível</p>
              </div>
            ) : (
              <div className="space-y-2">
                {permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="p-3 border rounded-lg"
                  >
                    <h4 className="font-medium">{permission.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {permission.description}
                    </p>
                    <Badge variant="outline" className="mt-1">
                      {permission.module}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Security Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Logs de Segurança</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {securityLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum log de segurança disponível</p>
              <p className="text-sm">Os logs serão exibidos quando o backend estiver disponível</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {securityLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(log.status)}
                        {getStatusBadge(log.status)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{log.ip}</TableCell>
                    <TableCell>{log.timestamp}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {log.details}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Role Details Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Função</DialogTitle>
            <DialogDescription>
              Visualizar permissões e configurações da função
            </DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">{selectedRole.displayName}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedRole.description}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Permissões:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedRole.permissions.map((permissionId) => {
                    const permission = permissions.find(p => p.id === permissionId);
                    return (
                      <Badge key={permissionId} variant="outline">
                        {permission?.name || permissionId}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
