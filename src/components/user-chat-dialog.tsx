"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MessageSquare,
  Send,
  Paperclip,
  Image,
  FileText as FileIcon,
  X,
  FileText,
  User,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Code,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { CallCompletionDialog } from "./call-completion-dialog";
import { FeedbackService } from "@/services/feedback.service";
import { CreateCallFeedbackRequest } from "@/types/feedback";
import { CommentCreateRequest } from "@/types/api";

interface CallData {
  id: string;
  protocol?: string;
  issue: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  caller: string;
  workUnit: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  notes?: any[];
}

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  type: "user" | "technician" | "system";
  attachments?: {
    name: string;
    type: string;
    url: string;
  }[];
}

interface UserChatDialogProps {
  trigger: React.ReactNode;
  callData: CallData;
}

export function UserChatDialog({ trigger, callData }: UserChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check if call can be completed based on actual status values
  const canComplete = callData.status === "resolved" || callData.status === "closed";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load messages when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadMessages();
    }
  }, [isOpen]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const comments = await CallsService.getComments(parseInt(callData.id));
      
      const formattedMessages: Message[] = comments.map((comment) => ({
        id: comment.id.toString(),
        content: comment.content,
        sender: comment.author?.name || "Usuário",
        timestamp: comment.createdAt,
        type: comment.isInternal ? "technician" : "user",
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
      // Set empty array if no comments exist yet
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallCompleted = async (
    callId: string,
    wasResolved: boolean,
    feedback?: any
  ) => {
    try {
      // Submit feedback to backend
      const feedbackRequest: CreateCallFeedbackRequest = {
        wasResolved,
        rating: feedback?.rating,
        comment: feedback?.comment,
        reopenReason: feedback?.reopenReason,
      };

      await FeedbackService.submitFeedback(callId, feedbackRequest);

      const newStatus = wasResolved ? "Finalizado" : "Reaberto";

      // Add system message about completion
      const completionMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: wasResolved
          ? "✅ Chamado finalizado pelo usuário. Obrigado pela avaliação!"
          : "🔄 Chamado reaberto pelo usuário para nova análise.",
        sender: "Sistema",
        timestamp: new Date().toISOString(),
        type: "system",
      };

      setMessages((prev) => [...prev, completionMessage]);

      // Reload messages to get updated data
      await loadMessages();
    } catch (error) {
      console.error("Error handling call completion:", error);
      toast.error("Erro ao processar finalização do chamado");
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return;

    try {
      setIsLoading(true);

      // Create comment via API
      const commentData: CommentCreateRequest = {
        callId: parseInt(callData.id),
        content: newMessage,
        isInternal: false, // User messages are not internal
      };

      const newComment = await CallsService.addComment(commentData);

      // Add message to local state immediately for better UX
      const message: Message = {
        id: newComment.id.toString(),
        content: newMessage,
        sender: callData.caller,
        timestamp: newComment.createdAt,
        type: "user",
      };

      setMessages((prev) => [...prev, message]);
      setNewMessage("");
      setSelectedFiles([]);

      toast.success("Mensagem enviada com sucesso!");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Erro ao enviar mensagem");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error(`Arquivo ${file.name} é muito grande (máximo 10MB)`);
        return false;
      }
      return true;
    });

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatText = (format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = newMessage.substring(start, end);

    let formattedText = selectedText;
    let newCursorPos = start;

    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`;
        newCursorPos = start + (selectedText ? 2 : 2);
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        newCursorPos = start + (selectedText ? 1 : 1);
        break;
      case "underline":
        formattedText = `__${selectedText}__`;
        newCursorPos = start + (selectedText ? 2 : 2);
        break;
      case "list":
        formattedText = selectedText ? `- ${selectedText}` : "- ";
        newCursorPos = start + 2;
        break;
      case "orderedList":
        formattedText = selectedText ? `1. ${selectedText}` : "1. ";
        newCursorPos = start + 3;
        break;
      case "code":
        formattedText = `\`${selectedText}\``;
        newCursorPos = start + (selectedText ? 1 : 1);
        break;
    }

    const newText =
      newMessage.substring(0, start) +
      formattedText +
      newMessage.substring(end);

    setNewMessage(newText);

    // Set cursor position after formatting
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const renderMessage = (message: Message) => {
    const isUser = message.type === "user";
    const isSystem = message.type === "system";
    const isTechnician = message.type === "technician";

    return (
      <div
        key={message.id}
        className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
      >
        <div className={`max-w-[70%] ${isUser ? "order-2" : ""}`}>
          <div
            className={`rounded-lg p-3 ${
              isSystem
                ? "bg-blue-50 border border-blue-200 text-blue-800"
                : isTechnician
                ? "bg-green-50 border border-green-200 text-green-800"
                : isUser
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            <div className="text-sm whitespace-pre-wrap">{message.content}</div>

            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {message.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-white/10 rounded border"
                  >
                    {attachment.type.startsWith("image/") ? (
                      <Image className="h-4 w-4" />
                    ) : (
                      <FileIcon className="h-4 w-4" />
                    )}
                    <span className="text-xs flex-1">{attachment.name}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="text-xs opacity-70 mt-2">
              {message.sender} •{" "}
              {new Date(message.timestamp).toLocaleString("pt-BR")}
            </div>
          </div>
        </div>

        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ml-3 ${
            isUser ? "order-1 mr-3 ml-0" : ""
          }`}
          style={{
            backgroundColor: isSystem
              ? "#3b82f6"
              : isTechnician
              ? "#10b981"
              : isUser
              ? "#6366f1"
              : "#6b7280",
          }}
        >
          {isSystem
            ? "SYS"
            : message.sender
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Chamado #{callData.id} - {callData.issue}
          </DialogTitle>
          <DialogDescription>
            Acompanhe o andamento do seu chamado e converse com nossa equipe
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="chat" className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
          </TabsList>

          {/* Aba Chat */}
          <TabsContent value="chat" className="space-y-4">
            {/* Call Completion Button - Only show if call is closed */}
            {canComplete && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <div>
                        <h4 className="font-semibold text-green-800">
                          Chamado Finalizado
                        </h4>
                        <p className="text-sm text-green-700">
                          Seu chamado foi marcado como resolvido. Como foi o
                          atendimento?
                        </p>
                      </div>
                    </div>
                    <CallCompletionDialog
                      trigger={
                        <Button className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Avaliar Atendimento
                        </Button>
                      }
                      callData={{
                        ...callData,
                        protocol: callData.protocol || callData.id,
                      }}
                      onCallCompleted={handleCallCompleted}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Área de mensagens */}
            <div className="h-[400px] overflow-y-auto border rounded-lg p-4 space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-sm text-muted-foreground">
                    Carregando mensagens...
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-sm text-muted-foreground">
                    Nenhuma mensagem ainda. Seja o primeiro a comentar!
                  </div>
                </div>
              ) : (
                messages.map(renderMessage)
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Arquivos selecionados */}
            {selectedFiles.length > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <Label className="text-sm font-medium mb-2 block">
                  Arquivos selecionados:
                </Label>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white p-2 rounded border"
                    >
                      <div className="flex items-center gap-2">
                        <FileIcon className="h-4 w-4" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Barra de ferramentas de formatação e input de mensagem */}
            <div className="border rounded-lg p-3 bg-gray-50">
              {/* Text Formatting Toolbar */}
              <div className="flex items-center gap-1 mb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText("bold")}
                  className="h-8 w-8 p-0 hover:bg-gray-200"
                  title="Negrito"
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText("italic")}
                  className="h-8 w-8 p-0 hover:bg-gray-200"
                  title="Itálico"
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText("underline")}
                  className="h-8 w-8 p-0 hover:bg-gray-200"
                  title="Sublinhado"
                >
                  <Underline className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText("list")}
                  className="h-8 w-8 p-0 hover:bg-gray-200"
                  title="Lista"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText("orderedList")}
                  className="h-8 w-8 p-0 hover:bg-gray-200"
                  title="Lista Numerada"
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText("code")}
                  className="h-8 w-8 p-0 hover:bg-gray-200"
                  title="Código"
                >
                  <Code className="h-4 w-4" />
                </Button>
              </div>

              {/* Input de mensagem */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <Textarea
                    ref={textareaRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="min-h-[80px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-10 w-10 p-0"
                    title="Anexar arquivo"
                    disabled={isLoading}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={(!newMessage.trim() && selectedFiles.length === 0) || isLoading}
                    className="h-10 w-10 p-0"
                    title="Enviar mensagem"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Aba Detalhes do Chamado */}
          <TabsContent
            value="details"
            className="space-y-4 max-h-[60vh] overflow-y-auto px-1"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dados do Chamado */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Informações do Chamado
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="font-semibold text-sm">Protocolo:</Label>
                    <p className="text-sm">{callData.id}</p>
                  </div>
                  <div>
                    <Label className="font-semibold text-sm">Assunto:</Label>
                    <p className="text-sm">{callData.issue}</p>
                  </div>
                  <div>
                    <Label className="font-semibold text-sm">Descrição:</Label>
                    <p className="text-sm text-muted-foreground">
                      {callData.description}
                    </p>
                  </div>
                  <div>
                    <Label className="font-semibold text-sm">Status:</Label>
                    <div className="mt-1">
                      <Badge
                        variant={
                          callData.status === "Em atendimento"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {callData.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="font-semibold text-sm">Prioridade:</Label>
                    <div className="mt-1">
                      <Badge
                        variant={
                          callData.priority === "Alta"
                            ? "destructive"
                            : callData.priority === "Média"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {callData.priority}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="font-semibold text-sm">Categoria:</Label>
                    <p className="text-sm">{callData.category}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Dados do Solicitante */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Dados do Solicitante
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="font-semibold text-sm">Nome:</Label>
                    <p className="text-sm">{callData.caller}</p>
                  </div>
                  <div>
                    <Label className="font-semibold text-sm">Unidade:</Label>
                    <p className="text-sm">{callData.workUnit}</p>
                  </div>
                  <div>
                    <Label className="font-semibold text-sm">Criado em:</Label>
                    <p className="text-sm">
                      {new Date(callData.createdAt).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <Label className="font-semibold text-sm">
                      Última atualização:
                    </Label>
                    <p className="text-sm">
                      {new Date(callData.updatedAt).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  {callData.assignedTo && (
                    <div>
                      <Label className="font-semibold text-sm">
                        Atribuído a:
                      </Label>
                      <p className="text-sm">{callData.assignedTo}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
