"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  XCircle,
  Star,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { toast } from "sonner";

interface CallData {
  id: string;
  protocol: string;
  caller: string;
  issue: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

interface CallCompletionDialogProps {
  trigger: React.ReactNode;
  callData: CallData;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCallCompleted?: (
    callId: string,
    wasResolved: boolean,
    feedback?: CallFeedback
  ) => void;
}

interface CallFeedback {
  wasResolved: boolean;
  rating?: number;
  comment?: string;
  reopenReason?: string;
}

export function CallCompletionDialog({
  trigger,
  callData,
  open,
  onOpenChange,
  onCallCompleted,
}: CallCompletionDialogProps) {
  const [step, setStep] = useState<"confirmation" | "feedback" | "reopen">(
    "confirmation"
  );
  const [wasResolved, setWasResolved] = useState<boolean | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [reopenReason, setReopenReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResolutionChoice = (resolved: boolean) => {
    setWasResolved(resolved);
    if (resolved) {
      setStep("feedback");
    } else {
      setStep("reopen");
    }
  };

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleSubmitFeedback = async () => {
    setIsSubmitting(true);

    try {
      const feedback: CallFeedback = {
        wasResolved: wasResolved!,
        rating: wasResolved ? rating : undefined,
        comment: wasResolved ? comment : undefined,
        reopenReason: !wasResolved ? reopenReason : undefined,
      };

      // Simular chamada para API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onCallCompleted?.(callData.id, wasResolved!, feedback);

      if (wasResolved) {
        toast.success(
          "Obrigado pela sua avaliação! O chamado foi finalizado com sucesso."
        );
      } else {
        toast.success(
          "Chamado reaberto com sucesso. Nossa equipe irá analisar novamente."
        );
      }

      // Reset form
      setStep("confirmation");
      setWasResolved(null);
      setRating(0);
      setComment("");
      setReopenReason("");
      onOpenChange?.(false);
    } catch (error) {
      toast.error("Erro ao processar sua solicitação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex items-center justify-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            className={`p-1 rounded transition-colors ${
              star <= rating
                ? "text-yellow-500 hover:text-yellow-600"
                : "text-gray-300 hover:text-gray-400"
            }`}
          >
            <Star
              className={`h-8 w-8 ${star <= rating ? "fill-current" : ""}`}
            />
          </button>
        ))}
      </div>
    );
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return "Muito insatisfeito";
      case 2:
        return "Insatisfeito";
      case 3:
        return "Neutro";
      case 4:
        return "Satisfeito";
      case 5:
        return "Muito satisfeito";
      default:
        return "Selecione uma avaliação";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Finalização do Chamado
          </DialogTitle>
          <DialogDescription>
            Chamado #{callData.protocol} - {callData.issue}
          </DialogDescription>
        </DialogHeader>

        {/* Informações do Chamado */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Resumo do Chamado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="font-medium text-gray-600">
                  Solicitante:
                </Label>
                <p>{callData.caller}</p>
              </div>
              <div>
                <Label className="font-medium text-gray-600">Categoria:</Label>
                <p>{callData.category}</p>
              </div>
              <div>
                <Label className="font-medium text-gray-600">Prioridade:</Label>
                <Badge variant="outline" className="text-xs">
                  {callData.priority}
                </Badge>
              </div>
              <div>
                <Label className="font-medium text-gray-600">Técnico:</Label>
                <p>{callData.assignedTo || "Não atribuído"}</p>
              </div>
            </div>
            <Separator className="my-2" />
            <div>
              <Label className="font-medium text-gray-600">Descrição:</Label>
              <p className="text-sm text-gray-700 mt-1">
                {callData.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Confirmação de Resolução */}
        {step === "confirmation" && (
          <div className="space-y-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                O seu problema foi resolvido?
              </h3>
              <p className="text-gray-600 mb-6">
                Por favor, confirme se o chamado foi resolvido
                satisfatoriamente.
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => handleResolutionChoice(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <ThumbsUp className="h-5 w-5" />
                Sim, foi resolvido
              </Button>
              <Button
                onClick={() => handleResolutionChoice(false)}
                variant="outline"
                className="flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50"
                size="lg"
              >
                <ThumbsDown className="h-5 w-5" />
                Não, ainda há problemas
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Avaliação (quando resolvido) */}
        {step === "feedback" && wasResolved && (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Ótimo! Como você avalia o atendimento?
              </h3>
              <p className="text-gray-600 mb-6">
                Sua avaliação nos ajuda a melhorar nossos serviços.
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <Label className="text-base font-medium mb-4 block">
                  Avaliação do Atendimento
                </Label>
                {renderStars()}
                <p className="text-sm text-gray-600 mt-2">
                  {getRatingText(rating)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">
                  Comentários adicionais (opcional)
                </Label>
                <Textarea
                  id="comment"
                  placeholder="Deixe um comentário sobre o atendimento recebido..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setStep("confirmation")}>
                Voltar
              </Button>
              <Button
                onClick={handleSubmitFeedback}
                disabled={rating === 0 || isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Finalizando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Finalizar Chamado
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Reabertura (quando não resolvido) */}
        {step === "reopen" && !wasResolved && (
          <div className="space-y-6">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Vamos reabrir seu chamado
              </h3>
              <p className="text-gray-600 mb-6">
                Por favor, descreva o que ainda precisa ser resolvido.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reopenReason">
                  Motivo da reabertura <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="reopenReason"
                  placeholder="Descreva detalhadamente o que ainda não foi resolvido ou novos problemas encontrados..."
                  value={reopenReason}
                  onChange={(e) => setReopenReason(e.target.value)}
                  rows={4}
                  required
                />
                <p className="text-xs text-gray-500">
                  Seja específico para que nossa equipe possa resolver
                  rapidamente.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setStep("confirmation")}>
                Voltar
              </Button>
              <Button
                onClick={handleSubmitFeedback}
                disabled={!reopenReason.trim() || isSubmitting}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Reabrindo...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reabrir Chamado
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
