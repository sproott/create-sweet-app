import { Installer } from './types'

export const windiInstaller: Installer = {
  name: 'WindiCSS',
  // eslint-disable-next-line @typescript-eslint/require-await
  run: async () => {
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
