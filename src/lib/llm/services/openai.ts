import {createOpenAI, OpenAIProvider} from '@ai-sdk/openai'

import {invariant} from '@/lib/command/invariant.js'
import {nonEmptyStringOrUndefined} from '@/lib/common/string.js'
import {Config} from '@/lib/common/types.js'
import {Defaults} from '@/lib/llm/defaults.js'
import {LlmProvider, LlmService} from '@/lib/llm/services/llm-service.js'

export class OpenAi implements LlmService {
  private provider!: OpenAIProvider

  constructor(private config: Config) {}

  async getAvailableModelIds(): Promise<string[]> {
    invariant(this.config.llmSettings?.provider === 'openai', 'internal_error')

    return [nonEmptyStringOrUndefined(this.config.llmSettings.model) ?? Defaults.llmSettings.openai.model]
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
