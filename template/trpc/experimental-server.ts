import { initTRPC } from '@trpc/server'
import { z } from 'zod'

const t = initTRPC()()

export const appRouter = t.router({
  greeting: t.procedure
    .input(z.object({ name: z.string() }))
    .query(({ input: { name } }) => `Hello, ${name}!`),
})

export type AppRouter = typeof appRouter
