import path from 'path'
import chalk from 'chalk'
import * as svelteInit from 'create-svelte'
import { execa } from 'execa'
import ora from 'ora'
import { PackageJson } from 'type-fest'
import { readPackageJson, writePackageJson } from './files'
import {
  trpcInstaller,
  TrpcInstallerOptions,
  windiInstaller,
} from './installers'
import { Dependency, Installer } from './types'
import { logger } from './utils/logger'

interface SvelteKitOptions {
  projectName: string
  prettier: boolean
  eslint: boolean
}
export type Options = SvelteKitOptions & {
  useExperimentalTrpcVersion: boolean
}

const addPackage = async ({
  pkgJson,
  name,
  version = 'latest',
  dev = false,
}: {
  pkgJson: PackageJson
  name: string
  version?: string
  dev?: boolean
}): Promise<{ pkgJson: PackageJson }> => {
  const { stdout: latestVersion } = await execa('npm', [
    'show',
    `${name}@${version}`,
    'version',
  ])

  const fieldName = dev ? 'devDependencies' : 'dependencies'

  return {
    pkgJson: {
      ...pkgJson,
      [fieldName]: {
        ...pkgJson[fieldName],
        [name]: `^${latestVersion}`,
      },
    },
  }
}

const runInstaller = async (
  installer: Installer,
): Promise<ReturnType<Installer['run']>> => {
  const spinner = ora(`Adding ${installer.name}...`).start()
  const result = await installer.run()
  spinner.succeed(
    chalk.green(`Successfully added ${chalk.green.bold(installer.name)}!`),
  )
  return result
}

export const runInstallers = async ({
  pkgJson,
  useExperimentalTrpcVersion,
}: {
  pkgJson: PackageJson
  useExperimentalTrpcVersion: boolean
}) => {
  const installers: Installer[] = [
    windiInstaller,
    trpcInstaller({ useExperimentalVersion: useExperimentalTrpcVersion }),
  ]

  logger.info('Adding components...')
  const outputs = await Promise.all(installers.map(runInstaller))

  const packages = outputs.reduce<Dependency[]>((acc, output) => {
    return [...acc, ...output.dependencies]
  }, [])
  logger.info('')

  const spinner = ora('Adding dependencies...').start()
  let newPkgJson = pkgJson
  for (const pkg of packages) {
    const result = await addPackage({
      ...pkg,
      pkgJson: newPkgJson,
    })
    newPkgJson = result.pkgJson
  }
  spinner.succeed(chalk.green('Successfully added dependencies!'))
  logger.info('')

  return { pkgJson: newPkgJson }
}

const createSvelteKitProject = ({
  projectName,
  prettier,
  eslint,
}: SvelteKitOptions) => {
  logger.info('Creating SvelteKit project...')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  svelteInit.create(projectName, {
    name: projectName,
    template: 'skeleton',
    types: 'typescript',
    prettier,
    eslint,
    playwright: false,
  })
  logger.success(
    `Successfully created ${chalk.green.bold('SvelteKit')} project!`,
  )
  logger.info('')
}

export const create = async (options: Options) => {
  const { projectName } = options

  const projectDir = path.join('.', projectName)

  createSvelteKitProject(options)

  const pkgJson = await readPackageJson(projectDir)

  const { pkgJson: newPkgJson } = await runInstallers({
    pkgJson,
    ...options,
  })

  await writePackageJson(projectDir, newPkgJson)
}
