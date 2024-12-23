import gettextParser from 'gettext-parser'
import fs from 'node:fs/promises'

type MissingTranslation = {
  file: string
  key: string
  reference: string
}

export class Translations {
  async getMissing(catalogFiles: string[]) {
    const missingTranslations: MissingTranslation[] = []

    for (const catalogFile of catalogFiles) {
      const poFile = await fs.readFile(catalogFile, 'utf-8')
      const po = gettextParser.po.parse(poFile)
      const translations = po.translations['']

      for (const [key, translation] of Object.entries(translations)) {
        if (key === '') continue

        if (
          !translation.msgstr ||
          translation.msgstr.length === 0 ||
          translation.msgstr.some((msgstr) => msgstr === '')
        ) {
          missingTranslations.push({file: catalogFile, key, reference: translation.comments?.reference ?? ''})
        }
      }
    }

    return missingTranslations
  }
}
