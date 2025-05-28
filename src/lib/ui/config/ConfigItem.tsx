import {UnorderedList} from '@inkjs/ui'
import {Box, Text} from 'ink'
import {PropsWithChildren} from 'react'

import {ellipsize} from '@/lib/common/string.js'

interface SectionProps extends PropsWithChildren {
  name: string
}

const Section = ({children, name}: SectionProps) => (
  <UnorderedList.Item>
    <Box flexDirection="column">
      <Text color="yellow">{name}</Text>

      {children}
    </Box>
  </UnorderedList.Item>
)

type OptionalityProps = {defaultValue: string; isOptional: true} | {isOptional?: false}

type ValueProps = OptionalityProps & {
  name: string
  value?: string
}

const Value = ({name, value, ...props}: ValueProps) => (
  <UnorderedList.Item>
    <Box flexDirection="row">
      <Text color="yellow">{name}</Text>
      <Text>: {value ? value : props.isOptional ? <Text color="grey">{ellipsize(props.defaultValue)}</Text> : ''}</Text>
    </Box>
  </UnorderedList.Item>
)

export const ConfigItem = {Section, Value}
