/** @format */
import { ICategoria, ICreateCategoria, IRespostaCategoria } from "@/types/categoria";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export async function criarCategoria(body: ICreateCategoria, access_token: string): Promise<IRespostaCategoria> {
  try {
    const res = await fetch(`${baseURL}categoria`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.status === 201) {
      return { ok: true, error: null, data: data as ICategoria, status: 201 };
    }

    return { ok: false, error: data.message, data: null, status: res.status };
  } catch (error) {
    return { ok: false, error: "Não foi possível criar a categoria: " + error, data: null, status: 400 };
  }
}
