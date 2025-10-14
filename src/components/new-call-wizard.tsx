"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Phone,
  Printer,
  Wrench,
  Monitor,
  Computer,
  ChevronLeft,
  ChevronRight,
  Check,
  Plus,
  Loader2,
} from "lucide-react";
import { GoCallsService } from "@/services/go-calls.service";
import { GoUsersService } from "@/services/go-users.service";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import type { GoCreateCallRequest } from "@/types/go-backend";

// Tipos de chamado disponíveis
const callTypes = [
  {
    id: "voip",
    name: "VOIP",
    description: "Problemas com telefonia IP, ramais e comunicação",
    icon: Phone,
    color: "bg-blue-500",
  },
  {
    id: "impressora",
    name: "IMPRESSORA",
    description:
      "Problemas com impressoras, scanners e equipamentos de impressão",
    icon: Printer,
    color: "bg-green-500",
  },
  {
    id: "manutencao",
    name: "MANUTENÇÃO",
    description: "Manutenção preventiva e corretiva de equipamentos",
    icon: Wrench,
    color: "bg-orange-500",
  },
  {
    id: "sistemas",
    name: "SISTEMAS",
    description: "Problemas com softwares, aplicações e sistemas internos",
    icon: Monitor,
    color: "bg-purple-500",
  },
  {
    id: "hardware",
    name: "HARDWARE",
    description: "Problemas com hardware, desktops e notebooks",
    icon: Computer,
    color: "bg-red-500",
  },
];

// Subcategorias para cada tipo de chamado
const subcategories = {
  voip: [
    { id: "erro", name: "Erro" },
    { id: "criacao-ramal", name: "Criação de ramal" },
    { id: "configuracao-ramal", name: "Configuração de ramal" },
    { id: "outros", name: "Outros" },
  ],
  manutencao: [
    { id: "luz", name: "Luz" },
    { id: "tomadas", name: "Tomadas" },
    { id: "encanamento", name: "Encanamento" },
    { id: "moveis-quebrados", name: "Móveis quebrados" },
    { id: "outros", name: "Outros" },
  ],
  hardware: [
    { id: "computador", name: "Computador" },
    { id: "mouse", name: "Mouse" },
    { id: "teclado", name: "Teclado" },
    { id: "notebook", name: "Notebook" },
    { id: "camera", name: "Câmera" },
    { id: "projetor", name: "Projetor" },
    { id: "outros", name: "Outros" },
  ],
  impressora: [
    { id: "erro", name: "Erro" },
    { id: "falta-papel", name: "Falta de papel" },
    { id: "instalacao-impressora", name: "Instalação de impressora" },
    {
      id: "solicitacao-nova-impressora",
      name: "Solicitação de nova impressora",
    },
    { id: "troca-toner", name: "Troca de toner" },
    { id: "outros", name: "Outros" },
  ],
  sistemas: [
    { id: "criacao-usuario", name: "Criação de usuário" },
    { id: "assinatura", name: "Assinatura" },
    { id: "erro-sistema", name: "Erro em sistema" },
    { id: "intranet", name: "Intranet" },
    { id: "outros", name: "Outros" },
  ],
};

// Unidades de trabalho
const workUnits = [
  "ATIC",
  "PHARIS",
  "GABINETE",
  "TI - Sede",
  "RH - Filial Norte",
  "Financeiro - Sede",
  "Vendas - Filial Sul",
  "Marketing - Sede",
];

// Prioridades
const priorities = [
  { value: "low", label: "Baixa", color: "bg-gray-500" },
  { value: "medium", label: "Média", color: "bg-yellow-500" },
  { value: "high", label: "Alta", color: "bg-red-500" },
];

interface CallData {
  type: string;
  subcategory: string;
  title: string;
  description: string;
  isForSelf: boolean;
  rf: string;
  callerName: string;
  callerEmail: string;
  callerPhone: string;
  workUnit: string;
}

interface NewCallWizardProps {
  trigger?: React.ReactNode;
  onCallCreated: (call: any) => void;
}

