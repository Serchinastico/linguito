import {Reference} from '@/lib/ui/common/Reference.js'

type KeyReference = {description: string; key: string}

interface Props {
  mode: 'llm' | 'manual'
}

const llmAssistedKeys: KeyReference[] = [
  {description: 'Accept translation', key: 'ENTER'},
  {description: 'Move between translations', key: '↑ or ↓'},
  {description: 'Regenerate LLM suggestion', key: 'CTRL + R'},
  {description: 'Exit', key: 'ESC'},
]

const manualModeKeys: KeyReference[] = [
  {description: 'Accept translation', key: 'ENTER'},
  {description: 'Move between translations', key: '↑ or ↓'},
  {description: 'Exit', key: 'ESC'},
]

export const TranslateReference = ({mode}: Props) => {
  const keys = mode === 'manual' ? manualModeKeys : llmAssistedKeys

  return <Reference keys={keys} />
}
