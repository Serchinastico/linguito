import {Reference} from '@/lib/ui/common/Reference.js'

type KeyReference = {description: string; key: string}

interface Props {
  mode: 'edit' | 'select'
}

const selectModeKeys: KeyReference[] = [
  {description: 'Select key', key: 'ENTER'},
  {description: 'Move', key: '↑ or ↓'},
  {description: 'Back', key: '← or DEL'},
  {description: 'Quit', key: 'q'},
]

const editModeKeys: KeyReference[] = [
  {description: 'Submit', key: 'ENTER'},
  {description: 'Cancel', key: 'ESC'},
]

export const ConfigReference = ({mode}: Props) => {
  const keys = mode === 'edit' ? editModeKeys : selectModeKeys

  return <Reference keys={keys} />
}
