"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  AlertTriangle,
  Info,
  Wrench,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { SystemNotice } from "@/types/api";
import { useAuth } from "@/contexts/auth-context";
// TODO: Import system notices service when backend is ready
// import { SystemNoticesService } from "@/services/system-notices.service";

const getNoticeIcon = (type: SystemNotice["type"]) => {
  switch (type) {
    case "info":
      return <Info className="h-4 w-4 text-blue-500" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case "error":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case "maintenance":
      return <Wrench className="h-4 w-4 text-orange-500" />;
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
};

const getPriorityBadge = (priority: SystemNotice["priority"]) => {
  switch (priority) {
    case "high":
      return <Badge variant="destructive">Alta</Badge>;
    case "medium":
      return <Badge variant="secondary">Média</Badge>;
    case "low":
      return <Badge variant="outline">Baixa</Badge>;
    default:
      return <Badge variant="outline">Baixa</Badge>;
  }
};

const getTypeBadge = (type: SystemNotice["type"]) => {
  switch (type) {
    case "info":
      return <Badge className="bg-blue-100 text-blue-800">Informação</Badge>;
    case "warning":
      return <Badge className="bg-yellow-100 text-yellow-800">Aviso</Badge>;
    case "error":
      return <Badge className="bg-red-100 text-red-800">Erro</Badge>;
    case "maintenance":
      return <Badge className="bg-orange-100 text-orange-800">Manutenção</Badge>;
    default:
      return <Badge className="bg-blue-100 text-blue-800">Informação</Badge>;
  }
};

export function SystemNoticesManagement() {
  const { user } = useAuth();
  const [notices, setNotices] = useState<SystemNotice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<SystemNotice | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info" as SystemNotice["type"],
    priority: "medium" as SystemNotice["priority"],
    startDate: "",
    endDate: "",
    targetRoles: [] as string[],
    isActive: true,
  });

  // Load notices from backend
  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await SystemNoticesService.getAll();
      // setNotices(response);
      setNotices([]);
    } catch (error) {
      console.error("Erro ao carregar avisos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      message: "",
      type: "info",
      priority: "medium",
      startDate: "",
      endDate: "",
      targetRoles: [],
      isActive: true,
    });
    setEditingNotice(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingNotice) {
        // TODO: Replace with actual API call when backend is ready
        // await SystemNoticesService.update(editingNotice.id, formData);
        console.log("Updating notice:", editingNotice.id, formData);
      } else {
        // TODO: Replace with actual API call when backend is ready
        // await SystemNoticesService.create(formData);
        console.log("Creating notice:", formData);
      }
      
      setIsDialogOpen(false);
      resetForm();
      await loadNotices();
    } catch (error) {
      console.error("Erro ao salvar aviso:", error);
    }
  };

  const handleEdit = (notice: SystemNotice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      message: notice.message,
      type: notice.type,
      priority: notice.priority,
      startDate: notice.startDate,
      endDate: notice.endDate || "",
      targetRoles: notice.targetRoles || [],
      isActive: notice.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (noticeId: string) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // await SystemNoticesService.delete(noticeId);
      console.log("Deleting notice:", noticeId);
      await loadNotices();
    } catch (error) {
      console.error("Erro ao excluir aviso:", error);
    }
  };

  const toggleActive = async (noticeId: string) => {
    try {
      const notice = notices.find(n => n.id === noticeId);
      if (notice) {
        // TODO: Replace with actual API call when backend is ready
        // await SystemNoticesService.update(noticeId, { isActive: !notice.isActive });
        console.log("Toggling notice active status:", noticeId);
        await loadNotices();
      }
    } catch (error) {
      console.error("Erro ao alterar status do aviso:", error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Avisos do Sistema</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p>Carregando avisos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Avisos do Sistema</span>
            </CardTitle>
            <CardDescription>
              Gerencie avisos e notificações que aparecem para todos os usuários
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Aviso
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingNotice ? "Editar Aviso" : "Criar Novo Aviso"}
                </DialogTitle>
                <DialogDescription>
                  Configure as informações do aviso que será exibido no sistema
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Título do aviso"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select value={formData.type} onValueChange={(value: SystemNotice["type"]) => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Informação</SelectItem>
                        <SelectItem value="warning">Aviso</SelectItem>
                        <SelectItem value="error">Erro</SelectItem>
                        <SelectItem value="maintenance">Manutenção</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Conteúdo da mensagem do aviso"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select value={formData.priority} onValueChange={(value: SystemNotice["priority"]) => setFormData({...formData, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Data de Início</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Data de Fim (Opcional)</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                  />
                  <Label htmlFor="isActive">Aviso ativo</Label>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>
                  {editingNotice ? "Salvar Alterações" : "Criar Aviso"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="flex items-start space-x-4 p-4 border rounded-lg"
            >
              <div className="flex-shrink-0 mt-1">
                {getNoticeIcon(notice.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-medium text-foreground">{notice.title}</h3>
                  {getTypeBadge(notice.type)}
                  {getPriorityBadge(notice.priority)}
                  {notice.isActive ? (
                    <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                  ) : (
                    <Badge variant="secondary">Inativo</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {notice.message}
                </p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>Criado por: {notice.createdBy}</span>
                  <span>Início: {notice.startDate}</span>
                  {notice.endDate && <span>Fim: {notice.endDate}</span>}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleActive(notice.id)}
                  title={notice.isActive ? "Desativar" : "Ativar"}
                >
                  {notice.isActive ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(notice)}
                  title="Editar"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(notice.id)}
                  title="Excluir"
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {notices.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum aviso cadastrado</p>
              <p className="text-sm">Clique em "Novo Aviso" para criar o primeiro</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}