"use client";

import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getStatusBadge, getPriorityBadge, getCategoryBadge, getUnitBadge, getRoleBadge, getUserStatusBadge } from "@/lib/badge-utils";

interface DetailField {
  label: string;
  value: string | ReactNode;
  type?: 'text' | 'badge' | 'date' | 'status' | 'priority' | 'category' | 'unit' | 'role' | 'user_status';
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

interface ViewDetailsDialogProps {
  trigger: ReactNode;
  title: string;
  description?: string;
  fields: DetailField[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const formatValue = (field: DetailField) => {
  if (field.type === 'badge') {
    return (
      <Badge variant={field.badgeVariant || 'default'}>
        {field.value}
      </Badge>
    );
  }
  
  if (field.type === 'date' && typeof field.value === 'string') {
    return new Date(field.value).toLocaleString('pt-BR');
  }
  
  if (field.type === 'status') {
    return getStatusBadge(String(field.value));
  }
  
  if (field.type === 'priority') {
    return getPriorityBadge(String(field.value));
  }
  
  if (field.type === 'category') {
    return getCategoryBadge(String(field.value));
  }
  
  if (field.type === 'unit') {
    return getUnitBadge(String(field.value));
  }
  
  if (field.type === 'role') {
    return getRoleBadge(String(field.value));
  }
  
  if (field.type === 'user_status') {
    const isActive = String(field.value).toLowerCase() === 'ativo' || field.value === true;
    return getUserStatusBadge(isActive);
  }
  
  return field.value;
};

export function ViewDetailsDialog({
  trigger,
  title,
  description,
  fields,
  open,
  onOpenChange
}: ViewDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={index}>
                <div className="grid grid-cols-3 gap-4 py-2">
                  <div className="font-medium text-sm text-muted-foreground">
                    {field.label}:
                  </div>
                  <div className="col-span-2 text-sm">
                    {formatValue(field)}
                  </div>
                </div>
                {index < fields.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}