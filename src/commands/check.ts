import {Args} from '@oclif/core'
import * as path from 'node:path'

import BaseCommand from '../lib/command/base.js'
import {invariant} from '../lib/command/invariant.js'
import {canReadFile} from '../lib/fs/fs.js'
import {TranslationsChecker} from '../lib/lingui/checker.js'
import {ConfigParser} from '../lib/lingui/parser.js'

const SEPARATOR = '\n\t• '

export default class Check extends BaseCommand {
  static args = {
    projectDir: Args.file({default: '.', description: 'Project root directory', required: false}),
  }
  static description = `Analyze the project's '.po' catalog files to ensure all translations are complete. 
If any missing translations are found, the command reports them and exits with an error.`
  static examples = [`<%= config.bin %> <%= command.id %> ./my-app`]
  static summary = 'Check for missing translations in catalog files.'

  async run() {
    const {args} = await this.parse(Check)
    const {projectDir} = args

    const linguiConfigFilePath = await this.getConfigFile(projectDir)
    const linguiConfigFileParser = new ConfigParser(projectDir)
    const translationsChecker = new TranslationsChecker()

    const catalogFiles = await linguiConfigFileParser.parse(linguiConfigFilePath)
    const missingTranslations = await translationsChecker.findMissing(catalogFiles)

    if (missingTranslations.length > 0) {
      const missingTranslationsString = missingTranslations
        .map((translation) => `${translation.file}:"${translation.key}"`)
        .join(SEPARATOR)

      this.error(`The following translations are missing: ${SEPARATOR}${missingTranslationsString}`, {
        code: 'missing_translations',
        exit: -2,
      })
    }
  }

  private async getConfigFile(projectDir: string) {
    const linguiConfigFilePath = path.resolve(projectDir, 'lingui.config.js')
    const isLinguiConfigFileReadable = await canReadFile(linguiConfigFilePath)

    invariant(isLinguiConfigFileReadable, 'missing_lingui_config_file')

    return linguiConfigFilePath
  }
}
