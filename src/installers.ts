import path from 'path'
import { PKG_ROOT } from './constants'
import { Installer } from './types'

export const windiInstaller: Installer = {
  name: 'WindiCSS',
  run: async ({ install }) => {
    const windiAssetDir = path.join(PKG_ROOT, 'template/windi')

    const viteConfigSrc = path.join(windiAssetDir, 'vite.config.js')
    const viteConfigDest = 'vite.config.js'

    const layoutSvelteSrc = path.join(windiAssetDir, '__layout.svelte')
    const layoutSvelteDest = 'src/routes/__layout.svelte'

    await Promise.all([
      install(viteConfigSrc, viteConfigDest),
      install(layoutSvelteSrc, layoutSvelteDest),
    ])

    return {
      dependencies: [{ name: 'vite-plugin-windicss', dev: true }],
    }
  },
}

export interface TrpcInstallerOptions {
  useExperimentalVersion: boolean
}

export const trpcInstaller = ({
  useExperimentalVersion,
}: TrpcInstallerOptions): Installer => ({
  name: 'tRPC',
  run: async ({ install }) => {
    const trpcAssetDir = path.join(PKG_ROOT, 'template/trpc')

    const serverSrc = path.join(
      trpcAssetDir,
      useExperimentalVersion ? 'experimental-server.ts' : 'base-server.ts',
    )
    const serverDest = 'src/lib/server/index.ts'

    const clientSrc = path.join(
      trpcAssetDir,
      useExperimentalVersion ? 'experimental-client.ts' : 'base-client.ts',
    )
    const clientDest = 'src/lib/trpcClient.ts'

    const hooksSrc = path.join(trpcAssetDir, 'hooks.ts')
    const hooksDest = 'src/hooks.ts'

    if (useExperimentalVersion) {
      const npmrcSrc = path.join(trpcAssetDir, 'npmrc')
      const npmrcDest = '.npmrc'
      await install(npmrcSrc, npmrcDest)
    }

    await Promise.all([
      install(serverSrc, serverDest),
      install(clientSrc, clientDest),
      install(hooksSrc, hooksDest),
    ])

    const version = useExperimentalVersion ? 'experimental' : undefined
    return {
      dependencies: [
        { name: '@trpc/server', version },
        { name: '@trpc/client', version },
        { name: 'trpc-transformer' },
        { name: 'trpc-sveltekit' },
        { name: 'zod' },
      ],
    }
  },
})

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
