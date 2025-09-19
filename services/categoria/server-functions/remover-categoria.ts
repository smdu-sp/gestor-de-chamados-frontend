/** @format */
import { IRespostaCategoria } from "@/types/categoria";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export async function removerCategoria(
  id: string,
  access_token: string
): Promise<IRespostaCategoria> {
  try {
    const res = await fetch(`${baseURL}categoria/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (res.status === 200 || res.status === 204) {
      return { ok: true, error: null, data: null, status: res.status };
    }

    const data = await res.json();
    return { ok: false, error: data.message, data: null, status: res.status };
  } catch (error) {
    return { ok: false, error: "Não foi possível remover a categoria: " + error, data: null, status: 400 };
  }
}
