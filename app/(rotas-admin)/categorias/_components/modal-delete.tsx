/** @format */
'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import * as categorias from '@/services/categoria';
import { Check, Loader2, Trash2 } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';

export default function ModalDeleteCategoria({
	id,
	status,
}: {
	id: string;
	status: boolean;
}) {
	const [isPending, startTransition] = useTransition();

	async function handleDelete(id: string) {
		const resp = status
			? await categorias.ativar(id)
			: await categorias.desativar(id);

		if (!resp.ok) {
			toast.error('Algo deu errado', { description: resp.error });
		} else {
			toast.success(
				status
					? 'Categoria ativada com sucesso'
					: 'Categoria desativada com sucesso',
				{
					description: resp.status.toString(),
				},
			);
			window.location.reload();
		}
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					size={'icon'}
					variant={'outline'}
					className={`${
						status ? 'hover:bg-primary' : 'hover:bg-destructive'
					} cursor-pointer hover:text-white group transition-all ease-linear duration-200`}>
					{status ? (
						<Check
							size={24}
							className='text-primary dark:text-white group-hover:text-white group'
						/>
					) : (
						<Trash2
							size={24}
							className='text-destructive dark:text-white group-hover:text-white group'
						/>
					)}
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{status ? 'Ativar Categoria' : 'Desativar Categoria'}
					</DialogTitle>
				</DialogHeader>

				<p>
					{status
						? 'Tem certeza que deseja ativar esta categoria?'
						: 'Tem certeza que deseja desativar esta categoria?'}
				</p>

				<DialogFooter>
					<div className='flex gap-2'>
						<DialogClose asChild>
							<Button variant={'outline'}>Voltar</Button>
						</DialogClose>
						<Button
							disabled={isPending}
							onClick={() =>
								startTransition(() => {
									handleDelete(id);
								})
							}
							type='submit'
							variant={status ? 'default' : 'destructive'}>
							{isPending ? (
								<Loader2 className='animate-spin' />
							) : status ? (
								'Ativar'
							) : (
								'Desativar'
							)}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
