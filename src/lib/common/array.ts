/**
 * Replaces an item at a specific index in an array with a new item and returns a new array
 * without mutating the original array.
 */
export const updatingItem = <T>(arr: readonly T[], index: number, item: T): T[] => [
  ...arr.slice(0, index),
  item,
  ...arr.slice(index + 1),
]
