import {invariant} from '@/lib/command/invariant.js'
import {Config, FilledTranslation, MissingTranslation} from '@/lib/common/types.js'
import {createOpenAICompatible, OpenAICompatibleProvider} from '@ai-sdk/openai-compatible'
import {generateText} from 'ai'
import fs from 'node:fs/promises'

type ModelsResponse = {
  data: {
    id: string
    object: string
    owned_by: string
  }[]
  object: string
}

const LLM_URL = 'http://localhost:1234/v1'

const SYSTEM_PROMPT = `You are a professional translator. You are given a text appearing in an application and you need to translate to the desired language. You will be given context and instructions on how to translate the text. Do not answer with anything else than the translated text.`
const getTranslationPrompt = ({fileContents, key, locale}: {fileContents: string; key: string; locale: string}) =>
  `I need you to translate a text for me. The text appears in an application and I need you to give me the translation to the ${locale} language locale.
The translation includes some special characters like placeholders (e.g. {0} or {1}) or markup (e.g. <1> or </1>) that need to be preserved. DO NOT include extra spaces, end of line characters or punctuation.
I'm including here the file where the translation appears to give you additional context:

\`\`\`
${fileContents}
\`\`\`

Finally, translate the following text: "${key}"`

export class Llm {
  private modelIds!: string[]
  private provider!: OpenAICompatibleProvider

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
    const llmProvider = await this.getProvider()
    const availableModelIds = await this.getAvailableModelIds()

    invariant(availableModelIds.length > 0, 'lmstudio:no_models_found')

    const modelId = availableModelIds[0]
    const model = llmProvider(modelId)

    const fileContents = await fs.readFile(missingTranslation.reference.filePath, 'utf-8')

    const {text} = await generateText({
      model,
      prompt: getTranslationPrompt({
        fileContents,
        key: missingTranslation.key,
        locale: missingTranslation.locale,
      }),
      system: this.config.systemPrompt ?? SYSTEM_PROMPT,
    })

    return {...missingTranslation, translation: text.trim()}
  }

  private async getAvailableModelIds(): Promise<string[]> {
    if (!this.modelIds) {
      const response = await fetch(`${this.config.llmSettings?.url ?? LLM_URL}/models`)
      const json: ModelsResponse = await response.json()
      this.modelIds = json.data.map((model) => model.id)
    }

    return this.modelIds
  }

  private async getProvider(): Promise<OpenAICompatibleProvider> {
    if (!this.provider) {
      this.provider = createOpenAICompatible({
        baseURL: this.config.llmSettings?.url ?? LLM_URL,
        name: this.config.llmSettings?.provider ?? 'lmstudio',
      })
    }

    return this.provider
  }
}
