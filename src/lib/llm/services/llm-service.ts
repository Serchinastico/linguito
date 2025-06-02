import {AnthropicProvider} from '@ai-sdk/anthropic'
import {OpenAIProvider} from '@ai-sdk/openai'
import {OpenAICompatibleProvider} from '@ai-sdk/openai-compatible'
import {LanguageModelV1} from 'ai'
import {OllamaProvider} from 'ollama-ai-provider'

import {invariant} from '@/lib/command/invariant.js'
import {Config} from '@/lib/common/types.js'

export type LlmProvider = AnthropicProvider | OllamaProvider | OpenAICompatibleProvider | OpenAIProvider

/**
 * Interface representing the base service for language model operations.
 * This class must be extended to define specific implementations for interacting
 * with language models.
 */
export abstract class LlmService {
  constructor(protected config: Config) {}

  async getModel(): Promise<LanguageModelV1> {
    const provider = await this.getProvider()
    const availableModelIds = await this.getAvailableModelIds()

    invariant(availableModelIds.length > 0, 'llm:no_models_found')

    const modelId = availableModelIds[0]
    return provider(modelId, {structuredOutputs: true})
  }

  protected abstract getAvailableModelIds(): Promise<string[]>

  protected abstract getProvider(): Promise<LlmProvider>
}
