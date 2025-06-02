import {generateObject} from 'ai'
import fs from 'node:fs/promises'
import {z} from 'zod'

import {invariant} from '@/lib/command/invariant.js'
import {nonEmptyStringOrUndefined} from '@/lib/common/string.js'
import {Config, FilledTranslation, LlmProvider, MissingTranslation} from '@/lib/common/types.js'
import {Defaults} from '@/lib/llm/defaults.js'
import {Claude} from '@/lib/llm/services/claude.js'
import {LlmService} from '@/lib/llm/services/llm-service.js'
import {LmStudio} from '@/lib/llm/services/lmstudio.js'
import {Ollama} from '@/lib/llm/services/ollama.js'
import {OpenAi} from '@/lib/llm/services/openai.js'

const getTranslationPrompt = ({fileContents, key, locale}: {fileContents: string; key: string; locale: string}) =>
  `I need you to translate a text for me. The text appears in an application and I need you to give me the translation to the ${locale} language locale.
The translation includes some special characters like placeholders (e.g. {0} or {1}) or markup (e.g. <1> or </1>) that need to be preserved. DO NOT include extra spaces, end of line characters or punctuation.
I'm including here the file where the translation appears to give you additional context:

\`\`\`
${fileContents}
\`\`\`

Finally, translate the following text: "${key}"`

export class Llm {
  private service!: LlmService

  constructor(private config: Config) {}

  async translate(missingTranslations: MissingTranslation[]): Promise<FilledTranslation[]> {
    const translations: FilledTranslation[] = []

    for (const missingTranslation of missingTranslations) {
      const translation = await this.translateOne(missingTranslation)
      translations.push(translation)
    }

    return translations
  }

  async translateOne(missingTranslation: MissingTranslation): Promise<FilledTranslation> {
    const llmService = await this.getService()
    const model = await llmService.getModel()

    const fileContents = await fs.readFile(missingTranslation.reference.filePath, 'utf-8')

    const {object} = await generateObject({
      model,
      prompt: getTranslationPrompt({
        fileContents,
        key: missingTranslation.key,
        locale: missingTranslation.locale,
      }),
      schema: z.object({translation: z.string()}),
      system: nonEmptyStringOrUndefined(this.config.systemPrompt) ?? Defaults.systemPrompt,
    })

    return {...missingTranslation, translation: object.translation.trim()}
  }

  private createService(provider: LlmProvider): LlmService {
    switch (provider) {
      case 'claude':
        return new Claude(this.config)
      case 'lmstudio':
        return new LmStudio(this.config)
      case 'ollama':
        return new Ollama(this.config)
      case 'openai':
        return new OpenAi(this.config)
    }
  }

  private async getService(): Promise<LlmService> {
    invariant(!!this.config.llmSettings?.provider, 'internal_error')

    if (!this.service) {
      this.service = this.createService(this.config.llmSettings.provider)
    }

    return this.service
  }
}
