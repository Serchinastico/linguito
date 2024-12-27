import {Box, Text} from 'ink'

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

export const Reference = ({mode}: Props) => {
  const keys = mode === 'edit' ? editModeKeys : selectModeKeys

  return (
    <Box borderColor="grey" borderStyle="round" flexDirection="row" gap={1} justifyContent="center" paddingX={1}>
      {keys
        .flatMap(({description, key}) => [
          <Box key={key}>
            <Text bold color="yellow">
              {key}
            </Text>
            <Text>: {description}</Text>
          </Box>,
          <Text color="gray"> | </Text>,
        ])
        .slice(0, -1)}
    </Box>
  )
}
