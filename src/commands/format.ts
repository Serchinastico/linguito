import {Args} from '@oclif/core'

import BaseCommand from '@/lib/command/base.js'
import {ConfigParser} from '@/lib/lingui/parser.js'
import {Translations} from '@/lib/lingui/translations.js'

export default class Format extends BaseCommand {
  static args = {
    projectDir: Args.file({default: '.', description: 'Project root directory', required: false}),
  }
  static description = `Reads and cleans the project's '.po' catalog files to ensure there are no empty translations.`
  static examples = [`<%= config.bin %> <%= command.id %> ./my-app`]
  static summary = 'Cleans commented translations in catalog files.'

  async run() {
    const {args} = await this.parse(Format)
    const {projectDir} = args

    const {directory, file: linguiConfigFilePath} = await this.getConfigFile(projectDir)
    const linguiConfigFileParser = new ConfigParser(directory)
    const translationsChecker = new Translations(directory)

    const catalogFiles = await linguiConfigFileParser.parse(linguiConfigFilePath)
    await translationsChecker.format(catalogFiles)
  }
}
