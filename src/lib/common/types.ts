export interface Config {
  llmSettings?: {
    provider: 'lmstudio'
    url: string
  }
  systemPrompt?: string
}

export const emptyConfig: Config = {
  llmSettings: {
    provider: 'lmstudio',
    url: '',
  },
  systemPrompt: '',
}

export type ConfigKey = NonNullable<ConfigKeyPath>[number]
export type ConfigKeyPath = KeyPath<Config>

export type FilledTranslation = MissingTranslation & {translation: string}

export type MissingTranslation = {
  file: string
  key: string
  locale: string
  reference: {filePath: string; line: number}
}

type KeyPath<T> = T extends object
  ? {
      [K in keyof T]: [K, ...KeyPath<T[K]>]
    }[keyof T]
  : []
