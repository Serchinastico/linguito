import {invariant} from '../command/invariant.js'
import {Config, ConfigKey, ConfigKeyPath} from '../common/types.js'

/**
 * Retrieves the value from a configuration object at the specified key path.
 *
 * This function navigates through the nested structure of a configuration object
 * using the provided array of keys. It returns the value located at the end of
 * the key path or undefined if the key path cannot be fully resolved.
 *
 * @param config - The configuration object to retrieve the value from.
 * @param keys - An array of keys representing the path to the desired value in the configuration object.
 * @returns The value located at the specified key path within the configuration object, or undefined if the key path
 *          does not exist.
 */
export const getConfigValue = (config: Config, keys: ConfigKeyPath): string | undefined => {
  // @ts-expect-error error
  return keys?.reduce((acc, key) => acc && acc[key], config)
}

/**
 * Updates a nested value in a configuration object.
 *
 * @param config - The configuration object to update.
 * @param keys - An array of keys representing the path to the nested property.
 * @param value - The new value to set at the specified path.
 * @returns A new configuration object with the updated value.
 * @throws Throws an error if the keys array is empty.
 */
export const setConfigValue = (config: Config, keys: ConfigKeyPath, value: unknown): Config => {
  invariant(!!keys, 'internal_error')

  const updatedConfig = {...config}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = updatedConfig

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = value
    } else {
      if (typeof current[key] !== 'object' || current[key] === null) {
        current[key] = {}
      }

      current = current[key]
    }
  })

  return updatedConfig
}

/**
 * Retrieves the available configuration keys at a specific key path within a configuration object.
 *
 * @param config - The configuration object to query.
 * @param keyPath - The key path in the configuration object from which to retrieve keys. If undefined,
 *                  the top-level keys of the configuration object are returned.
 * @returns An array of configuration keys available at the specified key path.
 *          Returns an empty array if the value at the specified key path is a string,
 *          or if the key path is undefined, returns all top-level keys in the configuration object.
 */
export const getAvailableConfigKeys = (config: Config, keyPath: ConfigKeyPath): ConfigKey[] => {
  if (keyPath === undefined) return Object.keys(config) as ConfigKey[]

  const value = getConfigValue(config, keyPath) ?? {}

  if (typeof value === 'string') return []
  else return Object.keys(value) as ConfigKey[]
}

export const extractKeyPaths = (obj: Config | Record<string, object>, parentKey = ''): string[] => {
  let paths: string[] = []

  const entries = Object.entries(obj)
  for (const [key, value] of entries) {
    const currentKeyPath = parentKey ? `${parentKey}.${key}` : key

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      paths = paths.concat(extractKeyPaths(value as Record<string, object>, currentKeyPath))
    } else {
      paths.push(currentKeyPath)
    }
  }

  return paths
}
