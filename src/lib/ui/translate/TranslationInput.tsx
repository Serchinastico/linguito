import {TextInput} from '@inkjs/ui'
import {Box, Text} from 'ink'
import {useMemo} from 'react'

interface Props {
  acceptedTranslation?: string
  isLlmAssisted: boolean
  locale: string
  onSubmit: (translation: string) => void
  suggestedTranslation?: string
  translationKey: string
}

export const TranslationInput = ({
  acceptedTranslation,
  isLlmAssisted,
  locale,
  onSubmit,
  suggestedTranslation,
  translationKey,
}: Props) => {
  const inputValue = useMemo(() => {
    if (acceptedTranslation) {
      return acceptedTranslation
    }
    if (isLlmAssisted && suggestedTranslation) {
      return suggestedTranslation
    }

    return undefined
  }, [acceptedTranslation, isLlmAssisted, suggestedTranslation])

  return (
    <Box borderColor="grey" borderStyle="single" flexDirection="column" paddingX={2}>
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
          defaultValue={inputValue}
          isDisabled={isLlmAssisted && suggestedTranslation === undefined}
          key={`${translationKey} - ${suggestedTranslation}`}
          onSubmit={onSubmit}
          placeholder={isLlmAssisted && !suggestedTranslation ? 'Loading...' : undefined}
        />
      </Box>
    </Box>
  )
}
