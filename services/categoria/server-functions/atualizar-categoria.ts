/** @format */
import { ICategoria, IUpdateCategoria, IRespostaCategoria } from "@/types/categoria";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export async function atualizarCategoria(
  id: string,
  body: IUpdateCategoria,
  access_token: string
): Promise<IRespostaCategoria> {
  try {
    const res = await fetch(`${baseURL}categoria/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.status === 200) {
      return { ok: true, error: null, data: data as ICategoria, status: 200 };
    }

    return { ok: false, error: data.message, data: null, status: res.status };
  } catch (error) {
    return { ok: false, error: "Não foi possível atualizar a categoria: " + error, data: null, status: 400 };
  }
}
