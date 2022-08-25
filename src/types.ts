export interface Dependency {
  name: string
  version?: string
  dev?: boolean
}

export type InstallFunction = (
  sourceFile: string,
  destFile: string,
) => Promise<void>

export interface Installer {
  name: string
  run: (args: {
    install: InstallFunction
  }) => Promise<{ dependencies: Dependency[] }>
}
