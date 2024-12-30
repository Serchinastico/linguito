import {ConfirmationPrompt} from '@/lib/ui/common/ConfirmationPrompt.js'
import useArray from '@/lib/ui/hooks/useArray.js'
import {CodeContext} from '@/lib/ui/translate/CodeContext.js'
import {TranslateReference} from '@/lib/ui/translate/TranslateReference.js'
import {TranslationInput} from '@/lib/ui/translate/TranslationInput.js'
import {useLlmSuggestions} from '@/lib/ui/translate/useLlmSuggestions.js'
import {ProgressBar} from '@inkjs/ui'
import {Box, Text, useInput} from 'ink'
import {useCallback, useMemo, useState} from 'react'

import {FilledTranslation, MissingTranslation} from '../../common/types.js'
import {Theme} from '../Theme.js'

export interface Props {
  isLlmAssisted: boolean
  missingTranslations: MissingTranslation[]
  onFinish: (translations: FilledTranslation[]) => void
}

type AcceptedTranslation = {isAccepted: boolean; translation: string}

export const AskForTranslations = ({isLlmAssisted, missingTranslations, onFinish}: Props) => {
  const [translationIndex, setTranslationIndex] = useState(0)
  const {array: translations, update: updateTranslation} = useArray<AcceptedTranslation>(
    missingTranslations.map(() => ({isAccepted: false, translation: ''})),
  )
  const [isExiting, setIsExiting] = useState(false)
  const numberOfAcceptedTranslations = useMemo(() => translations.filter((t) => t.isAccepted).length, [translations])
  const currentTranslation = useMemo(() => missingTranslations[translationIndex], [translationIndex])
  const {regenerateSuggestedTranslation, suggestedTranslations} = useLlmSuggestions({
    isLlmAssisted,
    missingTranslations,
  })

  const onExit = useCallback(() => {
    onFinish(
      translations.map((translation, index) => ({
        ...missingTranslations[index],
        translation: translation.isAccepted ? translation.translation : '',
      })),
    )
  }, [onFinish, missingTranslations, translations])

  const onSubmit = useCallback(
    (value: string) => {
      updateTranslation(translationIndex, {isAccepted: true, translation: value})
      const firstPendingTranslationIndex = translations.findIndex(
        (t, index) => translationIndex !== index && !t.isAccepted,
      )

      if (firstPendingTranslationIndex === -1) {
        onExit()
      } else {
        setTranslationIndex(firstPendingTranslationIndex)
      }
    },
    [translationIndex, translations, updateTranslation],
  )

  useInput((input, key) => {
    if (key.escape) {
      setIsExiting(true)
    }

    if (key.upArrow) {
      setTranslationIndex((index) => Math.max(0, index - 1))
    }

    if (key.downArrow) {
      setTranslationIndex((index) => Math.min(missingTranslations.length - 1, index + 1))
    }

    if (isLlmAssisted && key.ctrl && input === 'r') {
      regenerateSuggestedTranslation(translationIndex).then()
    }
  })

  const llmSuggestedTranslation = useMemo(
    () =>
      suggestedTranslations[translationIndex].isLoading
        ? undefined
        : suggestedTranslations[translationIndex].translation,
    [suggestedTranslations, translationIndex],
  )
  const acceptedTranslation = useMemo(() => {
    const {translation} = translations[translationIndex]
    return translation
  }, [translations, translationIndex])

  if (!currentTranslation) return null

  return (
    <Theme>
      <Box flexDirection="column">
        <Box
          alignItems="center"
          borderColor="green"
          borderStyle="double"
          flexDirection="column"
          justifyContent="center"
          paddingX={2}
        >
          <Text bold underline>
            Linguito translation tool
          </Text>
          <Text>
            Translation {translationIndex + 1} of {missingTranslations.length}
          </Text>
          <Box width="30%">
            <ProgressBar value={(numberOfAcceptedTranslations / missingTranslations.length) * 100} />
          </Box>
        </Box>

        <Box flexDirection="row" paddingX={2}>
          <Text color="yellow" underline>
            File:{' '}
          </Text>
          <Text underline>
            {currentTranslation.reference.filePath}
            {'\n'}
          </Text>
        </Box>

        {isExiting ? (
          <ConfirmationPrompt
            onCancel={() => onFinish([])}
            onConfirm={onExit}
            prompt={`Save accepted translations (${numberOfAcceptedTranslations} accepted out of ${translations.length} translations)`}
          />
        ) : (
          <>
            <CodeContext reference={currentTranslation?.reference} />
            <TranslateReference mode={isLlmAssisted ? 'llm' : 'manual'} />
            <TranslationInput
              acceptedTranslation={acceptedTranslation}
              isLlmAssisted={isLlmAssisted}
              locale={currentTranslation.locale}
              onSubmit={onSubmit}
              suggestedTranslation={llmSuggestedTranslation}
              translationKey={currentTranslation.key}
            />
          </>
        )}
      </Box>
    </Theme>
  )
}
