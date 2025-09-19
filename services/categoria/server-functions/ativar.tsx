/** @format */
'use server';

import { auth } from '@/lib/auth/auth';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function ativar(id: string) {
    const session = await auth();
    if (!session) redirect('/login');

    const baseURL = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${baseURL}categoria/ativar/${id}`, {
        method: 'PUT', 
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.access_token}`,
        },
    });

    const dataResponse = await response.json();

    if (response.status === 200) {
        revalidateTag('categories'); 
        return {
            ok: true,
            error: null,
            data: dataResponse as { desativado: boolean },
            status: 200,
        };
    }

    if (!dataResponse) {
        return {
            ok: false,
            error: 'Erro ao desativar categoria.',
            data: null,
            status: 500,
        };
    }

    return {
        ok: false,
        error: dataResponse.message,
        data: null,
        status: dataResponse.statusCode,
    };
}
