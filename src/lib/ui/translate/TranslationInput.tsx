import {TextInput} from '@inkjs/ui'
import {Box, Text} from 'ink'

interface Props {
  locale: string
  onSubmit: (translation: string) => void
  translationKey: string
}

export const TranslationInput = ({locale, onSubmit, translationKey}: Props) => {
  return (
    <Box borderColor="grey" borderStyle="single" flexDirection="column" marginTop={2} paddingX={2}>
      <Box flexDirection="row">
        <Box minWidth={20}>
          <Text color="blueBright">Key: </Text>
        </Box>

        <Text>{translationKey}</Text>
      </Box>

      <Box flexDirection="row">
        <Box minWidth={20}>
          <Text bold color="blueBright">
            Translation (<Text color="gray">{locale}</Text>)?{' '}
          </Text>
        </Box>

        <TextInput onSubmit={onSubmit} />
      </Box>
    </Box>
  )
}
