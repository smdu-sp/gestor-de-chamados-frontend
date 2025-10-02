"use client";

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  MessageSquare,
  FileText,
  Send,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Code,
  Paperclip,
  Image,
  FileText as FileIcon,
  X,
  Info,
  StickyNote,
  User,
} from "lucide-react";
import {
  getStatusBadge,
  getPriorityBadge,
  getCategoryBadge,
  getUnitBadge,
} from "@/lib/badge-utils";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isSystem?: boolean;
  senderType: "user" | "technician" | "system";
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
}

interface SystemNotification {
  id: string;
  type: "status_change" | "assignment" | "transfer" | "note_added";
  message: string;
  timestamp: string;
  details?: any;
}

interface CallNote {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  isInternal: boolean;
}

interface CallData {
  id: string;
  protocol: string;
  caller: string;
  email: string;
  phone: string;
  workUnit: string;
  issue: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string | CallNote[];
}

interface ChatResponseDialogProps {
  trigger: React.ReactNode;
  callData: CallData;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ChatResponseDialog({
  trigger,
  callData,
  open,
  onOpenChange,
}: ChatResponseDialogProps) {
  const { user } = useAuth();

  const [newNote, setNewNote] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content: `Chamado criado por ${callData.caller}`,
      sender: "Sistema",
      timestamp: callData.createdAt,
      isSystem: true,
      senderType: "system",
    },
    {
      id: "2",
      content: callData.description,
      sender: callData.caller,
      timestamp: callData.createdAt,
      senderType: "user",
    },
  ]);

  const [callNotes, setCallNotes] = useState<CallNote[]>([]);
  const [systemNotifications, setSystemNotifications] = useState<
    SystemNotification[]
  >([]);

  const isTechnician =
    user?.role === "technician" ||
    user?.role === "admin" ||
    user?.role === "developer";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR");
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    const senderType = isTechnician ? "technician" : "user";
    let attachments: any[] = [];

    // Upload files if any
    if (selectedFiles.length > 0) {
      setIsUploading(true);
      try {
        attachments = await uploadFiles(selectedFiles);
      } catch (error) {
        toast.error("Erro ao enviar arquivos");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    const message: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender: user.name,
      timestamp: new Date().toISOString(),
      senderType,
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    setMessages([...messages, message]);
    setNewMessage("");
    setSelectedFiles([]);

    // Add system notification for technicians when user sends message
    if (!isTechnician) {
      addSystemNotification("Nova mensagem do usuário", "message");
    }

    console.log("Nova mensagem enviada:", message);
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !user || !isTechnician) return;

    const note: CallNote = {
      id: Date.now().toString(),
      content: newNote,
      author: user.name,
      timestamp: new Date().toISOString(),
      isInternal: true,
    };

    setCallNotes([...callNotes, note]);
    setNewNote("");

    // Add system notification
    addSystemNotification(`Anotação adicionada por ${user.name}`, "note_added");

    toast.success("Anotação adicionada com sucesso");
  };

  const addSystemNotification = (message: string, type: string) => {
    if (!isTechnician) return; // Only show to technicians

    const notification: SystemNotification = {
      id: Date.now().toString(),
      type: type as any,
      message,
      timestamp: new Date().toISOString(),
    };

    setSystemNotifications((prev) => [...prev, notification]);
  };

  const uploadFiles = async (files: File[]): Promise<any[]> => {
    try {
      // TODO: Replace with actual file upload API call when backend is ready
      // const uploadPromises = files.map(file => FileService.upload(file));
      // return await Promise.all(uploadPromises);

      // For now, return empty array to prevent errors
      console.log(
        "File upload not implemented yet:",
        files.map((f) => f.name)
      );
      return [];
    } catch (error) {
      console.error("Erro ao fazer upload dos arquivos:", error);
      throw error;
    }
  };

  const handleFileSelectChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatText = (format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = isInternalNote && isTechnician ? newNote : newMessage;
    const selectedText = currentValue.substring(start, end);

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
      currentValue.substring(0, start) +
      formattedText +
      currentValue.substring(end);

    if (isInternalNote && isTechnician) {
      setNewNote(newText);
    } else {
      setNewMessage(newText);
    }

    // Set cursor position after formatting
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const renderMessage = (message: ChatMessage) => {
    const isCurrentUser = message.sender === user?.name;
    const isSystemMessage = message.senderType === "system";
    const isTechnicianMessage = message.senderType === "technician";

    let bgColor = "bg-gray-50";
    let borderColor = "border-gray-200";
    let textColor = "text-gray-800";
    let alignment = "justify-start";

    if (isSystemMessage) {
      bgColor = "bg-blue-50";
      borderColor = "border-blue-200";
      textColor = "text-blue-800";
    } else if (isTechnicianMessage) {
      bgColor = "bg-green-50";
      borderColor = "border-green-200";
      textColor = "text-green-800";
      alignment = "justify-end";
    } else {
      alignment = "justify-start";
    }

    if (isCurrentUser && !isSystemMessage) {
      alignment = "justify-end";
    }

    return (
      <div key={message.id} className={`flex ${alignment} mb-4`}>
        <div
          className={`max-w-[70%] ${
            alignment === "justify-end" ? "order-2" : ""
          }`}
        >
          <div
            className={`${bgColor} ${borderColor} border rounded-lg p-3 ${textColor}`}
          >
            <div className="text-sm whitespace-pre-wrap">{message.content}</div>

            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {message.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center gap-2 p-2 bg-white rounded border"
                  >
                    {attachment.type.startsWith("image/") ? (
                      <Image className="h-4 w-4" />
                    ) : (
                      <FileIcon className="h-4 w-4" />
                    )}
                    <span className="text-xs flex-1">{attachment.name}</span>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <FileText className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="text-xs opacity-70 mt-2">
              {message.sender} • {formatDate(message.timestamp)}
            </div>
          </div>
        </div>

        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ml-3 ${
            alignment === "justify-end" ? "order-1 mr-3 ml-0" : ""
          }`}
          style={{
            backgroundColor: isSystemMessage
              ? "#3b82f6"
              : isTechnicianMessage
              ? "#10b981"
              : "#6b7280",
          }}
        >
          {isSystemMessage
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Chamado #{callData.protocol} - {callData.issue}
          </DialogTitle>
          <DialogDescription>
            {isTechnician
              ? "Responda ao chamado e gerencie as informações"
              : "Visualize e acompanhe seu chamado"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="chat" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="dados">Dados</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex flex-col flex-1 mt-2">
            <ScrollArea className="flex-1 w-full border rounded-lg max-h-[500px]">
              <div className="p-4 space-y-4">
                {/* Messages Area */}
                <div className="space-y-2">
                  {messages.map(renderMessage)}

                  {/* System Notifications for Technicians */}
                  {isTechnician &&
                    systemNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex justify-center mb-2"
                      >
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-xs text-yellow-800">
                          🔔 {notification.message} •{" "}
                          {formatDate(notification.timestamp)}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Enhanced Message Input Section */}
                <div className="border-t pt-4 space-y-4">
                  {/* Enhanced Toggle for Internal Notes (Technicians only) */}
                  {isTechnician && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Switch
                            id="internal-note-toggle"
                            checked={isInternalNote}
                            onCheckedChange={setIsInternalNote}
                          />
                          <Label
                            htmlFor="internal-note-toggle"
                            className="text-sm font-medium flex items-center gap-2 cursor-pointer"
                          >
                            <StickyNote
                              className={`h-5 w-5 ${
                                isInternalNote
                                  ? "text-yellow-600"
                                  : "text-blue-600"
                              }`}
                            />
                            {isInternalNote
                              ? "Modo: Anotação Interna"
                              : "Modo: Mensagem do Chat"}
                          </Label>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isInternalNote
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-blue-200 text-blue-800"
                          }`}
                        >
                          {isInternalNote ? "Privado" : "Público"}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        {isInternalNote
                          ? "Anotações internas são visíveis apenas para técnicos"
                          : "Mensagens do chat são visíveis para todos os participantes"}
                      </p>
                    </div>
                  )}

                  {/* Text Formatting Toolbar */}
                  <div className="border rounded-lg p-3 bg-gray-50">
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

                    {/* Enhanced Input with File Attachment */}
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Textarea
                          ref={textareaRef}
                          placeholder={
                            isInternalNote && isTechnician
                              ? "Adicionar anotação interna do chamado..."
                              : "Digite sua mensagem..."
                          }
                          value={
                            isInternalNote && isTechnician
                              ? newNote
                              : newMessage
                          }
                          onChange={(e) => {
                            if (isInternalNote && isTechnician) {
                              setNewNote(e.target.value);
                            } else {
                              setNewMessage(e.target.value);
                            }
                          }}
                          className="min-h-[100px] resize-none"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              if (isInternalNote && isTechnician) {
                                handleAddNote();
                              } else {
                                handleSendMessage();
                              }
                            }
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        {/* File Attachment Button (only for chat messages, not internal notes) */}
                        {!isInternalNote && (
                          <>
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileSelectChange}
                              multiple
                              className="hidden"
                              accept="image/*,.pdf,.doc,.docx,.txt"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isUploading}
                              className="h-10 w-10 p-0"
                              title="Anexar arquivo"
                            >
                              <Paperclip className="h-4 w-4" />
                            </Button>
                          </>
                        )}

                        {/* Send Button */}
                        <Button
                          onClick={
                            isInternalNote && isTechnician
                              ? handleAddNote
                              : handleSendMessage
                          }
                          disabled={
                            isUploading ||
                            (isInternalNote && isTechnician
                              ? !newNote.trim()
                              : !newMessage.trim())
                          }
                          className="h-10 w-10 p-0"
                          title={
                            isInternalNote && isTechnician
                              ? "Adicionar anotação"
                              : "Enviar mensagem"
                          }
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Display Selected Files (only when not internal note) */}
                  {!isInternalNote && selectedFiles.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-600">
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

                  {/* Display Notes (for technicians) */}
                  {isTechnician && callNotes.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-600">
                        Anotações internas:
                      </Label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {callNotes.map((note) => (
                          <div
                            key={note.id}
                            className="bg-yellow-50 border border-yellow-200 rounded p-2"
                          >
                            <p className="text-sm">{note.content}</p>
                            <p className="text-xs text-yellow-600 mt-1">
                              {note.author} • {formatDate(note.timestamp)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="history" className="mt-2">
            <div className="max-h-[500px] overflow-y-auto">
              <div className="flex flex-col items-center py-6">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Histórico do Chamado
                  </h3>
                  <p className="text-sm text-gray-600 max-w-md">
                    Acompanhe todas as atividades e mudanças relacionadas a este
                    chamado
                  </p>
                </div>

                {/* Timeline Container */}
                <div className="relative max-w-2xl w-full">
                  {/* Vertical Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                  {/* Timeline Items */}
                  <div className="space-y-8">
                    {/* Chamado Criado */}
                    <div className="relative flex items-start">
                      <div className="absolute left-4 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-md z-10"></div>
                      <div className="ml-12 bg-white rounded-lg border border-gray-200 shadow-sm p-4 w-full">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <h4 className="font-semibold text-gray-800">
                            Chamado Criado
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Chamado #{callData.protocol} foi criado no sistema
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>👤 {callData.caller}</span>
                          <span>📅 {formatDate(callData.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Chamado Atribuído */}
                    {callData.assignedTo && (
                      <div className="relative flex items-start">
                        <div className="absolute left-4 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-md z-10"></div>
                        <div className="ml-12 bg-white rounded-lg border border-gray-200 shadow-sm p-4 w-full">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <h4 className="font-semibold text-gray-800">
                              Chamado Atribuído
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Chamado foi atribuído para um técnico responsável
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>👨‍💻 {callData.assignedTo}</span>
                            <span>📅 {formatDate(callData.updatedAt)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Status Atualizado */}
                    <div className="relative flex items-start">
                      <div className="absolute left-4 w-4 h-4 bg-yellow-500 rounded-full border-4 border-white shadow-md z-10"></div>
                      <div className="ml-12 bg-white rounded-lg border border-gray-200 shadow-sm p-4 w-full">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <h4 className="font-semibold text-gray-800">
                            Status Atualizado
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Status do chamado foi alterado para:{" "}
                          <span className="font-medium">{callData.status}</span>
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>🔄 Sistema</span>
                          <span>📅 {formatDate(callData.updatedAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Adicionar mais eventos da timeline conforme necessário */}
                    {/* Exemplo de evento adicional */}
                    <div className="relative flex items-start">
                      <div className="absolute left-4 w-4 h-4 bg-purple-500 rounded-full border-4 border-white shadow-md z-10"></div>
                      <div className="ml-12 bg-white rounded-lg border border-gray-200 shadow-sm p-4 w-full">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <h4 className="font-semibold text-gray-800">
                            Última Atividade
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Chamado está sendo acompanhado e aguardando resolução
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>⏰ Em andamento</span>
                          <span>📅 {formatDate(callData.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dados" className="mt-2">
            <div className="max-h-[500px] overflow-y-auto space-y-6 p-4">
              {/* Informações do Chamado */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Informações do Chamado
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Protocolo
                      </Label>
                      <p className="text-sm font-mono">{callData.protocol}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Problema
                      </Label>
                      <p className="text-sm">{callData.issue}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Descrição
                    </Label>
                    <p className="text-sm mt-1">{callData.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Técnico Responsável
                      </Label>
                      <p className="text-sm">
                        {callData.assignedTo || "Não atribuído"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Data de Criação
                      </Label>
                      <p className="text-sm">
                        {formatDate(callData.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Última Atualização
                      </Label>
                      <p className="text-sm">
                        {formatDate(callData.updatedAt)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Tempo em Aberto
                      </Label>
                      <p className="text-sm">
                        {Math.ceil(
                          (new Date().getTime() -
                            new Date(callData.createdAt).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        dias
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {getStatusBadge(callData.status)}
                    {getPriorityBadge(callData.priority)}
                    {getCategoryBadge(callData.category)}
                    {getUnitBadge(callData.workUnit)}
                  </div>

                  {callData.notes && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Observações
                      </Label>
                      {typeof callData.notes === "string" ? (
                        <p className="text-sm mt-1">{callData.notes}</p>
                      ) : (
                        <div className="space-y-2 mt-2">
                          {(callData.notes as CallNote[]).map((note) => (
                            <div
                              key={note.id}
                              className="bg-gray-50 p-2 rounded border"
                            >
                              <p className="text-sm">{note.content}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {note.author} • {formatDate(note.timestamp)}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Dados do Solicitante */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Dados do Solicitante
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Nome
                      </Label>
                      <p className="text-sm">{callData.caller}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        E-mail
                      </Label>
                      <p className="text-sm">{callData.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Telefone
                      </Label>
                      <p className="text-sm">{callData.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Unidade de Trabalho
                      </Label>
                      <p className="text-sm">{callData.workUnit}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
