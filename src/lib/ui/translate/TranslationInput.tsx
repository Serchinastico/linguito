import {TextInput} from '@inkjs/ui'
import {Box, Text} from 'ink'

interface Props {
  isLlmAssisted: boolean
  locale: string
  onSubmit: (translation: string) => void
  suggestedTranslation?: string
  translationKey: string
}

export const TranslationInput = ({isLlmAssisted, locale, onSubmit, suggestedTranslation, translationKey}: Props) => {
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

        <TextInput
          defaultValue={isLlmAssisted && suggestedTranslation ? suggestedTranslation : undefined}
          isDisabled={isLlmAssisted && suggestedTranslation === undefined}
          key={suggestedTranslation}
          onSubmit={onSubmit}
          placeholder={isLlmAssisted ? (suggestedTranslation ?? 'Loading...') : undefined}
          suggestions={isLlmAssisted && suggestedTranslation ? [suggestedTranslation] : []}
        />
      </Box>
    </Box>
  )
}
