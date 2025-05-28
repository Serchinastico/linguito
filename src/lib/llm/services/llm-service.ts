import {AnthropicProvider} from '@ai-sdk/anthropic'
import {OpenAIProvider} from '@ai-sdk/openai'
import {OpenAICompatibleProvider} from '@ai-sdk/openai-compatible'
import {OllamaProvider} from 'ollama-ai-provider'

export type LlmProvider = AnthropicProvider | OllamaProvider | OpenAICompatibleProvider | OpenAIProvider

/**
 * Interface representing the base service for language model operations.
 * This class must be extended to define specific implementations for interacting
 * with language models.
 */
export interface LlmService {
  getAvailableModelIds(): Promise<string[]>
  getProvider(): Promise<LlmProvider>
}
