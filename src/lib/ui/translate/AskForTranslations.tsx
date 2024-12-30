import {CodeContext} from '@/lib/ui/translate/CodeContext.js'
import {TranslateReference} from '@/lib/ui/translate/TranslateReference.js'
import {TranslationInput} from '@/lib/ui/translate/TranslationInput.js'
import {ProgressBar} from '@inkjs/ui'
import {Box, Text, useInput} from 'ink'
import {useEffect, useMemo, useState} from 'react'

import {FilledTranslation, MissingTranslation} from '../../common/types.js'
import {Theme} from '../Theme.js'

export interface Props {
  isLlmAssisted: boolean
  missingTranslations: MissingTranslation[]
  onFinish: (translations: FilledTranslation[]) => void
}

export const AskForTranslations = ({isLlmAssisted, missingTranslations, onFinish}: Props) => {
  const [translationIndex, setTranslationIndex] = useState(0)
  const [translations, setTranslations] = useState<FilledTranslation[]>([])
  const [suggestedTranslation, setSuggestedTranslation] = useState<string | undefined>(undefined)
  const [isExiting, setIsExiting] = useState(false)

  const currentTranslation = useMemo(() => missingTranslations[translationIndex], [translationIndex])

  useEffect(() => {
    if (translations.length < missingTranslations.length) return

    onFinish(translations)
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
      // Regenerate LLM suggestion
    }
  })

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

        <CodeContext reference={currentTranslation?.reference} />

        <TranslateReference mode={isLlmAssisted ? 'llm' : 'manual'} />

        <TranslationInput
          locale={currentTranslation.locale}
          onSubmit={(value) => {
            setTranslations((translations) => [...translations, {translation: value, ...currentTranslation}])
            setTranslationIndex((index) => index + 1)
          }}
          translationKey={currentTranslation.key}
        />
      </Box>
    </Theme>
  )
}
