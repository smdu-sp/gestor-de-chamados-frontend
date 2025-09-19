/** @format */

'use client';

import { ICategoria } from '@/types/categoria';
import { ColumnDef } from '@tanstack/react-table';
import ModalUpdateAndCreate from './modal-update-create';
import ModalDelete from './modal-delete';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<ICategoria>[] = [
	{
		accessorKey: 'nome',
		header: 'Nome',
	},
	{
		accessorKey: 'status',
		header: () => <p className='text-center'>Status</p>,
		cell: ({ row }) => {
			const status = row.original.status;
			return (
				<div className='flex items-center justify-center'>
					<Badge variant={status ? 'default' : 'destructive'}>
						{status ? 'Ativo' : 'Inativo'}
					</Badge>
				</div>
			);
		},
	},
	{
		accessorKey: 'actions',
		header: () => <p className='text-center'>Ações</p>,
		cell: ({ row }) => {
			return (
				<div
					className='flex gap-2 items-center justify-center'
					key={row.id}>
					<ModalUpdateAndCreate
						categoria={row.original}
						isUpdating={true}
					/>
					<ModalDelete
						status={!row.original.status} 
						id={row.original.id}
					/>
				</div>
			);
		},
	},
];
