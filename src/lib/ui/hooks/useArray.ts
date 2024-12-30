import {useCallback, useState} from 'react'

/**
 * A custom hook that provides utility functions for managing an array state.
 *
 * Based on {@link https://medium.com/@sergeyleschev/react-custom-hook-usearray-afab82e7aae4}
 * @param [defaultValue=[]] - The initial value of the array.
 * @return An object containing the array state and methods to manipulate it:
 * - `array` (TItem[]): The current state of the array.
 * - `clear`: A function to clear all items from the array.
 * - `filter`: A function to filter items in the array based on a callback function.
 * - `push`: A function to add a new element to the end of the array.
 * - `remove`: A function to remove an element at a specified index from the array.
 * - `set`: A function to directly set a new array state.
 * - `update`: A function to replace an element at a specified index with a new element.
 */
export default function useArray<TItem>(defaultValue: TItem[] = []) {
  const [array, setArray] = useState(defaultValue)

  const push = useCallback((element: TItem) => {
    setArray((a) => [...a, element])
  }, [])

  const filter = useCallback((predicate: (item: TItem) => boolean) => {
    setArray((a) => a.filter(predicate))
  }, [])

  const update = useCallback((index: number, newElement: TItem) => {
    setArray((a) => [...a.slice(0, index), newElement, ...a.slice(index + 1, a.length)])
  }, [])

  const remove = useCallback((index: number) => {
    setArray((a) => [...a.slice(0, index), ...a.slice(index + 1, a.length)])
  }, [])

  const clear = useCallback(() => {
    setArray([])
  }, [])

  return {array, clear, filter, push, remove, set: setArray, update}
}
