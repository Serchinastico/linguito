import {ConfigKey, ConfigKeyPath} from '@/lib/common/types.js'
import {Select, TextInput} from '@inkjs/ui'
import {Box, Text} from 'ink'

import {getLabelForConfigKey} from './utils.js'

type Props = InputProps & SelectorProps

export const EditConfigInput = (props: Props) => {
  if (props.availableConfigKeys.length > 0) {
    return <ConfigKeySelector {...props} />
  } else {
    return <ConfigValueInput {...props} />
  }
}

interface SelectorProps {
  availableConfigKeys: ConfigKey[]
  onSelect: (key: ConfigKey) => void
  selectedConfigKeys: ConfigKeyPath
}

const ConfigKeySelector = ({availableConfigKeys, onSelect, selectedConfigKeys}: SelectorProps) => {
  const hasSelectedConfigKeys = selectedConfigKeys !== undefined && selectedConfigKeys.length > 0

  return (
    <Box flexDirection="column" paddingX={2}>
      <Box flexDirection="row">
        {hasSelectedConfigKeys && (
          <Box flexDirection="column">
            <Text color="gray">[{selectedConfigKeys.map(getLabelForConfigKey).join(' > ')}] </Text>
          </Box>
        )}
        <Text>Select the config key</Text>
      </Box>

      <Select
        highlightText="green"
        key={availableConfigKeys.join(':')}
        onChange={(value) => onSelect(value as ConfigKey)}
        options={availableConfigKeys.map((key) => ({label: getLabelForConfigKey(key), value: key}))}
      />
    </Box>
  )
}

interface InputProps {
  onSubmit: (keyPath: ConfigKeyPath, value: string) => void
  selectedConfigKeys: ConfigKeyPath
}

const ConfigValueInput = ({onSubmit, selectedConfigKeys}: InputProps) => {
  const preRoute = selectedConfigKeys?.slice(0, -1).map(getLabelForConfigKey).join(' > ')
  const lastItemInRoute = selectedConfigKeys?.slice(-1).map(getLabelForConfigKey)

  return (
    <Box flexDirection="row" paddingX={2}>
      <Text color="gray">
        [{preRoute} {'> '}
      </Text>
      <Text bold color="white">
        {lastItemInRoute}
      </Text>
      <Text color="gray">]? </Text>
      <TextInput
        onSubmit={(value) => {
          onSubmit(selectedConfigKeys, value)
        }}
      />
    </Box>
  )
}
