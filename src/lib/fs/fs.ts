import {constants} from 'fs'
import {access, stat} from 'fs/promises'

/**
 * Determines whether a file at the given path is readable.
 *
 * @param filePath - The path to the file to check.
 * @return A promise that resolves to `true` if the file is readable, otherwise `false`.
 */
export const canReadFile = async (filePath: string): Promise<boolean> => {
  try {
    await access(filePath, constants.R_OK)
    return true
  } catch {
    return false
  }
}

/**
 * Determines whether a file at the given path is readable.
 *
 * @param filePath - The path to the file to check.
 * @return A promise that resolves to `true` if the file is readable, otherwise `false`.
 */
export const isFile = async (filePath: string): Promise<boolean> => {
  try {
    const stats = await stat(filePath)
    return stats.isFile()
  } catch {
    return false
  }
}
