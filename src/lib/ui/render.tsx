import {render as inkRender, RenderOptions} from 'ink'
import {FunctionComponent} from 'react'

interface CommonProps<TData> {
  onFinish: (data: TData) => void
}

/**
 * Asynchronously renders a React Element on a Node.js stream using Ink and returns the final data upon completion.
 *
 * @template TData The type of the data returned when the rendering finishes.
 * @template TProps The type of the props passed to the React Element.
 *
 * @param {ReactElement<TProps>} Node - The React Element to be rendered. It must include an `onFinish` callback in its props to handle the data returned upon unmounting.
 * @param {TProps} props - The props sent to the rendered element.
 * @param {NodeJS.WriteStream | RenderOptions} [options] - Optional configuration for the rendering process.
 *
 * @returns {Promise<TData>} A promise that resolves to the data returned by the `onFinish` callback when rendering is complete.
 */
export const render = async <TData, TProps extends CommonProps<TData>>(
  Node: FunctionComponent<TProps>,
  props: Omit<TProps, 'onFinish'>,
  options?: NodeJS.WriteStream | RenderOptions,
): Promise<TData> => {
  let finishData: TData | undefined = undefined

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
      ...options,
    },
  )

  await waitUntilExit()

  return finishData!
}
