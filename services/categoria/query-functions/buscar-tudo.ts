/** @format */

import { IPaginadoCategoria, IRespostaCategoria } from '@/types/categoria';

export async function buscarTodasCategorias(
	access_token: string,
	pagina: number = 1,
	limite: number = 10,
	busca: string = '',
	status: string = '',
	permissao: string = '',
): Promise<IRespostaCategoria> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const categorias = await fetch(
			`${baseURL}categoria/buscar-tudo?pagina=${pagina}&limite=${limite}&busca=${busca}&status=${status}&permissao=${permissao}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${access_token}`,
				},
				next: { tags: ['categorias'], revalidate:120 },
			},
		);
		const data = await categorias.json();
		console.log('o resultado:', categorias.status, data)
		if (categorias.status === 200)
			return {
				ok: true,
				error: null,
				data: data as IPaginadoCategoria,
				status: 200,
			};
		return {
			ok: false,
			error: data.message,
			data: null,
			status: data.statusCode,
		};
	} catch (error) {
		return {
			ok: false,
			error: 'Não foi possível buscar a lista de categorias:' + error,
			data: null,
			status: 400,
		};
	}
}
