import {OpenAICompatibleProvider} from '@ai-sdk/openai-compatible'
import {OllamaProvider} from 'ollama-ai-provider'

export type LlmProvider = OllamaProvider | OpenAICompatibleProvider

/**
 * Abstract class representing the base service for language model operations.
 * This class must be extended to define specific implementations for interacting
 * with language models.
 */
export abstract class LlmService {
  abstract getAvailableModelIds(): Promise<string[]>
  abstract getProvider(): Promise<LlmProvider>
}
