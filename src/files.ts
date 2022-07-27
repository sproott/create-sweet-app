import path from 'path'
import fs from 'fs-extra'
import { PackageJson } from 'type-fest'

export const readPackageJson = async (dir: string): Promise<PackageJson> => {
  return (await fs.readJSON(path.join(dir, 'package.json'))) as PackageJson
}

export const writePackageJson = async (dir: string, pkgJson: PackageJson) => {
  await fs.writeJSON(path.join(dir, 'package.json'), pkgJson, {
    spaces: 2,
  })
}
