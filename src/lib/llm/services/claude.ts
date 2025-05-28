import {AnthropicProvider, createAnthropic} from '@ai-sdk/anthropic'
import {AnthropicMessagesModelId} from '@ai-sdk/anthropic/internal'

import {invariant} from '@/lib/command/invariant'
import {nonEmptyStringOrUndefined} from '@/lib/common/string'
import {Config} from '@/lib/common/types.js'
import {LlmProvider, LlmService} from '@/lib/llm/services/llm-service.js'

const DEFAULT_LANGUAGE_MODEL: AnthropicMessagesModelId = 'claude-3-5-haiku-latest'

export class Claude implements LlmService {
  private provider!: AnthropicProvider

  constructor(private config: Config) {}

  async getAvailableModelIds(): Promise<string[]> {
    invariant(this.config.llmSettings?.provider === 'claude', 'internal_error')

    return [nonEmptyStringOrUndefined(this.config.llmSettings.model) ?? DEFAULT_LANGUAGE_MODEL]
  }

  async getProvider(): Promise<LlmProvider> {
    invariant(this.config.llmSettings?.provider === 'claude', 'internal_error')
    invariant(!!this.config.llmSettings.apiKey, 'llm:config:no_api_key')

    if (!this.provider) {
      this.provider = createAnthropic({apiKey: this.config.llmSettings.apiKey})
    }

    return this.provider
  }
}
