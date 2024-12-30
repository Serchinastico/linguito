import {Llm} from '@/lib/llm/llm.js'
import useArray from '@/lib/ui/hooks/useArray.js'
import {CodeContext} from '@/lib/ui/translate/CodeContext.js'
import {TranslateReference} from '@/lib/ui/translate/TranslateReference.js'
import {TranslationInput} from '@/lib/ui/translate/TranslationInput.js'
import {ConfirmInput, ProgressBar} from '@inkjs/ui'
import {Box, Text, useInput} from 'ink'
import {useCallback, useEffect, useMemo, useState} from 'react'

import {FilledTranslation, MissingTranslation} from '../../common/types.js'
import {Theme} from '../Theme.js'

export interface Props {
  isLlmAssisted: boolean
  missingTranslations: MissingTranslation[]
  onFinish: (translations: FilledTranslation[]) => void
}

type SuggestedTranslation = (FilledTranslation & {loading: false}) | {loading: true}

export const AskForTranslations = ({isLlmAssisted, missingTranslations, onFinish}: Props) => {
  const [translationIndex, setTranslationIndex] = useState(0)
  const [translations, setTranslations] = useState<FilledTranslation[]>([])
  const {array: suggestedTranslations, update: updateSuggestedTranslation} = useArray<SuggestedTranslation>(
    missingTranslations.map(() => ({loading: true})),
  )
  const [isExiting, setIsExiting] = useState(false)
  const llm = useMemo(() => new Llm(), [])

  const currentTranslation = useMemo(() => missingTranslations[translationIndex], [translationIndex])

  const generateSuggestedTranslations = useCallback(async () => {
    missingTranslations.forEach((missingTranslation, index) => {
      llm.translateOne(missingTranslation).then((translation) => {
        updateSuggestedTranslation(index, {...translation, loading: false})
      })
    })
  }, [llm, updateSuggestedTranslation])

  const regenerateCurrentSuggestedTranslation = useCallback(async () => {
    updateSuggestedTranslation(translationIndex, {loading: true})

    const missingTranslation = missingTranslations[translationIndex]
    const translation = await llm.translateOne(missingTranslation)
    updateSuggestedTranslation(translationIndex, {...translation, loading: false})
  }, [llm, translationIndex, updateSuggestedTranslation])

  useEffect(() => {
    generateSuggestedTranslations().then()
  }, [generateSuggestedTranslations])

  useEffect(() => {
    if (translations.length < missingTranslations.length) return

    setIsExiting(true)
  }, [translations])

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
      regenerateCurrentSuggestedTranslation().then()
    }
  })

  if (!currentTranslation) return null

  const llmSuggestedTranslation = suggestedTranslations[translationIndex].loading
    ? undefined
    : suggestedTranslations[translationIndex].translation

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
            <ProgressBar value={(translationIndex / missingTranslations.length) * 100} />
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
          <Box flexDirection="row" paddingX={2}>
            <Text bold color="yellow">
              Save translations?{' '}
            </Text>
            <ConfirmInput onCancel={() => onFinish([])} onConfirm={() => onFinish(translations)} />
          </Box>
        ) : (
          <>
            <CodeContext reference={currentTranslation?.reference} />
            <TranslateReference mode={isLlmAssisted ? 'llm' : 'manual'} />
            <TranslationInput
              isLlmAssisted={isLlmAssisted}
              locale={currentTranslation.locale}
              onSubmit={(value) => {
                setTranslations((translations) => [...translations, {translation: value, ...currentTranslation}])
                setTranslationIndex((index) => index + 1)
              }}
              suggestedTranslation={llmSuggestedTranslation}
              translationKey={currentTranslation.key}
            />
          </>
        )}
      </Box>
    </Theme>
  )
}
