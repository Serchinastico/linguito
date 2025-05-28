import {Args, Flags} from '@oclif/core'
import cj from 'color-json'

import BaseCommand from '@/lib/command/base.js'
import {ConfigKeyPath} from '@/lib/common/types.js'
import {ConfigManager} from '@/lib/config/config-manager.js'

export default class Get extends BaseCommand {
  static args = {
    configPathKey: Args.string({
      description: 'Config key path separated by the dot (".") character. e.g. llmSettings.url',
      required: false,
    }),
  }
  static description = `Prints out the config value for the selected config key or the entire config if no key is provided. Allowed keys are listed below: 
  ${ConfigManager.getAllKeyPaths()
    .map((key) => `- ${key}`)
    .join('\n')}`
  static examples = [`<%= config.bin %> <%= command.id %> llmSettings.provider`]
  static flags = {
    color: Flags.boolean({default: true, description: 'Colorize the output.', required: false}),
  }
  static summary =
    'Displays the configuration value for a specified key or the entire configuration if no key is provided.'

  async run() {
    const {args, flags} = await this.parse(Get)
    const {configPathKey} = args
    const {color} = flags

    const config = new ConfigManager()

    if (configPathKey) {
      const value = config.get(configPathKey.split('.').map((s) => s.trim()) as ConfigKeyPath)
      this.log(`${value}`)
    } else {
      this.log(color ? cj(config) : JSON.stringify(config, null, 2))
    }
  }
}
