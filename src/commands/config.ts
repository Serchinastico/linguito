import {Flags} from '@oclif/core'
import Configstore from 'configstore'
import fs from 'node:fs/promises'

import BaseCommand from '../lib/command/base.js'
import {ConfigKeyPath, Config as ConfigType, emptyConfig} from '../lib/common/types.js'
import {extractKeyPaths, getConfigValue, setConfigValue} from '../lib/config/config.js'
import {EditConfig} from '../lib/ui/config/EditConfig.js'
import {render} from '../lib/ui/render.js'

export default class Config extends BaseCommand {
  static description = `- Sets up and manages configuration options to personalize your experience.`
  static examples = [
    `<%= config.bin %> <%= command.id %> -i # For an interactive config setup.`,
    `<%= config.bin %> <%= command.id %> -s llmSetings.provider=lmstudio -s llmSettings.url=http://127.0.0.1:1234/v1 # Set multiple config values with one call`,
  ]
  static flags = {
    get: Flags.string({
      char: 'g',
      description: `Prints out the config value for the selected config key path. Allowed keys are listed below:
${extractKeyPaths(emptyConfig)
  .map((key) => `- ${key}`)
  .join('\n')}
`,
      exclusive: ['set', 'interactive'],
      required: false,
    }),
    interactive: Flags.boolean({
      char: 'i',
      default: false,
      description: 'Enables interactive mode for this command.',
      exclusive: ['get', 'set'],
    }),
    set: Flags.string({
      char: 's',
      description: `Sets a new value for the config. Use the format: <key>=<value>. Allowed keys are listed below:
${extractKeyPaths(emptyConfig)
  .map((key) => `- ${key}`)
  .join('\n')}
`,
      exclusive: ['get', 'interactive'],
      multiple: true,
      multipleNonGreedy: true,
      required: false,
    }),
  }
  static summary = 'Configure and adjust settings, including provider and model preferences.'

  async run() {
    const {flags} = await this.parse(Config)
    const {get, interactive, set} = flags

    const packageJson = JSON.parse(await fs.readFile('./package.json', 'utf8'))
    const store = new Configstore(packageJson.name, emptyConfig)
    const config = store.all as ConfigType

    if (interactive) {
      const newConfig = await render(EditConfig, {config})
      store.set(newConfig)
    } else if (get) {
      const value = getConfigValue(config, get.split('.') as ConfigKeyPath)
      this.log(`${value}`)
    } else if (set) {
      let newConfig = config

      for (const assignment of set) {
        const [keyPath, value] = assignment.split('=')
        newConfig = setConfigValue(config, keyPath.split('.') as ConfigKeyPath, value)
      }

      store.set(newConfig)
    }
  }
}
