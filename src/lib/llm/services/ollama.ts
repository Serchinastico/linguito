import {createOllama} from 'ollama-ai-provider'

import {invariant} from '@/lib/command/invariant.js'
import {Defaults} from '@/lib/llm/defaults.js'
import {LlmProvider, LlmService} from '@/lib/llm/services/llm-service.js'

type OllamaModelsResponse = {
  models: {
    name: string
  }[]
}

export class Ollama extends LlmService {
  private modelIds!: string[]
  private provider!: LlmProvider

  async getAvailableModelIds(): Promise<string[]> {
    invariant(this.config.llmSettings?.provider === 'ollama', 'internal_error')

    if (!this.modelIds) {
      const response = await fetch(`${this.config.llmSettings.url ?? Defaults.llmSettings.ollama.url}/tags`)
      const json: OllamaModelsResponse = await response.json()
      this.modelIds = json.models.map((model) => model.name)
    }

    return this.modelIds
  }

  async getProvider(): Promise<LlmProvider> {
    invariant(this.config.llmSettings?.provider === 'ollama', 'internal_error')

    if (!this.provider) {
      this.provider = createOllama({baseURL: this.config.llmSettings.url ?? Defaults.llmSettings.ollama.url})
    }

    return this.provider
  }
}
