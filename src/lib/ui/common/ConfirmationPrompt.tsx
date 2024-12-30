import {ConfirmInput} from '@inkjs/ui'
import {Box, Text} from 'ink'

interface Props {
  onCancel: () => void
  onConfirm: () => void
  prompt: string
}

export const ConfirmationPrompt = ({onCancel, onConfirm, prompt}: Props) => {
  return (
    <Box flexDirection="row" paddingX={2}>
      <Text bold color="yellow">
        {prompt}?{' '}
      </Text>
      <ConfirmInput onCancel={onCancel} onConfirm={onConfirm} />
    </Box>
  )
}
