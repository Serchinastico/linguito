/**
 * A function that checks if the provided string is non-empty and returns the trimmed string.
 * If the string is empty or undefined, it returns undefined.
 */
export const nonEmptyStringOrUndefined = (str?: string): string | undefined =>
  str && str.trim().length > 0 ? str : undefined

/**
 * Truncates a given string and appends an ellipsis ('...') if the string exceeds a specified maximum length.
 */
export const ellipsize = (text: string, options: {maxLength?: number} = {}): string => {
  const {maxLength = 200} = options

  if (!text || text.length <= maxLength) return text

  const ellipsis = '...'
  return text.slice(0, maxLength - ellipsis.length) + ellipsis
}
