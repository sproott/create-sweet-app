import path from 'path'
import { PKG_ROOT } from './constants.js'
import { Installer } from './types'

export const windiInstaller: Installer = {
  name: 'WindiCSS',
  // eslint-disable-next-line @typescript-eslint/require-await
  run: async ({ install }) => {
    const windiAssetDir = path.join(PKG_ROOT, 'template/windi')

    const viteConfigSrc = path.join(windiAssetDir, 'vite.config.js')
    const viteConfigDest = 'vite.config.js'
    await install(viteConfigSrc, viteConfigDest)

    const layoutSvelteSrc = path.join(windiAssetDir, '__layout.svelte')
    const layoutSvelteDest = 'src/routes/__layout.svelte'
    await install(layoutSvelteSrc, layoutSvelteDest)

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
  // eslint-disable-next-line @typescript-eslint/require-await
  run: async () => {
    const version = useExperimentalVersion ? 'experimental' : 'latest'

    return {
      dependencies: [
        { name: '@trpc/server', version },
        { name: '@trpc/client', version },
      ],
    }
  },
})
