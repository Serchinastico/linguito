import BaseCommand from '@/lib/command/base.js'
import {Config as ConfigType, emptyConfig} from '@/lib/common/types.js'
import {EditConfig} from '@/lib/ui/config/EditConfig.js'
import {render} from '@/lib/ui/render.js'
import Configstore from 'configstore'
import fs from 'node:fs/promises'

export default class Config extends BaseCommand {
  static description = `Opens an interactive session to view, update, and save the configuration settings for Linguito. This includes options such as provider and model preferences.`
  static examples = [`<%= config.bin %> <%= command.id %>`]
  static summary = "Interactively read and update the app's configuration settings."

  async run() {
    const packageJson = JSON.parse(await fs.readFile('./package.json', 'utf8'))
    const store = new Configstore(packageJson.name, emptyConfig)
    const config = store.all as ConfigType

    const newConfig = await render(EditConfig, {config})
    store.set(newConfig)
  }
}
