import {UnorderedList} from '@inkjs/ui'
import {Box, Text} from 'ink'
import {PropsWithChildren} from 'react'

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

interface ValueProps {
  isOptional?: boolean
  name: string
  value?: string
}

const Value = ({isOptional, name, value}: ValueProps) => (
  <UnorderedList.Item>
    <Box flexDirection="row">
      <Text color="yellow">{name}</Text>
      {isOptional && <Text color="grey"> (opt)</Text>}
      <Text>: {value}</Text>
    </Box>
  </UnorderedList.Item>
)

export const ConfigItem = {Section, Value}
