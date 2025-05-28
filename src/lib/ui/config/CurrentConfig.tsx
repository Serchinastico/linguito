import {Box, Text} from 'ink'
import {ReactElement} from 'react'

import {Defaults, getDefaultLlmSetting} from '@/lib/llm/defaults.js'
import {ConfigItem} from '@/lib/ui/config/ConfigItem.js'

import {Config} from '../../common/types.js'

interface Props {
  config: Config
}

export const CurrentConfig = ({config}: Props) => {
  return (
    <Box borderColor="grey" borderStyle="round" flexDirection="column" gap={1} paddingX={2}>
      <Text underline>Current configuration</Text>

      <ConfigItem.Section name={'LLM Settings'}>
        <ConfigItem.Value name="Provider" value={config.llmSettings?.provider} />
        <LlmConfigValues llmSettings={config.llmSettings} />
      </ConfigItem.Section>

      <ConfigItem.Value
        defaultValue={Defaults.systemPrompt}
        isOptional
        name={'System Prompt'}
        value={config.systemPrompt}
      />
    </Box>
  )
}

interface LlmConfigValuesProps {
  llmSettings: Config['llmSettings']
}

const LlmConfigValues = ({llmSettings}: LlmConfigValuesProps): ReactElement => {
  switch (llmSettings?.provider) {
    case 'claude':
    case 'openai':
      return (
        <>
          <ConfigItem.Value name="API Key" value={llmSettings?.apiKey} />
          <ConfigItem.Value
            defaultValue={getDefaultLlmSetting({key: 'model', provider: llmSettings.provider})}
            isOptional
            name="Model"
            value={llmSettings?.model}
          />
        </>
      )
    case 'lmstudio':
    case 'ollama':
      return (
        <>
          <ConfigItem.Value
            defaultValue={getDefaultLlmSetting({key: 'url', provider: llmSettings.provider})}
            isOptional
            name="URL"
            value={llmSettings?.url}
          />
          <ConfigItem.Value
            defaultValue={getDefaultLlmSetting({key: 'model', provider: llmSettings.provider})}
            isOptional
            name="Model"
            value={llmSettings?.model}
          />
        </>
      )
    case undefined:
      return <></>
  }
}
