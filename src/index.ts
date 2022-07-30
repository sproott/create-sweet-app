#!/usr/bin/env node
import path from 'path'
import chalk from 'chalk'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import { Options, create } from './init'
import { getUserPkgManager } from './utils/getUserPkgManager'
import { logger } from './utils/logger'
import { validateAppName } from './utils/validateAppName.js'

const handleDestination = async ({
  projectName,
  projectDir,
}: {
  projectName: string
  projectDir: string
}) => {
  if (fs.existsSync(projectDir)) {
    if (fs.readdirSync(projectDir).length === 0) {
      logger.info(`Destination exists but is empty, continuing...\n`)
    } else {
      const { overwriteDir } = await inquirer.prompt<{ overwriteDir: boolean }>(
        {
          name: 'overwriteDir',
          type: 'confirm',
          message: `${chalk.redBright.bold('Warning:')} ${chalk.cyan.bold(
            projectName,
          )} already exists and isn't empty. Do you want to overwrite it?`,
          default: false,
        },
      )
      if (!overwriteDir) {
        logger.error('Aborting installation...')
        process.exit(0)
      } else {
        logger.info(
          `Emptying ${chalk.cyan.bold(projectName)} and continuing...\n`,
        )
        fs.emptyDirSync(projectDir)
      }
    }
  }
}

const logNextSteps = (projectName: string) => {
  const pkgManager = getUserPkgManager()

  logger.info('Next steps:')
  logger.info(`  cd ${projectName}`)
  logger.info(`  ${pkgManager} install`)
  logger.info(`  ${pkgManager === 'npm' ? 'npm run' : pkgManager} dev`)
}

const main = async () => {
  const pkgManager = getUserPkgManager()
  if (pkgManager === 'yarn' || pkgManager === 'pnpm') {
    console.log('')
  }

  const { projectName } = await inquirer.prompt<Pick<Options, 'projectName'>>({
    name: 'projectName',
    type: 'input',
    message: 'What will your project be called?',
    default: 'my-sweet-app',
    validate: validateAppName,
    transformer: (input: string) => {
      return input.trim()
    },
  })
  const { eslint } = await inquirer.prompt<Pick<Options, 'eslint'>>({
    name: 'eslint',
    type: 'confirm',
    message: 'Add ESLint for code linting?',
    default: false,
  })
  const { prettier } = await inquirer.prompt<Pick<Options, 'prettier'>>({
    name: 'prettier',
    type: 'confirm',
    message: 'Add Prettier for code formatting?',
    default: false,
  })
  const { playwright } = await inquirer.prompt<Pick<Options, 'playwright'>>({
    name: 'playwright',
    type: 'confirm',
    message: 'Add Playwright for browser testing?',
    default: false,
  })
  const { addPrisma } = await inquirer.prompt<Pick<Options, 'addPrisma'>>({
    name: 'addPrisma',
    type: 'confirm',
    message: 'Add Prisma for database access?',
    default: false,
  })
  const { useExperimentalTrpcVersion } = await inquirer.prompt<
    Pick<Options, 'useExperimentalTrpcVersion'>
  >({
    name: 'useExperimentalTrpcVersion',
    type: 'confirm',
    message: 'Use experimental version of tRPC with new features?',
    default: false,
  })
  logger.info('')

  const projectDir = path.resolve(process.cwd(), projectName)
  await handleDestination({ projectDir, projectName })

  const options: Options = {
    projectName,
    eslint,
    prettier,
    playwright,
    useExperimentalTrpcVersion,
    addPrisma,
    projectDir,
  }

  await create(options)

  logNextSteps(projectName)
}

void main()
