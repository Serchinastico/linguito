import {Box, Text} from 'ink'

type KeyReference = {description: string; key: string}

interface Props {
  keys: KeyReference[]
}

export const Reference = ({keys}: Props) => {
  return (
    <Box
      borderColor="grey"
      borderStyle="round"
      flexDirection="row"
      flexWrap="wrap"
      justifyContent="center"
      paddingX={1}
      rowGap={1}
    >
      {keys
        .flatMap(({description, key}) => [
          <Box key={`${key}-box`}>
            <Text bold color="yellow">
              {key}
            </Text>
            <Text>: {description}</Text>
          </Box>,
          <Text color="gray" key={`${key}-text`}>
            {' '}
            |{' '}
          </Text>,
        ])
        .slice(0, -1)}
    </Box>
  )
}
