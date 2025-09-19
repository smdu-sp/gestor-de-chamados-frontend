export {
    buscarTodasCategorias
} from './query-functions';

export {
    criarCategoria,
    atualizarCategoria,
    desativar,
    ativar    

} from './server-functions';

export function atualizar(id: string, values: { nome: string; status: boolean; }, token: string) {
	throw new Error('Function not implemented.');
}
