import { Badge } from "@/components/ui/badge";

// Função para badges de status
export const getStatusBadge = (status: string) => {
  // Mapeamento de status antigos para novos padrões
  const statusMapping: { [key: string]: string } = {
    "active": "Em atendimento",
    "pending": "Pendente", 
    "resolved": "Fechado"
  };

  // Usar o mapeamento se existir, senão usar o status original
  const mappedStatus = statusMapping[status] || status;

  const statusConfig = {
    "Nova": { className: "bg-blue-100 text-blue-800 border-blue-200" },
    "Em atendimento": { className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    "Pendente": { className: "bg-orange-100 text-orange-800 border-orange-200" },
    "Selecionado": { className: "bg-purple-100 text-purple-800 border-purple-200" },
    "Fechado": { className: "bg-green-100 text-green-800 border-green-200" },
    "Cancelado": { className: "bg-red-100 text-red-800 border-red-200" },
  };

  const config = statusConfig[mappedStatus as keyof typeof statusConfig] || {
    className: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <Badge variant="outline" className={`text-xs font-medium ${config.className}`}>
      {mappedStatus}
    </Badge>
  );
};

// Função para badges de prioridade
export const getPriorityBadge = (priority: string) => {
  const priorityConfig = {
    high: { label: "Alta", className: "bg-red-100 text-red-800 border-red-200" },
    medium: { label: "Média", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    low: { label: "Baixa", className: "bg-green-100 text-green-800 border-green-200" },
  };

  const config = priorityConfig[priority as keyof typeof priorityConfig] || {
    label: priority,
    className: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <Badge variant="outline" className={`text-xs font-medium ${config.className}`}>
      {config.label}
    </Badge>
  );
};

// Função para badges de categoria com contorno azul escuro
export const getCategoryBadge = (category: string) => {
  return (
    <Badge variant="outline" className="text-xs font-medium border-blue-800 text-blue-800 hover:bg-blue-50">
      {category}
    </Badge>
  );
};

// Função para badges de unidade
export const getUnitBadge = (unit: string) => {
  return (
    <Badge variant="outline" className="text-xs font-medium border-gray-300 text-gray-700 hover:bg-gray-50">
      {unit}
    </Badge>
  );
};

// Função para badges de role/função de usuário
export const getRoleBadge = (role: string) => {
  // Mapeamento de roles em inglês para português
  const roleMapping: { [key: string]: string } = {
    "technician": "tecnico",
    "user": "usuario", 
    "developer": "desenvolvedor"
  };

  // Usar o mapeamento se existir, senão usar o role original
  const mappedRole = roleMapping[role.toLowerCase()] || role.toLowerCase();

  const roleConfig = {
    "admin": { label: "Administrador", className: "bg-purple-100 text-purple-800 border-purple-200" },
    "tecnico": { label: "Técnico", className: "bg-blue-100 text-blue-800 border-blue-200" },
    "usuario": { label: "Usuário", className: "bg-green-100 text-green-800 border-green-200" },
    "desenvolvedor": { label: "Desenvolvedor", className: "bg-orange-100 text-orange-800 border-orange-200" },
  };

  const config = roleConfig[mappedRole as keyof typeof roleConfig] || {
    label: role,
    className: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <Badge variant="outline" className={`text-xs font-medium ${config.className}`}>
      {config.label}
    </Badge>
  );
};

// Função para badges de status de usuário (ativo/inativo)
export const getUserStatusBadge = (isActive: boolean) => {
  return (
    <Badge 
      variant="outline" 
      className={`text-xs font-medium ${
        isActive 
          ? "bg-green-100 text-green-800 border-green-200" 
          : "bg-red-100 text-red-800 border-red-200"
      }`}
    >
      {isActive ? "Ativo" : "Inativo"}
    </Badge>
  );
};

// Função genérica para badges customizados
export const getCustomBadge = (text: string, variant: 'success' | 'warning' | 'error' | 'info' | 'default' = 'default') => {
  const variantConfig = {
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
    default: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <Badge variant="outline" className={`text-xs font-medium ${variantConfig[variant]}`}>
      {text}
    </Badge>
  );
};