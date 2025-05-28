import {createOllama} from 'ollama-ai-provider'

import {invariant} from '@/lib/command/invariant'
import {Config} from '@/lib/common/types.js'
import {LlmProvider, LlmService} from '@/lib/llm/services/llm-service.js'

type OllamaModelsResponse = {
  models: {
    name: string
  }[]
}

const OLLAMA_DEFAULT_URL = 'http://localhost:11434/api'

export class Ollama implements LlmService {
  private modelIds!: string[]
  private provider!: LlmProvider

  constructor(private config: Config) {}

  async getAvailableModelIds(): Promise<string[]> {
    invariant(this.config.llmSettings?.provider === 'ollama', 'internal_error')

    if (!this.modelIds) {
      const response = await fetch(`${this.config.llmSettings.url ?? OLLAMA_DEFAULT_URL}/tags`)
      const json: OllamaModelsResponse = await response.json()
      this.modelIds = json.models.map((model) => model.name)
    }

    return this.modelIds
  }

  async getProvider(): Promise<LlmProvider> {
    invariant(this.config.llmSettings?.provider === 'ollama', 'internal_error')

    if (!this.provider) {
      this.provider = createOllama({baseURL: this.config.llmSettings.url ?? OLLAMA_DEFAULT_URL})
    }

    return this.provider
  }
}
