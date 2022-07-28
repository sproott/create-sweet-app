import { initTRPC } from '@trpc/server';
import trpcTransformer from 'trpc-transformer';
import { z } from 'zod';

const t = initTRPC()({
	transformer: trpcTransformer
});

export const appRouter = t.router({
	greeting: t.procedure
		.input(z.object({ name: z.string() }))
		.query(({ input: { name } }) => `Hello, ${name}!`)
});

export type AppRouter = typeof appRouter;
