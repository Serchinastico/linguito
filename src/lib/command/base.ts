import {Command} from '@oclif/core'
import {CommandError} from '@oclif/core/interfaces'
import path from 'node:path'

import {canReadFile} from '../fs/fs.js'
import {invariant, INVARIANT_ERROR_PREFIX, InvariantErrorCode, invariantErrorMessage} from './invariant.js'

export default abstract class BaseCommand extends Command {
  protected async catch(err: CommandError) {
    if (err.message.startsWith(INVARIANT_ERROR_PREFIX)) {
      const code = err.message.replace(INVARIANT_ERROR_PREFIX, '') as InvariantErrorCode

      this.error(invariantErrorMessage[code], {code, exit: 1})
    } else {
      throw err
    }
  }

  /**
   * Resolves the path to the Lingui configuration file within a given project directory
   * and ensures that the file is readable.
   *
   * @param {string} projectDir - The directory path of the project where the Lingui configuration file is expected.
   * @return {Promise<string>} A promise that resolves to the absolute path of the Lingui configuration file.
   * @throws Throws an error if the configuration file is not readable or missing.
   */
  protected async getConfigFile(projectDir: string) {
    const linguiConfigFilePath = path.resolve(projectDir, 'lingui.config.js')
    const isLinguiConfigFileReadable = await canReadFile(linguiConfigFilePath)

    invariant(isLinguiConfigFileReadable, 'missing_lingui_config_file')

    return linguiConfigFilePath
  }
}
