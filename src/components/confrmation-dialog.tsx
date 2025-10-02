"use client";

import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Archive, Edit, Trash2, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BaseConfirmationDialogProps {
  trigger: ReactNode;
  title: string;
  description: string;
  onConfirm: () => Promise<void> | void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  confirmLabel: string;
  cancelLabel?: string;
  variant: "default" | "destructive" | "secondary";
  showWarning?: boolean;
  warningMessage?: string;
  icon: ReactNode;
  iconColor: string;
}

function BaseConfirmationDialog({
  trigger,
  title,
  description,
  onConfirm,
  open,
  onOpenChange,
  confirmLabel,
  cancelLabel = "Cancelar",
  variant,
  showWarning = true,
  warningMessage,
  icon,
  iconColor,
}: BaseConfirmationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setIsOpen(newOpen);
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);

    try {
      await onConfirm();
      handleOpenChange(false);
    } catch (error) {
      console.error("Erro na operação:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    handleOpenChange(false);
  };

  const dialogOpen = open !== undefined ? open : isOpen;

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className={iconColor}>{icon}</span>
            {title}
          </DialogTitle>
          <DialogDescription className="text-left">
            {description}
          </DialogDescription>
        </DialogHeader>

        {showWarning && warningMessage && (
          <Alert variant={variant === "destructive" ? "destructive" : "default"}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{warningMessage}</AlertDescription>
          </Alert>
        )}

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={variant}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Componente específico para EXCLUIR
interface DeleteDialogProps {
  trigger: ReactNode;
  itemName: string;
  itemType?: string;
  onConfirm: () => Promise<void> | void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  customWarning?: string;
}

export function DeleteDialog({
  trigger,
  itemName,
  itemType = "item",
  onConfirm,
  open,
  onOpenChange,
  customWarning,
}: DeleteDialogProps) {
  return (
    <BaseConfirmationDialog
      trigger={trigger}
      title={`Excluir ${itemType}`}
      description={`Tem certeza que deseja excluir "${itemName}"? Esta ação não pode ser desfeita.`}
      onConfirm={onConfirm}
      open={open}
      onOpenChange={onOpenChange}
      confirmLabel="Sim, excluir"
      variant="destructive"
      showWarning={true}
      warningMessage={
        customWarning ||
        "Esta ação é permanente e não pode ser desfeita. Todos os dados relacionados serão perdidos."
      }
      icon={<Trash2 className="h-5 w-5" />}
      iconColor="text-red-500"
    />
  );
}

// Componente específico para ARQUIVAR
interface ArchiveDialogProps {
  trigger: ReactNode;
  itemName: string;
  itemType?: string;
  onConfirm: () => Promise<void> | void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  customWarning?: string;
}

export function ArchiveDialog({
  trigger,
  itemName,
  itemType = "item",
  onConfirm,
  open,
  onOpenChange,
  customWarning,
}: ArchiveDialogProps) {
  return (
    <BaseConfirmationDialog
      trigger={trigger}
      title={`Arquivar ${itemType}`}
      description={`Tem certeza que deseja arquivar "${itemName}"? O item será movido para o arquivo.`}
      onConfirm={onConfirm}
      open={open}
      onOpenChange={onOpenChange}
      confirmLabel="Sim, arquivar"
      variant="secondary"
      showWarning={true}
      warningMessage={
        customWarning ||
        "O item será arquivado e removido da lista ativa. Você poderá acessá-lo na seção de arquivos."
      }
      icon={<Archive className="h-5 w-5" />}
      iconColor="text-orange-500"
    />
  );
}

// Componente específico para EDITAR (confirmação antes de editar)
interface EditDialogProps {
  trigger: ReactNode;
  itemName: string;
  itemType?: string;
  onConfirm: () => Promise<void> | void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  customWarning?: string;
}

export function EditDialog({
  trigger,
  itemName,
  itemType = "item",
  onConfirm,
  open,
  onOpenChange,
  customWarning,
}: EditDialogProps) {
  return (
    <BaseConfirmationDialog
      trigger={trigger}
      title={`Editar ${itemType}`}
      description={`Deseja editar "${itemName}"? Você será redirecionado para o formulário de edição.`}
      onConfirm={onConfirm}
      open={open}
      onOpenChange={onOpenChange}
      confirmLabel="Sim, editar"
      variant="default"
      showWarning={false}
      warningMessage={customWarning}
      icon={<Edit className="h-5 w-5" />}
      iconColor="text-blue-500"
    />
  );
}

// Componentes específicos para CHAMADOS
export function DeleteCallDialog({
  trigger,
  callId,
  callTitle,
  onConfirm,
  ...props
}: Omit<DeleteDialogProps, "itemName" | "itemType"> & {
  callId: string;
  callTitle: string;
}) {
  return (
    <DeleteDialog
      trigger={trigger}
      itemName={`#${callId} - ${callTitle}`}
      itemType="chamado"
      onConfirm={onConfirm}
      customWarning="Este chamado será excluído permanentemente. Todos os comentários, anexos e histórico serão perdidos."
      {...props}
    />
  );
}

export function ArchiveCallDialog({
  trigger,
  callId,
  callTitle,
  onConfirm,
  ...props
}: Omit<ArchiveDialogProps, "itemName" | "itemType"> & {
  callId: string;
  callTitle: string;
}) {
  return (
    <ArchiveDialog
      trigger={trigger}
      itemName={`#${callId} - ${callTitle}`}
      itemType="chamado"
      onConfirm={onConfirm}
      customWarning="Este chamado será arquivado e removido da lista ativa. Você poderá acessá-lo na seção de chamados arquivados."
      {...props}
    />
  );
}

export function EditCallDialog({
  trigger,
  callId,
  callTitle,
  onConfirm,
  ...props
}: Omit<EditDialogProps, "itemName" | "itemType"> & {
  callId: string;
  callTitle: string;
}) {
  return (
    <EditDialog
      trigger={trigger}
      itemName={`#${callId} - ${callTitle}`}
      itemType="chamado"
      onConfirm={onConfirm}
      customWarning="Você será redirecionado para o formulário de edição do chamado."
      {...props}
    />
  );
}

// Componentes específicos para USUÁRIOS
export function DeleteUserDialog({
  trigger,
  userName,
  userEmail,
  onConfirm,
  ...props
}: Omit<DeleteDialogProps, "itemName" | "itemType"> & {
  userName: string;
  userEmail: string;
}) {
  return (
    <DeleteDialog
      trigger={trigger}
      itemName={`${userName} (${userEmail})`}
      itemType="usuário"
      onConfirm={onConfirm}
      customWarning="Este usuário será excluído permanentemente. Todos os chamados e atividades relacionadas serão mantidos, mas não poderão ser associados a este usuário."
      {...props}
    />
  );
}

export function ArchiveUserDialog({
  trigger,
  userName,
  userEmail,
  onConfirm,
  ...props
}: Omit<ArchiveDialogProps, "itemName" | "itemType"> & {
  userName: string;
  userEmail: string;
}) {
  return (
    <ArchiveDialog
      trigger={trigger}
      itemName={`${userName} (${userEmail})`}
      itemType="usuário"
      onConfirm={onConfirm}
      customWarning="Este usuário será arquivado e não poderá mais fazer login no sistema. Seus dados serão preservados."
      {...props}
    />
  );
}

export function EditUserDialog({
  trigger,
  userName,
  userEmail,
  onConfirm,
  ...props
}: Omit<EditDialogProps, "itemName" | "itemType"> & {
  userName: string;
  userEmail: string;
}) {
  return (
    <EditDialog
      trigger={trigger}
      itemName={`${userName} (${userEmail})`}
      itemType="usuário"
      onConfirm={onConfirm}
      customWarning="Você será redirecionado para o formulário de edição do usuário."
      {...props}
    />
  );
}
