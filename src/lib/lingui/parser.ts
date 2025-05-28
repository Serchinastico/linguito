import {getConfig} from '@lingui/conf'
import {combinatorial} from '@madeja-studio/cepillo'

import {invariant} from '@/lib/command/invariant.js'

/**
 * Utility class for parsing and processing Lingui configuration files.
 * It extracts specific data such as locales, catalog paths, and formats
 * for generating catalog file paths.
 */
export class ConfigParser {
  constructor(private projectDir: string) {}

  async parse(configFilePath: string) {
    const config = getConfig({configPath: configFilePath})

    invariant(config.format === 'po', 'unknown_catalog_file_format')

    return combinatorial(config.locales, config.catalogs ?? []).flatMap(
      ([locale, catalog]) => `${catalog.path.replace('{locale}', locale)}.${config.format}`,
    )
  }
}
