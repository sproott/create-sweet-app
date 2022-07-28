import * as trpc from '@trpc/server';

import trpcTransformer from 'trpc-transformer';
import { z } from 'zod';

export const appRouter = trpc
	.router()
	.query('greeting', {
		input: z.object({ name: z.string() }),
		resolve: ({ input: { name } }) => `Hello, ${name}!`
	})
	.transformer(trpcTransformer);

export type AppRouter = typeof appRouter;
