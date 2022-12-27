import path from 'path'
import chalk from 'chalk'
import * as svelteInit from 'create-svelte'
import { execa } from 'execa'
import fs from 'fs-extra'
import ora from 'ora'
import { PackageJson } from 'type-fest'
import { readPackageJson, writePackageJson } from './files.js'
import { prismaInstaller, trpcInstaller, windiInstaller } from './installers.js'
import { Dependency, Installer, InstallFunction } from './types.js'
import { logger } from './utils/logger.js'
import { sortObject } from './utils/sortObject.js'

interface SvelteKitOptions {
  projectName: string
  prettier: boolean
  eslint: boolean
  playwright: boolean
}
export type Options = SvelteKitOptions & {
  projectDir: string
  addPrisma: boolean
}

const addDependency = async ({
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

const runInstaller = async ({
  installer,
  projectDir,
}: {
  installer: Installer
  projectDir: string
}): Promise<ReturnType<Installer['run']>> => {
  const install: InstallFunction = (src, dest) =>
    fs.copy(src, path.join(projectDir, dest))

  const spinner = ora(`Adding ${installer.name}...`).start()
  const result = await installer.run({ install })
  spinner.succeed(
    chalk.green(`Successfully added ${chalk.green.bold(installer.name)}!`),
  )
  return result
}

export const runInstallers = async ({
  pkgJson,
  projectDir,
  addPrisma,
}: Options & {
  pkgJson: PackageJson
}) => {
  const installers: Installer[] = [
    windiInstaller,
    trpcInstaller,
    ...(addPrisma ? [prismaInstaller] : []),
  ]

  logger.info('Adding components...')

  let dependencies: Dependency[] = []
  for (const installer of installers) {
    const { dependencies: installerDeps } = await runInstaller({
      installer,
      projectDir,
    })
    dependencies = [...dependencies, ...installerDeps]
  }

  logger.info('')

  const spinner = ora('Adding dependencies...').start()
  let newPkgJson = pkgJson
  for (const dep of dependencies) {
    const result = await addDependency({
      ...dep,
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
  eslint,
  prettier,
  playwright,
}: SvelteKitOptions) => {
  logger.info('Setting up project structure...')
  const spinner = ora('Creating SvelteKit project...').start()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  svelteInit.create(projectName, {
    name: projectName,
    template: 'skeleton',
    types: 'typescript',
    eslint,
    prettier,
    playwright,
  })
  spinner.succeed(
    chalk.green(
      `Successfully created ${chalk.green.bold('SvelteKit')} project!`,
    ),
  )
  logger.info('')
}

export const create = async (options: Options) => {
  const { projectDir } = options

  createSvelteKitProject(options)

  const pkgJson = await readPackageJson(projectDir)

  const { pkgJson: newPkgJson } = await runInstallers({
    pkgJson,
    ...options,
  })

  if (newPkgJson.dependencies) {
    newPkgJson.dependencies = sortObject(newPkgJson.dependencies)
  }
  if (newPkgJson.devDependencies) {
    newPkgJson.devDependencies = sortObject(newPkgJson.devDependencies)
  }

  await writePackageJson(projectDir, newPkgJson)
}
