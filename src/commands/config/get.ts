import BaseCommand from '@/lib/command/base.js'
import {ConfigKeyPath, Config as ConfigType, emptyConfig} from '@/lib/common/types.js'
import {extractKeyPaths, getConfigValue} from '@/lib/config/config.js'
import {Args, Flags} from '@oclif/core'
import cj from 'color-json'
import Configstore from 'configstore'
import fs from 'node:fs/promises'

export default class Get extends BaseCommand {
  static args = {
    configPathKey: Args.string({
      description: 'Config key path separated by the dot (".") character. e.g. llmSettings.url',
      required: false,
    }),
  }
  static description = `Prints out the config value for the selected config key or the entire config if no key is provided. Allowed keys are listed below: 
  ${extractKeyPaths(emptyConfig)
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

    const packageJson = JSON.parse(await fs.readFile('./package.json', 'utf8'))
    const store = new Configstore(packageJson.name, emptyConfig)
    const config = store.all as ConfigType

    if (configPathKey) {
      const value = getConfigValue(config, configPathKey.split('.').map((s) => s.trim()) as ConfigKeyPath)
      this.log(`${value}`)
    } else {
      this.log(color ? cj(config) : JSON.stringify(config, null, 2))
    }
  }
}
