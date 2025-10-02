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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Database,
  Download,
  Upload,
  Settings,
  Clock,
  AlertTriangle,
  CheckCircle,
  Play,
} from "lucide-react";
import { SettingsService } from "@/services/settings.service";

// Types for backup management
interface BackupRecord {
  id: string;
  name: string;
  type: "automatic" | "manual";
  size: string;
  date: string;
  status: "completed" | "failed" | "in_progress";
  description: string;
}

const getStatusBadge = (status: BackupRecord["status"]) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-100 text-green-800">Concluído</Badge>;
    case "failed":
      return <Badge className="bg-red-100 text-red-800">Falhou</Badge>;
    case "in_progress":
      return <Badge className="bg-blue-100 text-blue-800">Em Progresso</Badge>;
    default:
      return <Badge variant="outline">Desconhecido</Badge>;
  }
};

const getTypeIcon = (type: BackupRecord["type"]) => {
  return type === "automatic" ? (
    <Clock className="h-4 w-4 text-blue-600" />
  ) : (
    <Settings className="h-4 w-4 text-green-600" />
  );
};

export default function BackupPage() {
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [backupSchedule, setBackupSchedule] = useState("daily");
  const [retentionDays, setRetentionDays] = useState("30");
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupRecord | null>(null);

  // Load backup data from API
  useEffect(() => {
    loadBackupData();
  }, []);

  const loadBackupData = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API calls when backend is ready
      // const [backupsData, settingsData] = await Promise.all([
      //   SettingsService.getBackups(),
      //   SettingsService.getBackupSettings()
      // ]);
      // setBackups(backupsData);
      // setAutoBackupEnabled(settingsData.autoBackupEnabled);
      // setBackupSchedule(settingsData.schedule);
      // setRetentionDays(settingsData.retentionDays.toString());
      
      // Temporary empty array until backend is ready
      setBackups([]);
    } catch (error) {
      console.error("Error loading backup data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    try {
      // TODO: Replace with actual API call when backend is ready
      // await SettingsService.createBackup();
      // await loadBackupData();
      
      // Simulate backup creation
      setTimeout(() => {
        setIsCreatingBackup(false);
        console.log("Backup created successfully");
      }, 3000);
    } catch (error) {
      console.error("Error creating backup:", error);
      setIsCreatingBackup(false);
    }
  };

  const handleRestoreBackup = async () => {
    if (!selectedBackup) return;
    
    try {
      // TODO: Replace with actual API call when backend is ready
      // await SettingsService.restoreBackup(selectedBackup.id);
      console.log("Restoring backup:", selectedBackup.id);
      setShowRestoreDialog(false);
      setSelectedBackup(null);
    } catch (error) {
      console.error("Error restoring backup:", error);
    }
  };

  const handleUpdateSettings = async () => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // await SettingsService.updateBackupSettings({
      //   autoBackupEnabled,
      //   schedule: backupSchedule,
      //   retentionDays: parseInt(retentionDays)
      // });
      console.log("Backup settings updated");
    } catch (error) {
      console.error("Error updating backup settings:", error);
    }
  };

  // Load backups from backend
  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await BackupService.getAll();
      // setBackups(response);
      setBackups([]);
    } catch (error) {
      console.error("Erro ao carregar backups:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Backup e Restauração</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p>Carregando dados de backup...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Backup e Restauração</h1>
        <Button onClick={handleCreateBackup} disabled={isCreatingBackup}>
          {isCreatingBackup ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Criando Backup...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Criar Backup Manual
            </>
          )}
        </Button>
      </div>

      {/* Backup Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Configurações de Backup</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="autoBackup"
              checked={autoBackupEnabled}
              onCheckedChange={setAutoBackupEnabled}
            />
            <Label htmlFor="autoBackup">Backup automático habilitado</Label>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schedule">Frequência</Label>
              <Select value={backupSchedule} onValueChange={setBackupSchedule}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diário</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="retention">Retenção (dias)</Label>
              <Input
                id="retention"
                type="number"
                value={retentionDays}
                onChange={(e) => setRetentionDays(e.target.value)}
              />
            </div>
          </div>
          
          <Button onClick={handleUpdateSettings}>
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>

      {/* Backup History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Histórico de Backups</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {backups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum backup disponível</p>
              <p className="text-sm">Os backups serão exibidos quando o backend estiver disponível</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backups.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(backup.type)}
                        <span className="capitalize">{backup.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{backup.name}</TableCell>
                    <TableCell>{backup.size}</TableCell>
                    <TableCell>{backup.date}</TableCell>
                    <TableCell>{getStatusBadge(backup.status)}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {backup.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {backup.status === "completed" && (
                          <>
                            <Button variant="ghost" size="icon" title="Download">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Restaurar"
                              onClick={() => {
                                setSelectedBackup(backup);
                                setShowRestoreDialog(true);
                              }}
                            >
                              <Upload className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Restore Confirmation Dialog */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span>Confirmar Restauração</span>
            </DialogTitle>
            <DialogDescription>
              <strong>ATENÇÃO:</strong> Esta ação irá substituir todos os dados atuais
              pelos dados do backup selecionado. Esta operação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          {selectedBackup && (
            <div className="space-y-2">
              <p><strong>Backup:</strong> {selectedBackup.name}</p>
              <p><strong>Data:</strong> {selectedBackup.date}</p>
              <p><strong>Tamanho:</strong> {selectedBackup.size}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRestoreDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleRestoreBackup}>
              Confirmar Restauração
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}