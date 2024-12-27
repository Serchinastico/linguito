import {Args} from '@oclif/core'

import BaseCommand from '../lib/command/base.js'
import {ConfigParser} from '../lib/lingui/parser.js'
import {Translations} from '../lib/lingui/translations.js'

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
    const translationsChecker = new Translations(projectDir)

    const catalogFiles = await linguiConfigFileParser.parse(linguiConfigFilePath)
    const missingTranslations = await translationsChecker.getMissing(catalogFiles)

    if (missingTranslations.length > 0) {
      const missingTranslationsString = missingTranslations
        .map((translation) => `${translation.file}:"${translation.key}"`)
        .join(SEPARATOR)

      this.error(`The following translations are missing: ${SEPARATOR}${missingTranslationsString}`, {
        code: 'missing_translations',
        exit: 2,
      })
    }
  }
}
