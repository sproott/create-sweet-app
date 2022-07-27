export interface Dependency {
  name: string
  version?: string
  dev?: boolean
}
export interface Installer {
  name: string
  run: () => Promise<{ dependencies: Dependency[] }>
}
