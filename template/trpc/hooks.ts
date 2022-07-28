import type { Handle } from '@sveltejs/kit';
import { appRouter } from '$lib/server';
import { createTRPCHandle } from 'trpc-sveltekit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await createTRPCHandle({
		router: appRouter,
		event,
		resolve
	});

	return response;
};
