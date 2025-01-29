import {Config} from '@/lib/common/types.js'
import {LlmProvider, LlmService} from '@/lib/llm/services/llm-service.js'
import {createOpenAICompatible} from '@ai-sdk/openai-compatible'

const LM_STUDIO_DEFAULT_URL = 'http://localhost:1234/v1'

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

  constructor(private config: Config) {
    super()
  }

  async getAvailableModelIds(): Promise<string[]> {
    if (!this.modelIds) {
      const response = await fetch(`${this.config.llmSettings?.url ?? LM_STUDIO_DEFAULT_URL}/models`)
      const json: LmStudioModelsResponse = await response.json()
      this.modelIds = json.data.map((model) => model.id)
    }

    return this.modelIds
  }

  async getProvider(): Promise<LlmProvider> {
    if (!this.provider) {
      this.provider = createOpenAICompatible({
        baseURL: this.config.llmSettings?.url ?? LM_STUDIO_DEFAULT_URL,
        name: this.config.llmSettings?.provider ?? 'lmstudio',
      })
    }

    return this.provider
  }
}
