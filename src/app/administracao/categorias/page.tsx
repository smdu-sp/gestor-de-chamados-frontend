"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Settings,
  Users,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import {
  CategoriasService,
  Categoria,
  Subcategoria,
  CreateCategoriaRequest,
  CreateSubcategoriaRequest,
  UpdateCategoriaRequest,
  UpdateSubcategoriaRequest,
} from "@/services/categorias.service";

// Permissões disponíveis no sistema (baseadas no seed do banco)
const PERMISSOES_DISPONIVEIS = [
  { value: "ADM", label: "Administrador" },
  { value: "TEC", label: "Técnico" },
  { value: "SUP", label: "Supervisor" },
  { value: "USR", label: "Usuário" },
  { value: "INF", label: "Infraestrutura" },
  { value: "DEV", label: "Desenvolvedor" },
  { value: "VOIP", label: "VOIP" },
  { value: "IMP", label: "Impressão" },
  { value: "CAD", label: "Cadastro" },
];

export default function CategoriasPage() {
  const { user } = useAuth();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("categorias");

  // Estados para diálogos
  const [isCategoriaDialogOpen, setIsCategoriaDialogOpen] = useState(false);
  const [isSubcategoriaDialogOpen, setIsSubcategoriaDialogOpen] =
    useState(false);
  const [isPermissoesDialogOpen, setIsPermissoesDialogOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(
    null
  );
  const [editingSubcategoria, setEditingSubcategoria] =
    useState<Subcategoria | null>(null);
  const [selectedCategoriaForPermissoes, setSelectedCategoriaForPermissoes] =
    useState<Categoria | null>(null);

  // Estados para formulários
  const [categoriaForm, setCategoriaForm] = useState({
    nome: "",
    status: true,
    permissoes: [] as string[],
  });

  const [subcategoriaForm, setSubcategoriaForm] = useState({
    nome: "",
    categoria_id: "",
    status: true,
  });

  // Carregar dados
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [categoriasData, subcategoriasData] = await Promise.all([
        CategoriasService.getCategorias(),
        CategoriasService.getSubcategorias(),
      ]);
      setCategorias(categoriasData);
      setSubcategorias(subcategoriasData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar categorias e subcategorias");
    } finally {
      setIsLoading(false);
    }
  };

  // Funções para categorias
  const handleCreateCategoria = async () => {
    try {
      const data: CreateCategoriaRequest = {
        nome: categoriaForm.nome,
        status: categoriaForm.status,
        permissoes: categoriaForm.permissoes,
      };

      await CategoriasService.createCategoria(data);
      toast.success("Categoria criada com sucesso!");
      setIsCategoriaDialogOpen(false);
      resetCategoriaForm();
      loadData();
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      toast.error("Erro ao criar categoria");
    }
  };

  const handleUpdateCategoria = async () => {
    if (!editingCategoria) return;

    try {
      const data: UpdateCategoriaRequest = {
        nome: categoriaForm.nome,
        status: categoriaForm.status,
        permissoes: categoriaForm.permissoes,
      };

      await CategoriasService.updateCategoria(editingCategoria.id, data);
      toast.success("Categoria atualizada com sucesso!");
      setIsCategoriaDialogOpen(false);
      resetCategoriaForm();
      loadData();
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      toast.error("Erro ao atualizar categoria");
    }
  };

  const handleDeleteCategoria = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;

    try {
      await CategoriasService.deleteCategoria(id);
      toast.success("Categoria excluída com sucesso!");
      loadData();
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      toast.error("Erro ao excluir categoria");
    }
  };

  // Funções para subcategorias
  const handleCreateSubcategoria = async () => {
    try {
      const data: CreateSubcategoriaRequest = {
        nome: subcategoriaForm.nome,
        categoria_id: subcategoriaForm.categoria_id,
        status: subcategoriaForm.status,
      };

      await CategoriasService.createSubcategoria(data);
      toast.success("Subcategoria criada com sucesso!");
      setIsSubcategoriaDialogOpen(false);
      resetSubcategoriaForm();
      loadData();
    } catch (error) {
      console.error("Erro ao criar subcategoria:", error);
      toast.error("Erro ao criar subcategoria");
    }
  };

  const handleUpdateSubcategoria = async () => {
    if (!editingSubcategoria) return;

    try {
      const data: UpdateSubcategoriaRequest = {
        nome: subcategoriaForm.nome,
        categoria_id: subcategoriaForm.categoria_id,
        status: subcategoriaForm.status,
      };

      await CategoriasService.updateSubcategoria(editingSubcategoria.id, data);
      toast.success("Subcategoria atualizada com sucesso!");
      setIsSubcategoriaDialogOpen(false);
      resetSubcategoriaForm();
      loadData();
    } catch (error) {
      console.error("Erro ao atualizar subcategoria:", error);
      toast.error("Erro ao atualizar subcategoria");
    }
  };

  const handleDeleteSubcategoria = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta subcategoria?")) return;

    try {
      await CategoriasService.deleteSubcategoria(id);
      toast.success("Subcategoria excluída com sucesso!");
      loadData();
    } catch (error) {
      console.error("Erro ao excluir subcategoria:", error);
      toast.error("Erro ao excluir subcategoria");
    }
  };

  // Funções auxiliares
  const resetCategoriaForm = () => {
    setCategoriaForm({
      nome: "",
      status: true,
      permissoes: [],
    });
    setEditingCategoria(null);
  };

  const resetSubcategoriaForm = () => {
    setSubcategoriaForm({
      nome: "",
      categoria_id: "",
      status: true,
    });
    setEditingSubcategoria(null);
  };

  const openEditCategoriaDialog = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setCategoriaForm({
      nome: categoria.nome,
      status: categoria.status,
      permissoes: categoria.permissoes?.map((p) => p.permissao) || [],
    });
    setIsCategoriaDialogOpen(true);
  };

  const openEditSubcategoriaDialog = (subcategoria: Subcategoria) => {
    setEditingSubcategoria(subcategoria);
    setSubcategoriaForm({
      nome: subcategoria.nome,
      categoria_id: subcategoria.categoria_id,
      status: subcategoria.status,
    });
    setIsSubcategoriaDialogOpen(true);
  };

  const getCategoriaNome = (categoriaId: string) => {
    const categoria = categorias.find((c) => c.id === categoriaId);
    return categoria?.nome || "Categoria não encontrada";
  };

  const getSubcategoriasByCategoria = (categoriaId: string) => {
    return subcategorias.filter((s) => s.categoria_id === categoriaId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Categorias e Subcategorias
          </h1>
          <p className="text-muted-foreground">
            Gerencie as categorias e subcategorias do sistema de chamados
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
          <TabsTrigger value="subcategorias">Subcategorias</TabsTrigger>
        </TabsList>

        <TabsContent value="categorias" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FolderTree className="h-5 w-5" />
                    Categorias
                  </CardTitle>
                  <CardDescription>
                    Gerencie as categorias principais do sistema
                  </CardDescription>
                </div>
                <Dialog
                  open={isCategoriaDialogOpen}
                  onOpenChange={setIsCategoriaDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button onClick={resetCategoriaForm}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Categoria
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>
                        {editingCategoria
                          ? "Editar Categoria"
                          : "Nova Categoria"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingCategoria
                          ? "Edite as informações da categoria"
                          : "Crie uma nova categoria para o sistema"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="nome" className="text-right">
                          Nome
                        </Label>
                        <Input
                          id="nome"
                          value={categoriaForm.nome}
                          onChange={(e) =>
                            setCategoriaForm({
                              ...categoriaForm,
                              nome: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                          Ativo
                        </Label>
                        <Switch
                          id="status"
                          checked={categoriaForm.status}
                          onCheckedChange={(checked) =>
                            setCategoriaForm({
                              ...categoriaForm,
                              status: checked,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right mt-2">Permissões</Label>
                        <div className="col-span-3 space-y-2">
                          {PERMISSOES_DISPONIVEIS.map((permissao) => (
                            <div
                              key={permissao.value}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={permissao.value}
                                checked={categoriaForm.permissoes.includes(
                                  permissao.value
                                )}
                                onCheckedChange={(checked: boolean) => {
                                  if (checked) {
                                    setCategoriaForm({
                                      ...categoriaForm,
                                      permissoes: [
                                        ...categoriaForm.permissoes,
                                        permissao.value,
                                      ],
                                    });
                                  } else {
                                    setCategoriaForm({
                                      ...categoriaForm,
                                      permissoes:
                                        categoriaForm.permissoes.filter(
                                          (p) => p !== permissao.value
                                        ),
                                    });
                                  }
                                }}
                              />
                              <Label
                                htmlFor={permissao.value}
                                className="text-sm"
                              >
                                {permissao.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        onClick={
                          editingCategoria
                            ? handleUpdateCategoria
                            : handleCreateCategoria
                        }
                      >
                        {editingCategoria ? "Atualizar" : "Criar"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Subcategorias</TableHead>
                    <TableHead>Permissões</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categorias.map((categoria) => (
                    <TableRow key={categoria.id}>
                      <TableCell className="font-medium">
                        {categoria.nome}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={categoria.status ? "default" : "secondary"}
                        >
                          {categoria.status ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getSubcategoriasByCategoria(categoria.id).length}{" "}
                        subcategorias
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {categoria.permissoes
                            ?.slice(0, 3)
                            .map((permissao) => (
                              <Badge
                                key={permissao.permissao}
                                variant="outline"
                                className="text-xs"
                              >
                                {permissao.permissao}
                              </Badge>
                            ))}
                          {categoria.permissoes &&
                            categoria.permissoes.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{categoria.permissoes.length - 3}
                              </Badge>
                            )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(categoria.criado_em).toLocaleDateString(
                          "pt-BR"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditCategoriaDialog(categoria)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCategoria(categoria.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subcategorias" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FolderTree className="h-5 w-5" />
                    Subcategorias
                  </CardTitle>
                  <CardDescription>
                    Gerencie as subcategorias do sistema
                  </CardDescription>
                </div>
                <Dialog
                  open={isSubcategoriaDialogOpen}
                  onOpenChange={setIsSubcategoriaDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button onClick={resetSubcategoriaForm}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Subcategoria
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>
                        {editingSubcategoria
                          ? "Editar Subcategoria"
                          : "Nova Subcategoria"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingSubcategoria
                          ? "Edite as informações da subcategoria"
                          : "Crie uma nova subcategoria para o sistema"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="nome" className="text-right">
                          Nome
                        </Label>
                        <Input
                          id="nome"
                          value={subcategoriaForm.nome}
                          onChange={(e) =>
                            setSubcategoriaForm({
                              ...subcategoriaForm,
                              nome: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="categoria" className="text-right">
                          Categoria
                        </Label>
                        <Select
                          value={subcategoriaForm.categoria_id}
                          onValueChange={(value) =>
                            setSubcategoriaForm({
                              ...subcategoriaForm,
                              categoria_id: value,
                            })
                          }
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {categorias
                              .filter((c) => c.status)
                              .map((categoria) => (
                                <SelectItem
                                  key={categoria.id}
                                  value={categoria.id}
                                >
                                  {categoria.nome}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                          Ativo
                        </Label>
                        <Switch
                          id="status"
                          checked={subcategoriaForm.status}
                          onCheckedChange={(checked) =>
                            setSubcategoriaForm({
                              ...subcategoriaForm,
                              status: checked,
                            })
                          }
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        onClick={
                          editingSubcategoria
                            ? handleUpdateSubcategoria
                            : handleCreateSubcategoria
                        }
                      >
                        {editingSubcategoria ? "Atualizar" : "Criar"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subcategorias.map((subcategoria) => (
                    <TableRow key={subcategoria.id}>
                      <TableCell className="font-medium">
                        {subcategoria.nome}
                      </TableCell>
                      <TableCell>
                        {getCategoriaNome(subcategoria.categoria_id)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            subcategoria.status ? "default" : "secondary"
                          }
                        >
                          {subcategoria.status ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(subcategoria.criado_em).toLocaleDateString(
                          "pt-BR"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              openEditSubcategoriaDialog(subcategoria)
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDeleteSubcategoria(subcategoria.id)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
