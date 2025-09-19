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
import * as categorias from '@/services/categoria';
import { ICategoria } from '@/types/categoria';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
	nome: z.string(),
});

interface FormBuscaCategoriaProps {
	setCategorias: (categorias: ICategoria[]) => void;
}

export default function FormBuscaCategoria({ setCategorias }: FormBuscaCategoriaProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nome: '',
		},
	});

	const session = useSession();

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const token = session.data?.access_token;
		if (!token) {
			toast.error('Não autorizado');
			return;
		}

		const { nome } = values;
		const resp = await categorias.buscarTodasCategorias(token, 1, 1000, nome);

		if (resp.error) {
			toast.error('Algo deu errado', { description: resp.error });
			return;
		}

		if (resp.ok && resp.data) {
			const paginado = resp.data as { data: ICategoria[] };
			setCategorias(paginado.data);
			toast.success('Categorias carregadas', { description: `Encontradas ${paginado.data.length}` });
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
				<FormField
					control={form.control}
					name='nome'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nome da categoria</FormLabel>
							<FormControl>
								<Input placeholder='Digite o nome da categoria' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='flex gap-2 items-center justify-end'>
					<DialogClose asChild>
						<Button variant={'outline'}>Voltar</Button>
					</DialogClose>
					<Button
						disabled={form.formState.isLoading || !form.formState.isValid}
						type='submit'
					>
						{form.formState.isLoading || form.formState.isSubmitting ? (
							<>
								Buscar <Loader2 className='animate-spin' />
							</>
						) : (
							<>
								Buscar <ArrowRight />
							</>
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
