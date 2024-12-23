import {Command} from '@oclif/core'
import {CommandError} from '@oclif/core/interfaces'

import {INVARIANT_ERROR_PREFIX, InvariantErrorCode, invariantErrorMessage} from './invariant.js'

export default abstract class BaseCommand extends Command {
  protected async catch(err: CommandError) {
    if (err.message.startsWith(INVARIANT_ERROR_PREFIX)) {
      const code = err.message.replace(INVARIANT_ERROR_PREFIX, '') as InvariantErrorCode

      this.error(invariantErrorMessage[code], {code, exit: 1})
    } else {
      throw err
    }
  }
}
