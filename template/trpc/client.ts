import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import type { AppRouter } from './server'
import { createTRPCClient, type TRPCClientInit } from 'trpc-sveltekit'

let browserClient: ReturnType<typeof createTRPCClient<AppRouter>>

export default (init?: TRPCClientInit) => {
  if (typeof window === 'undefined')
    return createTRPCClient<AppRouter>({ init })
  if (!browserClient) browserClient = createTRPCClient<AppRouter>()
  return browserClient
}

export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
