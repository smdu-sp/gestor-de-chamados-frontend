/** @format */

'use client';

import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import * as categorias from '@/services/categoria';
import { ICategoria } from '@/types/categoria';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchemaCategoria = z.object({
	nome: z.string(),
	status: z.boolean(),
});

const formSchemaBusca = z.object({
	nome: z.string(),
});

interface FormCategoriaProps {
	isUpdating: boolean;
	categoria?: Partial<ICategoria>;
	setCategorias?: (categorias: ICategoria[]) => void;
}

export default function FormCategoria({ isUpdating, categoria, setCategorias }: FormCategoriaProps) {
	const [isPending, startTransition] = useTransition();

	const formCategoria = useForm<z.infer<typeof formSchemaCategoria>>({
		resolver: zodResolver(formSchemaCategoria),
		defaultValues: {
			nome: categoria?.nome || '',
			status: categoria?.status ?? true,
		},
	});

	const formBusca = useForm<z.infer<typeof formSchemaBusca>>({
		resolver: zodResolver(formSchemaBusca),
		defaultValues: {
			nome: '',
		},
	});

	const { data: session } = useSession();

	async function onSubmitBusca(values: z.infer<typeof formSchemaBusca>) {
		const token = session?.access_token;
		if (!token) {
			toast.error('Não autorizado');
			return;
		}

		const resp = await categorias.buscarTodasCategorias(token, 1, 1000, values.nome);

		if (resp.error) {
			toast.error('Algo deu errado', { description: resp.error });
			return;
		}

		if (resp.ok && resp.data) {
			const paginado = resp.data as { data: ICategoria[] };
			if (paginado.data.length > 0) {
				const cat = paginado.data[0];
				formCategoria.setValue('nome', cat.nome);
				formCategoria.setValue('status', cat.status);
				toast.success('Categoria encontrada', { description: cat.nome });
			} else {
				toast.error('Nenhuma categoria encontrada');
			}
		}
	}

	async function onSubmitCategoria(values: z.infer<typeof formSchemaCategoria>) {
		startTransition(async () => {
			const token = session?.access_token;
			if (!token) {
				toast.error('Não autorizado');
				return;
			}

			if (isUpdating && categoria?.id) {
				const resp = await categorias.atualizarCategoria(categoria.id, values, token);
				if (resp.error) {
					toast.error('Algo deu errado', { description: resp.error });
				} else if (resp.ok) {
					toast.success('Categoria Atualizada', { description: values.nome });
				}
			} else {
				const resp = await categorias.criarCategoria(values, token);
				if (resp.error) {
					toast.error('Algo deu errado', { description: resp.error });
				} else if (resp.ok) {
					toast.success('Categoria Criada', { description: values.nome });
				}
			}
		});
	}

	return (
		<>
			{!isUpdating && setCategorias && (
				<Form {...formBusca}>
					<form
						onSubmit={formBusca.handleSubmit(onSubmitBusca)}
						className='flex items-end gap-2 w-full mb-5'>
						<FormField
							control={formBusca.control}
							name='nome'
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormLabel>Nome da categoria</FormLabel>
									<FormControl>
										<Input placeholder='Nome da categoria' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							disabled={formBusca.formState.isLoading || !formBusca.formState.isValid}
							type='submit'>
							{formBusca.formState.isLoading || formBusca.formState.isSubmitting ? (
								<>
									Buscar <Loader2 className='animate-spin' />
								</>
							) : (
								<>
									Buscar <ArrowRight />
								</>
							)}
						</Button>
					</form>
				</Form>
			)}

			<Form {...formCategoria}>
				<form
					onSubmit={formCategoria.handleSubmit(onSubmitCategoria)}
					className='space-y-4'>
					<FormField
						control={formCategoria.control}
						name='nome'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nome</FormLabel>
								<FormControl>
									<Input placeholder='Nome da categoria' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={formCategoria.control}
						name='status'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Status</FormLabel>
								<Select onValueChange={val => field.onChange(val === 'true')} defaultValue={field.value.toString()}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder='Defina o status' />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value='true'>Ativo</SelectItem>
										<SelectItem value='false'>Inativo</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className='flex gap-2 items-center justify-end'>
						<DialogClose asChild>
							<Button variant={'outline'}>Voltar</Button>
						</DialogClose>
						<Button disabled={isPending} type='submit'>
							{isUpdating ? (
								<>
									Atualizar {isPending && <Loader2 className='animate-spin' />}
								</>
							) : (
								<>
									Adicionar {isPending && <Loader2 className='animate-spin' />}
								</>
							)}
						</Button>
					</div>
				</form>
			</Form>
		</>
	);
}
