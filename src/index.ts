import inquirer from 'inquirer'
import { Options, create } from './init'
import { logger } from './utils/logger'

const main = async () => {
  const { projectName } = await inquirer.prompt<Pick<Options, 'projectName'>>({
    name: 'projectName',
    type: 'input',
    message: 'What is the name of your project?',
    default: 'my-sweet-app',
  })
  const { prettier } = await inquirer.prompt<Pick<Options, 'prettier'>>({
    name: 'prettier',
    type: 'confirm',
    message: 'Add Prettier for code formatting?',
    default: false,
  })
  const { eslint } = await inquirer.prompt<Pick<Options, 'eslint'>>({
    name: 'eslint',
    type: 'confirm',
    message: 'Add ESLint for code linting?',
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

  const options: Options = {
    projectName,
    prettier,
    eslint,
    useExperimentalTrpcVersion,
  }

  await create(options)
}

void main()
