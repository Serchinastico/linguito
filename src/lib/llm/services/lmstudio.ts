import {createOpenAICompatible, OpenAICompatibleChatLanguageModel} from '@ai-sdk/openai-compatible'
import {LanguageModelV1} from 'ai'

import {invariant} from '@/lib/command/invariant.js'
import {Defaults} from '@/lib/llm/defaults.js'
import {LlmProvider, LlmService} from '@/lib/llm/services/llm-service.js'

type LmStudioModelsResponse = {
  data: {
    id: string
    object: string
    owned_by: string
  }[]
  object: string
}

export class LmStudio extends LlmService {
  private modelIds!: string[]
  private provider!: LlmProvider

  async getAvailableModelIds(): Promise<string[]> {
    invariant(this.config.llmSettings?.provider === 'lmstudio', 'internal_error')

    if (!this.modelIds) {
      const response = await fetch(`${this.config.llmSettings?.url ?? Defaults.llmSettings.lmstudio.url}/v1/models`)
      const json: LmStudioModelsResponse = await response.json()
      this.modelIds = json.data.map((model) => model.id)
    }

    return this.modelIds
  }

  async getModel(): Promise<LanguageModelV1> {
    const llmSettings = this.config.llmSettings
    invariant(llmSettings?.provider === 'lmstudio', 'internal_error')

    const models = await this.getAvailableModelIds()

    return new OpenAICompatibleChatLanguageModel(
      models[0],
      {},
      {
        defaultObjectGenerationMode: 'json',
        headers: () => ({}),
        provider: `lmstudio.chat`,
        supportsStructuredOutputs: true,
        url: ({path}) => {
          const url = new URL(`${llmSettings.url ?? Defaults.llmSettings.lmstudio.url}/v1${path}`)
          return url.toString()
        },
      },
    )
  }

  async getProvider(): Promise<LlmProvider> {
    invariant(this.config.llmSettings?.provider === 'lmstudio', 'internal_error')

    if (!this.provider) {
      this.provider = createOpenAICompatible({
        baseURL: `${this.config.llmSettings.url ?? Defaults.llmSettings.lmstudio.url}/v1`,
        name: 'lmstudio',
      })
    }

    return this.provider
  }
}
