import {MissingTranslation} from '@/lib/common/types.js'
import {Box, Text} from 'ink'
import fs from 'node:fs'
import {useMemo} from 'react'

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

interface Props {
  reference?: MissingTranslation['reference']
}

export const CodeContext = ({reference}: Props) => {
  const context = useMemo(() => {
    if (!reference) return {currentLine: '', nextLines: [], previousLines: []}

    return getContext(reference)
  }, [reference])

  return (
    <Box flexDirection="column" paddingX={3}>
      <Text color="grey">{context.previousLines.join('\n')}</Text>
      <Text color="green">{context.currentLine}</Text>
      <Text color="grey">{context.nextLines.join('\n')}</Text>
    </Box>
  )
}
