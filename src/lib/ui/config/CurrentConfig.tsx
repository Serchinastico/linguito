import {UnorderedList} from '@inkjs/ui'
import {Box, Text} from 'ink'

import {Config, ConfigKey} from '../../common/types.js'
import {getLabelForConfigKey} from './utils.js'

interface Props {
  config: Config
}

export const CurrentConfig = ({config}: Props) => {
  return (
    <Box borderColor="grey" borderStyle="round" flexDirection="column" gap={1} paddingX={2}>
      <Text underline>Current configuration</Text>

      {toUnorderedList(config)}
    </Box>
  )
}

/**
 * Converts a given node (object, string, or null/undefined) into an Ink's unordered list.
 *
 * This function is recursive and processes the input and returns either a text node, a mapped list of items,
 * or null if the input is null or undefined.
 * - If the node is a string, it returns a text element containing the string value.
 * - If the node is an object, it recursively maps its entries into list items, preserving hierarchy as needed.
 * - If the node is null or undefined, it returns null.
 *
 * @param node - The node to be converted, which may be a string, an object, or null/undefined.
 * @returns The processed result, either null, a JSX element for a single string, or an array of JSX elements for an
 *          object structure.
 */
const toUnorderedList = (node: null | object | string | undefined) => {
  if (node === null || node === undefined) return null

  if (typeof node === 'string') {
    return <Text>{node}</Text>
  }

  return Object.entries(node).map(([key, value]) => (
    <UnorderedList.Item key={key}>
      <Box flexDirection={typeof value === 'string' ? 'row' : 'column'}>
        <Text color="yellow">{getLabelForConfigKey(key as ConfigKey)}</Text>

        {typeof value === 'string' ? <Text>: {value}</Text> : toUnorderedList(value)}
      </Box>
    </UnorderedList.Item>
  ))
}
