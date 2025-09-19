/** @format */

export interface ICategoria {
  id: string;
  nome: string;
  status: boolean; 
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface ICreateCategoria {
  nome: string;
}

export interface IUpdateCategoria {
  nome?: string;
}

export interface IRespostaCategoria {
  ok: boolean;
  error: string | null;
  data: 
       | IPaginadoCategoria 
       | ICategoria
       | ICategoria[] | null;
  status: number;
}

export interface IPaginadoCategoria {
    data: ICategoria[];
    total: number;
    pagina: number;
    limite: number;
}