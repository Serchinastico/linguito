import {Args, Flags} from '@oclif/core'

import BaseCommand from '../lib/command/base.js'
import {invariant} from '../lib/command/invariant.js'
import {ConfigParser} from '../lib/lingui/parser.js'
import {Translations} from '../lib/lingui/translations.js'
import {Llm} from '../lib/llm/llm.js'
import {AskForTranslations, Props as AskForTranslationsProps, FilledTranslation} from '../lib/ui/AskForTranslations.js'
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
      description:
        'Runs the translation command in interactive mode. If the llm flag is active, it will let you review AI translations, otherwise it will ask you to fill in the missing translations.',
    }),
    llm: Flags.boolean({
      char: 'l',
      default: true,
      description: 'Translates all missing copies using a LLM.',
    }),
  }
  static summary = 'Check for missing translations in catalog files.'

  async run() {
    const {args, flags} = await this.parse(Translate)
    const {projectDir} = args
    const {interactive, llm} = flags

    invariant(interactive || llm, 'invalid_translate_options')

    const linguiConfigFilePath = await this.getConfigFile(projectDir)
    const linguiConfigFileParser = new ConfigParser(projectDir)
    const translations = new Translations(projectDir)

    const catalogFiles = await linguiConfigFileParser.parse(linguiConfigFilePath)
    const missingTranslations = await translations.getMissing(catalogFiles)

    if (missingTranslations.length === 0) {
      this.exit(0)
    }

    if (interactive) {
      const filledTranslations = await render<FilledTranslation[], AskForTranslationsProps>(AskForTranslations, {
        missingTranslations,
      })
      await translations.addMissing(filledTranslations)
    } else if (llm) {
      const llm = new Llm()
      const filledTranslations = await llm.translate(missingTranslations)
      await translations.addMissing(filledTranslations)
    }
  }
}
