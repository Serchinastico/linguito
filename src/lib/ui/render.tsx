import {render as inkRender} from 'ink'
import {FunctionComponent} from 'react'

interface CommonProps<TData> {
  onFinish: (data: TData) => void
}

type ExtractOnFinishData<TProps> = TProps extends {onFinish: (data: infer TData) => void} ? TData : never

/**
 * Asynchronously renders a React Element on a Node.js stream using Ink and returns the final data upon completion.
 *
 * @template TProps The type of the props passed to the React Element. It must define an onFinish callback.
 *
 * @param Node - The React Element to be rendered. It must include an `onFinish` callback in its props to handle the data returned upon unmounting.
 * @param props - The props sent to the rendered element.
 * @param [options] - Optional configuration for the rendering process.
 *
 * @returns A promise that resolves to the data returned by the `onFinish` callback when rendering is complete.
 */
export const render = async <TProps extends CommonProps<never>>(
  Node: FunctionComponent<TProps>,
  props: Omit<TProps, 'onFinish'>,
  options?: Parameters<typeof inkRender>[1],
): Promise<ExtractOnFinishData<TProps>> => {
  let finishData: ExtractOnFinishData<TProps>

  const {unmount, waitUntilExit} = inkRender(
    <Node
      {...(props as TProps)}
      onFinish={(data) => {
        finishData = data
        unmount()
      }}
    />,
    {
      exitOnCtrlC: true,
      patchConsole: true,
      ...options,
    },
  )

  await waitUntilExit()

  return finishData!
}
