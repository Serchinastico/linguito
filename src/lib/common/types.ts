import {OpenAIChatModelId} from '@ai-sdk/openai/internal'

export interface Config {
  llmSettings?: LocalLlmSettings | RemoteLlmSettings
  systemPrompt?: string
}

export type LlmProvider = NonNullable<Config['llmSettings']>['provider']

export type LocalLlmSettings = {
  provider: 'lmstudio' | 'ollama'
  url: string
}

export type RemoteLlmSettings = {
  apiKey: string
  model?: OpenAIChatModelId
  provider: 'openai'
}

export const emptyConfig: Config = {
  llmSettings: {
    provider: 'ollama',
    url: '',
  },
  systemPrompt: '',
}

export type ConfigKey = ConfigKeyPath extends (infer U)[] ? U : never

export type ConfigKeyPath = KeyPath<Config> | KeyPath<LocalLlmSettings> | KeyPath<RemoteLlmSettings>

export type FilledTranslation = MissingTranslation & {translation: string}

export type MissingTranslation = {
  file: string
  key: string
  locale: string
  reference: {filePath: string; line: number}
}

type KeyPath<T> = T extends object
  ? {
      [K in keyof T]-?: [K] | (T[K] extends object ? [K, ...KeyPath<T[K]>] : never)
    }[keyof T]
  : never
