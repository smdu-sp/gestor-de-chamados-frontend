"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/auth-context";
import { getFilteredMenuItems } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Ticket,
  Wrench,
  BarChart3,
  Settings,
  Users,
  Settings2,
  Headphones,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  LogOut,
} from "lucide-react";

const iconMap = {
  LayoutDashboard,
  Ticket,
  Wrench,
  BarChart3,
  Settings,
  Users,
  Settings2,
  Headphones,
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  if (!user) return null;

  const menuItems = getFilteredMenuItems(user.role);

  // Determina qual logo usar baseado no tema
  const logoSrc = theme === "dark" ? "/logo-white.png" : "/logo.png";

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName as keyof typeof iconMap];
    return Icon ? (
      <Icon className={cn("h-4 w-4", collapsed && "h-3.5 w-3.5")} />
    ) : (
      <LayoutDashboard className={cn("h-4 w-4", collapsed && "h-3.5 w-3.5")} />
    );
  };

  const isActive = (href: string) => pathname === href;

  const handleSubmenuToggle = (itemId: string) => {
    if (collapsed) return; // Não fazer nada quando collapsed
    setOpenSubmenu(openSubmenu === itemId ? null : itemId);
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex flex-col h-full bg-card border-r transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header with Logo */}
        <div className="relative">
          {/* Logo Area */}
          <div
            className={cn(
              "flex items-center justify-center transition-all duration-300",
              collapsed ? "p-3 h-16" : "p-6 pb-4 h-32"
            )}
          >
            <div
              className={cn(
                "relative transition-all duration-300",
                collapsed ? "h-10 w-10" : "h-24 w-full max-w-[220px]"
              )}
            >
              <Image
                src={collapsed ? "/icon.png" : logoSrc}
                alt={collapsed ? "Icon" : "Logo"}
                fill
                className="object-contain"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  target.nextElementSibling?.classList.remove("hidden");
                }}
              />
              <div className="hidden absolute inset-0 flex items-center justify-center">
                <Headphones className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Navigation Menu */}
        <nav className="flex-1 p-2 space-y-1">
          {menuItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isSubmenuOpen = openSubmenu === item.id;

            if (hasChildren) {
              // Quando collapsed, usar dropdown menu
              if (collapsed) {
                return (
                  <DropdownMenu key={item.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant={
                              isActive(item.href) ? "secondary" : "ghost"
                            }
                            className="w-full justify-center px-2 h-12"
                          >
                            {getIcon(item.icon)}
                          </Button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent side="right" align="start">
                      {item.children?.map((child) => (
                        <DropdownMenuItem key={child.id} asChild>
                          <Link href={child.href} className="flex items-center">
                            {getIcon(child.icon)}
                            <span className="ml-2">{child.label}</span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              // Quando não collapsed, usar collapsible normal
              return (
                <Collapsible
                  key={item.id}
                  open={isSubmenuOpen}
                  onOpenChange={() => handleSubmenuToggle(item.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant={isActive(item.href) ? "secondary" : "ghost"}
                      className="w-full justify-start px-3"
                    >
                      {getIcon(item.icon)}
                      <span className="ml-2">{item.label}</span>
                      <ChevronDown
                        className={cn(
                          "ml-auto h-4 w-4 transition-transform",
                          isSubmenuOpen ? "rotate-180" : ""
                        )}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1">
                    {item.children?.map((child) => (
                      <Link key={child.id} href={child.href}>
                        <Button
                          variant={isActive(child.href) ? "secondary" : "ghost"}
                          className="w-full justify-start pl-8"
                          size="sm"
                        >
                          {getIcon(child.icon)}
                          <span className="ml-2">{child.label}</span>
                        </Button>
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              );
            }

            // Para itens de menu principais (sem filhos)
            const menuButton = (
              <Button
                variant={isActive(item.href) ? "secondary" : "ghost"}
                className={cn(
                  "w-full transition-colors",
                  collapsed ? "justify-center px-2 h-12" : "justify-start px-3",
                  isActive(item.href) &&
                    "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {getIcon(item.icon)}
                {!collapsed && <span className="ml-2">{item.label}</span>}
              </Button>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>{menuButton}</Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return (
              <Link key={item.id} href={item.href}>
                {menuButton}
              </Link>
            );
          })}
        </nav>

        <Separator />

        {/* Toggle Button */}
        <div className="p-4 pb-2">
          <Button
            variant="ghost"
            onClick={onToggle}
            className={cn(
              "w-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
              collapsed ? "justify-center px-2 h-10" : "justify-start px-3 h-10"
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span className="ml-2 text-sm">Recolher menu</span>
              </>
            )}
          </Button>
        </div>

        {/* User Info */}
        <div className="p-4 pt-2">
          {collapsed ? (
            // Quando collapsed: apenas avatar e botão de sair embaixo
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            // Quando expandida: apenas informações do usuário sem avatar
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.workUnit} • {user.role}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
