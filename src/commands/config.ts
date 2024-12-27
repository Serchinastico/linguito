import {Flags} from '@oclif/core'
import Configstore from 'configstore'
import fs from 'node:fs/promises'

import BaseCommand from '../lib/command/base.js'
import {Config as ConfigType, emptyConfig} from '../lib/common/types.js'
import {EditConfig} from '../lib/ui/config/EditConfig.js'
import {render} from '../lib/ui/render.js'

export default class Config extends BaseCommand {
  static description = `- \`Sets up and manages configuration options to personalize your experience.`
  static examples = [`<%= config.bin %> <%= command.id %>`]
  static flags = {
    interactive: Flags.boolean({
      char: 'i',
      default: false,
      description: 'Enables interactive mode for this command.',
    }),
  }
  static summary = 'Configure and adjust settings, including provider and model preferences.'

  async run() {
    const packageJson = JSON.parse(await fs.readFile('./package.json', 'utf8'))
    const store = new Configstore(packageJson.name, emptyConfig)
    const config = store.all as ConfigType

    const newConfig = await render(EditConfig, {config})
    store.set(newConfig)
  }
}
