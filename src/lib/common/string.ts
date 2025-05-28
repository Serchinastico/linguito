/**
 * A function that checks if the provided string is non-empty and returns the trimmed string.
 * If the string is empty or undefined, it returns undefined.
 */
export const nonEmptyStringOrUndefined = (str?: string): string | undefined =>
  str && str.trim().length > 0 ? str : undefined
