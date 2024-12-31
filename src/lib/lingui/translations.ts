import {FilledTranslation, MissingTranslation} from '@/lib/common/types.js'
import {groupBy} from '@madeja-studio/cepillo'
import gettextParser from 'gettext-parser'
import fs from 'node:fs/promises'
import path from 'node:path'

export class Translations {
  constructor(private projectDir: string) {}

  async addMissing(translations: FilledTranslation[]) {
    const translationsByCatalog = groupBy(translations, (translation) => translation.file)
    const catalogFiles = Object.keys(translationsByCatalog)

    for (const catalogFile of catalogFiles) {
      const poFile = await fs.readFile(catalogFile, 'utf-8')
      const po = gettextParser.po.parse(poFile)

      for (const translation of translationsByCatalog[catalogFile]) {
        po.translations[''][translation.key]['msgstr'] = [translation.translation]
      }

      const buffer = gettextParser.po.compile(po, {foldLength: 0})
      await fs.writeFile(catalogFile, buffer)
    }
  }

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
          const reference = translation.comments?.reference ?? ''
          const [filePath, line] = reference.split(':')

          missingTranslations.push({
            file: catalogFile,
            key,
            locale: po.headers['Language'],
            reference: {filePath: path.resolve(path.join(this.projectDir, filePath)), line: Number(line)},
          })
        }
      }
    }

    return missingTranslations
  }
}
