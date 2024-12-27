import {ConfigKey} from '../../common/types.js'

export const getLabelForConfigKey = (key: ConfigKey) => {
  switch (key) {
    case 'llmSettings':
      return 'LLM Settings'
    case 'provider':
      return 'Provider'
    case 'systemPrompt':
      return 'System Prompt'
    case 'url':
      return 'URL'
  }
}
