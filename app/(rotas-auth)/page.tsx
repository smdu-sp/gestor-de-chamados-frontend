/** @format */

import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className=" w-full relative px-0 md:px-8 pb-10 md:pb-0">
      <h1 className="text-xl md:text-4xl font-bold">Dashboard</h1>
      <div className="flex flex-col gap-5 my-5 w-full">
        <p>Bem-vindo ao sistema de gestão de chamados!</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold">Usuários</h3>
            <p className="text-sm text-muted-foreground">
              Gerenciar usuários do sistema
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold">Perfil</h3>
            <p className="text-sm text-muted-foreground">
              Configurar seu perfil
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold">Categorias</h3>
            <p className="text-sm text-muted-foreground">
              Gerenciar categorias
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
