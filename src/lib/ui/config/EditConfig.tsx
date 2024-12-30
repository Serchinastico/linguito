import {ConfirmationPrompt} from '@/lib/ui/common/ConfirmationPrompt.js'
import {Box, Text, useInput} from 'ink'
import {useMemo, useState} from 'react'
import {merge} from 'ts-deepmerge'

import {Config, ConfigKey, ConfigKeyPath, emptyConfig} from '../../common/types.js'
import {getAvailableConfigKeys, setConfigValue} from '../../config/config.js'
import {Theme} from '../Theme.js'
import {ConfigReference} from './ConfigReference.js'
import {CurrentConfig} from './CurrentConfig.js'
import {EditConfigInput} from './EditConfigInput.js'

export interface Props {
  config: Config
  onFinish: (config: Config) => void
}

export const EditConfig = ({config: currentConfig, onFinish}: Props) => {
  const [config, setConfig] = useState<Config>(merge(emptyConfig, currentConfig))
  const [selectedConfigKeys, setSelectedConfigKeys] = useState<ConfigKeyPath>(undefined)
  const availableConfigKeys = useMemo<ConfigKey[]>(
    () => getAvailableConfigKeys(config, selectedConfigKeys),
    [config, selectedConfigKeys],
  )
  const [isExiting, setIsExiting] = useState(false)
  const mode = useMemo(() => (availableConfigKeys.length > 0 ? 'select' : 'edit'), [availableConfigKeys])

  useInput((input, key) => {
    if (input === 'q') {
      setIsExiting(true)
    }

    if (mode === 'select' && (key.leftArrow || key.delete)) {
      setSelectedConfigKeys((keys) => keys?.slice(0, -1) as ConfigKeyPath)
    }
    if (mode === 'edit' && key.escape) {
      setSelectedConfigKeys(undefined)
    }
  })

  return (
    <Theme>
      <Box flexDirection="column">
        <Box
          alignItems="center"
          borderColor="yellow"
          borderStyle="bold"
          flexDirection="column"
          justifyContent="center"
          paddingX={2}
        >
          <Text bold underline>
            Linguito translation tool - Configuration
          </Text>
        </Box>

        <CurrentConfig config={config} />
        <ConfigReference mode={availableConfigKeys.length === 0 ? 'edit' : 'select'} />

        {isExiting ? (
          <ConfirmationPrompt
            onCancel={() => onFinish(currentConfig)}
            onConfirm={() => onFinish(config)}
            prompt="Save config"
          />
        ) : (
          <EditConfigInput
            availableConfigKeys={availableConfigKeys}
            onSelect={(key) => setSelectedConfigKeys((keys) => [...(keys ?? []), key] as ConfigKeyPath)}
            onSubmit={(selectedKeys, value) => {
              setConfig((config) => setConfigValue(config, selectedKeys, value) as Config)
              setSelectedConfigKeys(undefined)
            }}
            selectedConfigKeys={selectedConfigKeys}
          />
        )}
      </Box>
    </Theme>
  )
}
