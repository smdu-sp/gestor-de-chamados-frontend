import { UserRole } from "@/types/auth";

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  allowedRoles: UserRole[];
  children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
    allowedRoles: ["admin", "technician", "developer"],
  },
  {
    id: "chamados",
    label: "Meus Chamados",
    href: "/meus-chamados",
    icon: "Ticket",
    allowedRoles: ["admin", "technician", "user", "developer"],
  },
  {
    id: "area-do-tecnico",
    label: "Area do Técnico",
    href: "/area-do-tecnico",
    icon: "Wrench",
    allowedRoles: ["admin", "technician", "developer"],
  },
  {
    id: "relatorios",
    label: "Relatórios",
    href: "/relatorios",
    icon: "BarChart3",
    allowedRoles: ["admin", "developer"],
  },
  {
    id: "administracao",
    label: "Administração",
    href: "/administracao",
    icon: "Settings",
    allowedRoles: ["admin", "developer"],
    children: [
      {
        id: "geral",
        label: "Geral",
        href: "/administracao",
        icon: "Settings",
        allowedRoles: ["admin", "developer"],
      },
      {
        id: "usuarios",
        label: "Usuários",
        href: "/administracao/usuarios",
        icon: "Users",
        allowedRoles: ["admin", "developer"],
      },
      {
        id: "configuracoes-dashboard",
        label: "Configurar Dashboard",
        href: "/administracao/configuracoes-dashboard",
        icon: "Settings2",
        allowedRoles: ["admin", "developer"],
      },
    ],
  },
];

export function hasPermission(
  userRole: UserRole,
  allowedRoles: UserRole[]
): boolean {
  return allowedRoles.includes(userRole);
}

export function getFilteredMenuItems(userRole: UserRole): MenuItem[] {
  return menuItems.filter((item) => {
    const hasAccess = hasPermission(userRole, item.allowedRoles);
    if (hasAccess && item.children) {
      // Filter children based on permissions
      item.children = item.children.filter((child) =>
        hasPermission(userRole, child.allowedRoles)
      );
    }
    return hasAccess;
  });
}

export function canAccessRoute(userRole: UserRole, route: string): boolean {
  const findMenuItem = (items: MenuItem[], path: string): MenuItem | null => {
    for (const item of items) {
      if (item.href === path) {
        return item;
      }
      if (item.children) {
        const found = findMenuItem(item.children, path);
        if (found) return found;
      }
    }
    return null;
  };

  const menuItem = findMenuItem(menuItems, route);
  return menuItem ? hasPermission(userRole, menuItem.allowedRoles) : false;
}
