import path from 'path'
import * as svelteInit from 'create-svelte'
import { execa } from 'execa'
import fs from 'fs-extra'
import { PackageJson } from 'type-fest'

export interface Options {
  projectName: string
  prettier: boolean
  eslint: boolean
}

const addPackage = async ({
  name,
  pkgJson,
  version = 'latest',
}: {
  name: string
  pkgJson: PackageJson
  version?: string
}): Promise<{ pkgJson: PackageJson }> => {
  const { stdout: latestVersion } = await execa('npm', [
    'show',
    `${name}@${version}`,
    'version',
  ])

  return {
    pkgJson: {
      ...pkgJson,
      dependencies: {
        ...pkgJson.dependencies,
        [name]: `^${latestVersion}`,
      },
    },
  }
}

interface Package {
  name: string
  version?: string
}
type Addon = () => Promise<{ packages: Package[] }>

// eslint-disable-next-line @typescript-eslint/require-await
const addWindi: Addon = async () => {
  return {
    packages: [{ name: 'vite-plugin-windicss' }],
  }
}

// eslint-disable-next-line @typescript-eslint/require-await
const addTrpc: Addon = async () => {
  const version = 'latest'

  return {
    packages: [
      { name: '@trpc/server', version },
      { name: '@trpc/client', version },
    ],
  }
}

const runAddons = async ({ pkgJson }: { pkgJson: PackageJson }) => {
  const addons: Addon[] = [addWindi, addTrpc]

  const outputs = await Promise.all(addons.map((addon) => addon()))

  const packages = outputs.reduce<Package[]>((acc, output) => {
    return [...acc, ...output.packages]
  }, [])

  let newPkgJson = pkgJson
  for (const pkg of packages) {
    const result = await addPackage({
      ...pkg,
      pkgJson: newPkgJson,
    })
    newPkgJson = result.pkgJson
  }

  return { pkgJson: newPkgJson }
}

export const create = async ({
  projectName = 'sweet-app',
  prettier,
  eslint,
}: Options) => {
  const projectDir = projectName

  console.info('Creating SvelteKit project...')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  svelteInit.create(projectDir, {
    name: projectName,
    template: 'skeleton',
    types: 'typescript',
    prettier,
    eslint,
    playwright: false,
  })
  console.info('Project created!')

  const pkgJson = (await fs.readJSON(
    path.join(projectDir, 'package.json'),
  )) as PackageJson

  const { pkgJson: newPkgJson } = await runAddons({ pkgJson })

  console.log(newPkgJson.dependencies)
}
