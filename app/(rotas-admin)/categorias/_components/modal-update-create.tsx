/** @format */

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { ICategoria } from '@/types/categoria';
import { Plus, SquarePen } from 'lucide-react';
import FormCategoria from './form-categoria';

export default function ModalUpdateAndCreate({
	isUpdating,
	categoria,
}: {
	isUpdating: boolean;
	categoria?: Partial<ICategoria>;
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					size={'icon'}
					variant={'outline'}
					className={`${
						isUpdating
							? 'bg-background hover:bg-primary '
							: 'bg-primary hover:bg-primary hover:opacity-70'
					} group transition-all ease-linear duration-200`}>
					{isUpdating ? (
						<SquarePen
							size={28}
							className='text-primary group-hover:text-white group'
						/>
					) : (
						<Plus
							size={28}
							className='text-white group'
						/>
					)}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{isUpdating ? 'Editar ' : 'Criar '}Categoria</DialogTitle>
					<DialogDescription>
						Gerencie as informações da categoria selecioando
					</DialogDescription>
				</DialogHeader>
				<FormCategoria
					categoria={categoria}
					isUpdating={isUpdating}
				/>
			</DialogContent>
		</Dialog>
	);
}
