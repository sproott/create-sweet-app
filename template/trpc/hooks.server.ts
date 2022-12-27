import type { Handle } from '@sveltejs/kit'
import { appRouter } from '$lib/server'
import { createTRPCHandle } from 'trpc-sveltekit'

export const handle: Handle = createTRPCHandle({ router: appRouter })
