import {createOpenAICompatible} from '@ai-sdk/openai-compatible'

import {invariant} from '@/lib/command/invariant.js'
import {Config} from '@/lib/common/types.js'
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

export class LmStudio implements LlmService {
  private modelIds!: string[]
  private provider!: LlmProvider

  constructor(private config: Config) {}

  async getAvailableModelIds(): Promise<string[]> {
    invariant(this.config.llmSettings?.provider === 'lmstudio', 'internal_error')

    if (!this.modelIds) {
      const response = await fetch(`${this.config.llmSettings?.url ?? Defaults.llmSettings.lmstudio.url}/v1/models`)
      const json: LmStudioModelsResponse = await response.json()
      this.modelIds = json.data.map((model) => model.id)
    }

    return this.modelIds
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
