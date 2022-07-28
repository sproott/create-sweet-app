import { createTRPCClient } from '@trpc/client'
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server'

import type { AppRouter } from './server'
import type { LoadEvent } from '@sveltejs/kit'
import { browser } from '$app/env'

const url = browser ? '/trpc' : 'http://localhost:3000/trpc'
export default (loadFetch?: LoadEvent['fetch']) =>
  createTRPCClient<AppRouter>({
    url: loadFetch ? '/trpc' : url,
    ...(loadFetch && { fetch: loadFetch as typeof fetch }),
  })

export type inferQueryOutput<
  TRouteKey extends keyof AppRouter['_def']['queries'],
> = inferProcedureOutput<AppRouter['_def']['queries'][TRouteKey]>

export type inferQueryInput<
  TRouteKey extends keyof AppRouter['_def']['queries'],
> = inferProcedureInput<AppRouter['_def']['queries'][TRouteKey]>

export type inferMutationOutput<
  TRouteKey extends keyof AppRouter['_def']['mutations'],
> = inferProcedureOutput<AppRouter['_def']['mutations'][TRouteKey]>

export type inferMutationInput<
  TRouteKey extends keyof AppRouter['_def']['mutations'],
> = inferProcedureInput<AppRouter['_def']['mutations'][TRouteKey]>
