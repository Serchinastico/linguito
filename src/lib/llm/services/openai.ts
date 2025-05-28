import {createOpenAI, OpenAIProvider} from '@ai-sdk/openai'
import {OpenAIChatModelId} from '@ai-sdk/openai/internal'

import {invariant} from '@/lib/command/invariant'
import {nonEmptyStringOrUndefined} from '@/lib/common/string'
import {Config} from '@/lib/common/types.js'
import {LlmProvider, LlmService} from '@/lib/llm/services/llm-service.js'

const DEFAULT_LANGUAGE_MODEL: OpenAIChatModelId = 'o1'

export class OpenAi implements LlmService {
  private provider!: OpenAIProvider

  constructor(private config: Config) {}

  async getAvailableModelIds(): Promise<string[]> {
    invariant(this.config.llmSettings?.provider === 'openai', 'internal_error')

    return [nonEmptyStringOrUndefined(this.config.llmSettings.model) ?? DEFAULT_LANGUAGE_MODEL]
  }

  async getProvider(): Promise<LlmProvider> {
    invariant(this.config.llmSettings?.provider === 'openai', 'internal_error')
    invariant(!!this.config.llmSettings.apiKey, 'llm:config:no_api_key')

    if (!this.provider) {
      this.provider = createOpenAI({apiKey: this.config.llmSettings.apiKey})
    }

    return this.provider
  }
}
