import {ConfigKey} from '@/lib/common/types.js'

export const getLabelForConfigKey = (key: ConfigKey): string => {
  switch (key) {
    case 'apiKey':
      return 'API Key'
    case 'llmSettings':
      return 'LLM Settings'
    case 'model':
      return 'Model'
    case 'provider':
      return 'Provider'
    case 'systemPrompt':
      return 'System Prompt'
    case 'url':
      return 'URL'
  }
}
