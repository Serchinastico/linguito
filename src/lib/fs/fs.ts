import {constants} from 'fs'
import {access} from 'fs/promises'

/**
 * Determines whether a file at the given path is readable.
 *
 * @param {string} filePath - The path to the file to check.
 * @return {Promise<boolean>} A promise that resolves to `true` if the file is readable, otherwise `false`.
 */
export async function canReadFile(filePath: string): Promise<boolean> {
  try {
    await access(filePath, constants.R_OK)
    return true
  } catch {
    return false
  }
}
