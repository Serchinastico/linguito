import {generateObject} from 'ai'
import fs from 'node:fs/promises'
import {z} from 'zod'

import {invariant} from '@/lib/command/invariant.js'
import {Config, FilledTranslation, LlmProvider, MissingTranslation} from '@/lib/common/types.js'
import {LlmService} from '@/lib/llm/services/llm-service.js'
import {LmStudio} from '@/lib/llm/services/lmstudio.js'
import {Ollama} from '@/lib/llm/services/ollama.js'
import {OpenAi} from '@/lib/llm/services/openai'

const SYSTEM_PROMPT = `You are a professional translator. You are given a text appearing in an application and you need to translate to the desired language. You will be given context and instructions on how to translate the text. Do not answer with anything else than the translated text. Your response will only contained the translated text, with no extra characters, punctuation or information.`

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
    const provider = await llmService.getProvider()
    const availableModelIds = await llmService.getAvailableModelIds()

    invariant(availableModelIds.length > 0, 'llm:no_models_found')

    const modelId = availableModelIds[0]
    const model = provider(modelId, {structuredOutputs: true})

    const fileContents = await fs.readFile(missingTranslation.reference.filePath, 'utf-8')

    const {object} = await generateObject({
      model,
      prompt: getTranslationPrompt({
        fileContents,
        key: missingTranslation.key,
        locale: missingTranslation.locale,
      }),
      schema: z.object({translation: z.string()}),
      system: this.config.systemPrompt ?? SYSTEM_PROMPT,
    })

    return {...missingTranslation, translation: object.translation.trim()}
  }

  private createService(provider: LlmProvider): LlmService {
    switch (provider) {
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
