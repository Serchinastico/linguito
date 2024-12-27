import {ProgressBar, TextInput} from '@inkjs/ui'
import {Box, Text} from 'ink'
import fs from 'node:fs'
import {useEffect, useMemo, useState} from 'react'

import {FilledTranslation, MissingTranslation} from '../../common/types.js'
import {Theme} from '../Theme.js'

const CODE_CONTEXT_LINES = 5

type Context = {
  currentLine: string
  nextLines: string[]
  previousLines: string[]
}

const getContext = (reference: MissingTranslation['reference']): Context => {
  const fileContents = fs.readFileSync(reference.filePath, 'utf-8')

  const lines = fileContents.split('\n')
  const lineNumber = reference.line
  const start = Math.max(0, lineNumber - CODE_CONTEXT_LINES - 1)
  const end = Math.min(lines.length, lineNumber + CODE_CONTEXT_LINES)
  const previousLines = lines.slice(start, lineNumber - 1)
  const nextLines = lines.slice(lineNumber, end)

  return {currentLine: lines[lineNumber - 1], nextLines, previousLines}
}

export interface Props {
  missingTranslations: MissingTranslation[]
  onFinish: (translations: FilledTranslation[]) => void
}

export const AskForTranslations = ({missingTranslations, onFinish}: Props) => {
  const [translationIndex, setTranslationIndex] = useState(0)
  const [translations, setTranslations] = useState<FilledTranslation[]>([])

  const currentTranslation = useMemo(() => missingTranslations[translationIndex], [translationIndex])
  const context = useMemo(() => {
    if (!currentTranslation) return {currentLine: '', nextLines: [], previousLines: []}

    return getContext(currentTranslation.reference)
  }, [currentTranslation])

  useEffect(() => {
    if (translations.length < missingTranslations.length) return

    onFinish(translations)
  }, [translations])

  if (!currentTranslation) return null

  return (
    <Theme>
      <Box flexDirection="column" minWidth={80} width={120}>
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

        <Box flexDirection="column" paddingX={3}>
          <Text color="grey">{context.previousLines.join('\n')}</Text>
          <Text color="green">{context.currentLine}</Text>
          <Text color="grey">{context.nextLines.join('\n')}</Text>
        </Box>

        <Box borderColor="grey" borderStyle="single" flexDirection="row" marginTop={2} paddingX={2}>
          <Box flexDirection="column">
            <Text color="blueBright">Key: </Text>
            <Text bold color="blueBright">
              Translation (<Text color="gray">{currentTranslation.locale}</Text>)?{' '}
            </Text>
          </Box>

          <Box flexDirection="column">
            <Text>{currentTranslation.key}</Text>
            <TextInput
              onSubmit={(value) => {
                setTranslations((translations) => [...translations, {translation: value, ...currentTranslation}])
                setTranslationIndex((index) => index + 1)
              }}
            />
          </Box>
        </Box>
      </Box>
    </Theme>
  )
}
