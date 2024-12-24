import {Args, Flags} from '@oclif/core'

import BaseCommand from '../lib/command/base.js'
import {ConfigParser} from '../lib/lingui/parser.js'
import {Translations} from '../lib/lingui/translations.js'
import {AskForTranslations, FilledTranslation, Props} from '../lib/ui/AskForTranslations.js'
import {render} from '../lib/ui/render.js'

export default class Translate extends BaseCommand {
  static args = {
    projectDir: Args.file({default: '.', description: 'Project root directory', required: false}),
  }
  static description = `Analyze the project's '.po' catalog files to ensure all translations are complete. 
If any missing translations are found, the command reports them and exits with an error.`
  static examples = [`<%= config.bin %> <%= command.id %> ./my-app`]
  static flags = {
    interactive: Flags.boolean({
      char: 'i',
      default: false,
      description: 'Runs the translation command in interactive mode',
    }),
  }
  static summary = 'Check for missing translations in catalog files.'

  async run() {
    const {args} = await this.parse(Translate)
    const {projectDir} = args

    const linguiConfigFilePath = await this.getConfigFile(projectDir)
    const linguiConfigFileParser = new ConfigParser(projectDir)
    const translations = new Translations(projectDir)

    const catalogFiles = await linguiConfigFileParser.parse(linguiConfigFilePath)
    const missingTranslations = await translations.getMissing(catalogFiles)

    if (missingTranslations.length === 0) {
      this.exit(0)
    }

    const filledTranslations = await render<FilledTranslation[], Props>(AskForTranslations, {missingTranslations})

    await translations.addMissing(filledTranslations)
  }
}