export function NewCallWizard({ trigger, onCallCreated }: NewCallWizardProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSearchingUser, setIsSearchingUser] = useState(false);
  const [callData, setCallData] = useState<CallData>({
    type: "",
    subcategory: "",
    title: "",
    description: "",
    isForSelf: true,
    rf: "",
    callerName: "",
    callerEmail: "",
    callerPhone: "",
    workUnit: "",
  });

  // Preencher dados do usuário logado quando "Para mim mesmo" for selecionado
  useEffect(() => {
    if (user && callData.isForSelf) {
      setCallData((prev) => ({
        ...prev,
        callerName: user.name || "",
        callerEmail: user.email || "",
        callerPhone: "", // Telefone opcional
        workUnit: user.workUnit || "Não informado", // Valor padrão se não tiver
      }));
    }
  }, [user, callData.isForSelf]);

  // Função para buscar usuário por RF
  const handleSearchUser = async () => {
    if (!callData.rf.trim()) {
      toast.error("Digite um RF para buscar");
      return;
    }

    setIsSearchingUser(true);
    try {
      const foundUser = await GoUsersService.searchUserByRF(callData.rf);

      setCallData((prev) => ({
        ...prev,
        callerName: foundUser.name || "",
        callerEmail: foundUser.email || "",
        callerPhone: "", // TODO: Adicionar telefone no backend
        workUnit: foundUser.workUnit || "",
      }));

      toast.success("Usuário encontrado!");
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      toast.error("Usuário não encontrado");

      // Limpar campos se não encontrar
      setCallData((prev) => ({
        ...prev,
        callerName: "",
        callerEmail: "",
        callerPhone: "",
        workUnit: "",
      }));
    } finally {
      setIsSearchingUser(false);
    }
  };

  const totalSteps = 5;

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleSubmit = useCallback(async () => {
    try {
      // Preparar dados para o backend Go
      const goCallData: GoCreateCallRequest = {
        caller: callData.callerName,
        email: callData.callerEmail,
        phone: callData.callerPhone || "", // Telefone opcional
        workUnit: callData.workUnit || "Não informado", // Valor padrão
        issue: callData.title,
        description: callData.description,
        priority: "medium" as "low" | "medium" | "high" | "urgent",
        category: callData.type,
        tags: [callData.subcategory],
      };

      console.log("🔍 Criando chamado:", goCallData);

      const newCall = await GoCallsService.createCall(goCallData);

      console.log("✅ Chamado criado:", newCall);

      toast.success("Chamado criado com sucesso!");
      onCallCreated(newCall);
      setOpen(false);

      // Reset form
      setCurrentStep(1);
      setCallData({
        type: "",
        subcategory: "",
        title: "",
        description: "",
        isForSelf: true,
        rf: "",
        callerName: "",
        callerEmail: "",
        callerPhone: "",
        workUnit: "",
      });
    } catch (error) {
      console.error("💥 Erro ao criar chamado:", error);
      toast.error("Erro ao criar chamado. Tente novamente.");
    }
  }, [onCallCreated, callData]);

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1:
        return callData.type !== "";
      case 2:
        return callData.subcategory !== "";
      case 3:
        return (
          callData.title.trim() !== "" && callData.description.trim() !== ""
        );
      case 4:
        if (callData.isForSelf) {
          return (
            callData.callerName.trim() !== "" &&
            callData.callerEmail.trim() !== ""
            // Removido a obrigatoriedade de workUnit e phone
          );
        } else {
          return (
            callData.rf.trim() !== "" &&
            callData.callerName.trim() !== "" &&
            callData.callerEmail.trim() !== ""
            // Removido a obrigatoriedade de workUnit
          );
        }
      case 5:
        return true;
      default:
        return false;
    }
  }, [currentStep, callData]);

  const renderStepIndicator = useMemo(
    () => (
      <div className="flex items-center justify-center mb-6">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <React.Fragment key={stepNumber}>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isActive
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : stepNumber}
              </div>
              {stepNumber < totalSteps && (
                <div
                  className={`w-12 h-0.5 mx-2 ${
                    stepNumber < currentStep ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    ),
    [currentStep, totalSteps]
  );

  const renderStep1 = () => {
    const selectedType = callTypes.find((type) => type.id === callData.type);

    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Selecione o tipo de chamado
          </h3>
          <p className="text-sm text-muted-foreground">
            Escolha a categoria que melhor descreve seu problema
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {callTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = callData.type === type.id;

            return (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected
                    ? "ring-2 ring-blue-500 border-blue-500"
                    : "hover:border-gray-300"
                }`}
                onClick={() =>
                  setCallData({ ...callData, type: type.id, subcategory: "" })
                }
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${type.color} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{type.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {type.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="text-blue-500">
                        <Check className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedType && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Selecionado
              </Badge>
              <span className="font-medium">{selectedType.name}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedType.description}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderStep2 = () => {
    const selectedType = callTypes.find((type) => type.id === callData.type);
    const availableSubcategories = callData.type
      ? subcategories[callData.type as keyof typeof subcategories] || []
      : [];
    const selectedSubcategory = availableSubcategories.find(
      (sub) => sub.id === callData.subcategory
    );

    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Selecione a subcategoria
          </h3>
          <p className="text-sm text-muted-foreground">
            Escolha a subcategoria específica para {selectedType?.name}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableSubcategories.map((subcategory) => {
            const isSelected = callData.subcategory === subcategory.id;

            return (
              <Card
                key={subcategory.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected
                    ? "ring-2 ring-blue-500 border-blue-500"
                    : "hover:border-gray-300"
                }`}
                onClick={() =>
                  setCallData({ ...callData, subcategory: subcategory.id })
                }
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">
                      {subcategory.name}
                    </span>
                    {isSelected && (
                      <div className="text-blue-500">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedSubcategory && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Selecionado
              </Badge>
              <span className="font-medium">{selectedSubcategory.name}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Categoria: {selectedType?.name}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Detalhes do Chamado
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título do chamado
            </label>
            <input
              type="text"
              value={callData.title}
              onChange={(e) =>
                setCallData({ ...callData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite um título para o chamado"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição detalhada
            </label>
            <textarea
              value={callData.description}
              onChange={(e) =>
                setCallData({ ...callData, description: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descreva o problema ou solicitação em detalhes"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Informações de Contato
        </h3>

        {/* Seleção: Para si mesmo ou outra pessoa */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Para quem você está abrindo este chamado?
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="isForSelf"
                checked={callData.isForSelf}
                onChange={() =>
                  setCallData({
                    ...callData,
                    isForSelf: true,
                    rf: "",
                    callerName: user?.name || "",
                    callerEmail: user?.email || "",
                    callerPhone: "",
                    workUnit: user?.workUnit || "",
                  })
                }
                className="mr-2"
              />
              Para mim mesmo
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="isForSelf"
                checked={!callData.isForSelf}
                onChange={() =>
                  setCallData({
                    ...callData,
                    isForSelf: false,
                    callerName: "",
                    callerEmail: "",
                    callerPhone: "",
                    workUnit: "",
                  })
                }
                className="mr-2"
              />
              Para outra pessoa
            </label>
          </div>
        </div>

        {/* Busca por RF se for para outra pessoa */}
        {!callData.isForSelf && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RF (Registro Funcional)
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={callData.rf}
                onChange={(e) =>
                  setCallData({ ...callData, rf: e.target.value })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite o RF para buscar o usuário"
              />
              <button
                type="button"
                onClick={handleSearchUser}
                disabled={isSearchingUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSearchingUser ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  "Buscar"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Formulário de dados do contato */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do solicitante
            </label>
            <input
              type="text"
              value={callData.callerName}
              onChange={(e) =>
                setCallData({ ...callData, callerName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o nome completo"
              disabled={callData.isForSelf}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={callData.callerEmail}
              onChange={(e) =>
                setCallData({ ...callData, callerEmail: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o e-mail"
              disabled={callData.isForSelf}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone
            </label>
            <input
              type="tel"
              value={callData.callerPhone}
              onChange={(e) =>
                setCallData({ ...callData, callerPhone: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o telefone"
              disabled={callData.isForSelf}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unidade de trabalho
            </label>
            <select
              value={callData.workUnit}
              onChange={(e) =>
                setCallData({ ...callData, workUnit: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={callData.isForSelf}
            >
              <option value="">Selecione a unidade</option>
              {workUnits.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Revisão do Chamado
        </h3>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Tipo de chamado</h4>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">
                {React.createElement(
                  callTypes.find((type) => type.id === callData.type)?.icon ||
                    Computer
                )}
              </span>
              <div>
                <p className="text-gray-900">
                  {callTypes.find((type) => type.id === callData.type)?.name}
                </p>
                {callData.subcategory && (
                  <p className="text-sm text-gray-600">
                    Subcategoria:{" "}
                    {
                      subcategories[
                        callData.type as keyof typeof subcategories
                      ]?.find((sub) => sub.id === callData.subcategory)?.name
                    }
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Detalhes</h4>
            <p className="text-gray-900 font-medium">{callData.title}</p>
            <p className="text-gray-600 mt-1">{callData.description}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Contato</h4>
            <p className="text-gray-900">{callData.callerName}</p>
            <p className="text-gray-600">{callData.callerEmail}</p>
            <p className="text-gray-600">{callData.callerPhone}</p>
            <p className="text-sm text-gray-500 mt-2">
              Unidade: {callData.workUnit}
            </p>
            {!callData.isForSelf && callData.rf && (
              <p className="text-sm text-gray-500">RF: {callData.rf}</p>
            )}
            <p className="text-sm text-gray-500">
              {callData.isForSelf
                ? "Chamado para: Você mesmo"
                : "Chamado para: Outra pessoa"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Abrir novo chamado
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Abrir novo chamado</DialogTitle>
          <DialogDescription>
            Passo {currentStep} de {totalSteps}
          </DialogDescription>
        </DialogHeader>

        {renderStepIndicator}
        {renderCurrentStep()}

        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={handleNext} disabled={!canProceed()}>
              Próximo
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!canProceed()}>
              <Check className="h-4 w-4 mr-1" />
              Criar chamado
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
