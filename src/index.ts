import { Options, create } from './init'

const main = async () => {
  const options: Options = {
    projectName: 'my-sweet-app',
    prettier: true,
    eslint: true,
  }

  await create(options)
}

void main()
