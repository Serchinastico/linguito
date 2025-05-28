import Configstore from 'configstore'
import fs from 'node:fs'

import {invariant} from '@/lib/command/invariant.js'
import {Config, ConfigKey, ConfigKeyPath, emptyConfig} from '@/lib/common/types.js'

export class ConfigManager {
  config: Config
  private store: Configstore

  constructor() {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
    this.store = new Configstore(packageJson.name, emptyConfig)
    this.config = this.store.all
  }

  static getAllKeyPaths(obj: Config | Record<string, object> = emptyConfig, parentKey = ''): string[] {
    let paths: string[] = []

    const entries = Object.entries(obj)
    for (const [key, value] of entries) {
      const currentKeyPath = parentKey ? `${parentKey}.${key}` : key

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        paths = paths.concat(this.getAllKeyPaths(value as Record<string, object>, currentKeyPath))
      } else {
        paths.push(currentKeyPath)
      }
    }

    return paths
  }

  get(keyPath: ConfigKeyPath): string | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return keyPath?.reduce((acc, key) => acc && acc[key], this.config as any)
  }

  getAvailableKeyPaths(keyPath?: ConfigKeyPath): ConfigKey[] {
    if (keyPath === undefined) return Object.keys(this.config) as ConfigKey[]

    const lastKey = keyPath[keyPath.length - 1]
    switch (lastKey) {
      case 'llmSettings':
        switch (this.config.llmSettings?.provider) {
          case 'lmstudio':
          case 'ollama':
            return ['provider', 'url']
          case 'openai':
            return ['provider', 'apiKey', 'model']
          case undefined:
            return []
        }
      // eslint-disable-next-line no-fallthrough
      default:
        return []
    }
  }

  save() {
    this.store.set(this.config)
  }

  set(keyPath: ConfigKeyPath, value: unknown) {
    invariant(!!keyPath, 'internal_error')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current = this.config as Record<string, any>

    keyPath.forEach((key, index) => {
      if (index === keyPath.length - 1) {
        current[key] = value
      } else {
        if (typeof current[key] !== 'object' || current[key] === null) {
          current[key] = {}
        }

        current = current[key]
      }
    })
  }
}
