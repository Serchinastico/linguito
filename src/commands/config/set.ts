import {Args} from '@oclif/core'

import BaseCommand from '@/lib/command/base.js'
import {ConfigKeyPath} from '@/lib/common/types.js'
import {ConfigManager} from '@/lib/config/config-manager.js'

export default class Set extends BaseCommand {
  static args = {
    assignments: Args.string({
      description:
        'A pair of a config key and its new value. The config key path is separated by the dot (".") character, and the key is separated from the value with the equal ("=") sign. e.g. llmSettings.provider=lmstudio',
      required: true,
    }),
  }
  static description = `Sets a new value for the config. Use the format: <key>=<value>. Allowed keys are listed below:
${ConfigManager.getAllKeyPaths()
  .map((key) => `- ${key}`)
  .join('\n')}
`
  static examples = [
    `<%= config.bin %> <%= command.id %> llmSetings.provider=lmstudio # Set one single config value`,
    `<%= config.bin %> <%= command.id %> llmSetings.provider=lmstudio llmSettings.url=http://127.0.0.1:1234/v1 # Set multiple config values with one call`,
  ]
  static strict = false
  static summary = 'Set configuration values by specifying key-value pairs.'

  async run() {
    const {argv} = await this.parse(Set)

    const config = new ConfigManager()

    for (const assignment of argv as string[]) {
      const [keyPath, value] = assignment.split('=')
      config.set(keyPath.split('.').map((s) => s.trim()) as ConfigKeyPath, value)
    }

    config.save()
  }
}
