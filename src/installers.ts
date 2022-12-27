import path from 'path'
import { PKG_ROOT } from './constants.js'
import { Installer } from './types.js'

export const windiInstaller: Installer = {
  name: 'WindiCSS',
  run: async ({ install }) => {
    const windiAssetDir = path.join(PKG_ROOT, 'template/windi')

    const viteConfigSrc = path.join(windiAssetDir, 'vite.config.js')
    const viteConfigDest = 'vite.config.js'

    const windiConfigSrc = path.join(windiAssetDir, 'windi.config.ts')
    const windiConfigDest = 'windi.config.ts'

    const layoutSvelteSrc = path.join(windiAssetDir, '+layout.svelte')
    const layoutSvelteDest = 'src/routes/+layout.svelte'

    await Promise.all([
      install(viteConfigSrc, viteConfigDest),
      install(windiConfigSrc, windiConfigDest),
      install(layoutSvelteSrc, layoutSvelteDest),
    ])

    return {
      dependencies: [
        { name: 'vite-plugin-windicss', dev: true },
        { name: 'windicss', dev: true },
      ],
    }
  },
}

export const trpcInstaller: Installer = {
  name: 'tRPC',
  run: async ({ install }) => {
    const trpcAssetDir = path.join(PKG_ROOT, 'template/trpc')

    const serverSrc = path.join(trpcAssetDir, 'server.ts')
    const serverDest = 'src/lib/server/index.ts'

    const clientSrc = path.join(trpcAssetDir, 'client.ts')
    const clientDest = 'src/lib/trpc.ts'

    const hooksSrc = path.join(trpcAssetDir, 'hooks.server.ts')
    const hooksDest = 'src/hooks.server.ts'

    await Promise.all([
      install(serverSrc, serverDest),
      install(clientSrc, clientDest),
      install(hooksSrc, hooksDest),
    ])

    return {
      dependencies: [
        { name: '@trpc/server' },
        { name: '@trpc/client' },
        { name: 'trpc-sveltekit' },
        { name: 'zod' },
      ],
    }
  },
}

export const prismaInstaller: Installer = {
  name: 'Prisma',
  run: async ({ install }) => {
    const prismaAssetDir = path.join(PKG_ROOT, 'template/prisma')

    const prismaSchemaSrc = path.join(prismaAssetDir, 'schema.prisma')
    const prismaSchemaDest = 'prisma/schema.prisma'

    const prismaClientSrc = path.join(prismaAssetDir, 'client.ts')
    const prismaClientDest = 'src/lib/prismaClient.ts'

    const dotenvSrc = path.join(prismaAssetDir, '.env-example')
    const dotenvDest = '.env'

    await Promise.all([
      install(prismaSchemaSrc, prismaSchemaDest),
      install(prismaClientSrc, prismaClientDest),
      install(dotenvSrc, dotenvDest),
    ])

    return {
      dependencies: [{ name: 'prisma', dev: true }, { name: '@prisma/client' }],
    }
  },
}
