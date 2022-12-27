import { initTRPC } from '@trpc/server'
import { z } from 'zod'

const t = initTRPC.create()

const middleware = t.middleware
const router = t.router
const publicProcedure = t.procedure

export const appRouter = router({
  greeting: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input: { name } }) => `Hello, ${name}!`),
})

export type AppRouter = typeof appRouter
