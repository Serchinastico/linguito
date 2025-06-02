import {AnthropicProvider, createAnthropic} from '@ai-sdk/anthropic'

import {invariant} from '@/lib/command/invariant.js'
import {nonEmptyStringOrUndefined} from '@/lib/common/string.js'
import {Defaults} from '@/lib/llm/defaults.js'
import {LlmProvider, LlmService} from '@/lib/llm/services/llm-service.js'

export class Claude extends LlmService {
  private provider!: AnthropicProvider

  async getAvailableModelIds(): Promise<string[]> {
    invariant(this.config.llmSettings?.provider === 'claude', 'internal_error')

    return [nonEmptyStringOrUndefined(this.config.llmSettings.model) ?? Defaults.llmSettings.claude.model]
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
