import {groupBy} from '@madeja-studio/cepillo'
import {po as poParser} from 'gettext-parser'
import fs from 'node:fs/promises'
import path from 'node:path'

import {FilledTranslation, MissingTranslation} from '@/lib/common/types.js'
import {GetTextParser} from '@/lib/lingui/gettext-parser'

export class Translations {
  private parser: GetTextParser

  constructor(private projectDir: string) {
    this.parser = new GetTextParser()
  }

  async addMissing(translations: FilledTranslation[]) {
    const translationsByCatalog = groupBy(translations, (translation) => translation.file)
    const catalogFiles = Object.keys(translationsByCatalog)

    for (const catalogFile of catalogFiles) {
      const poFile = await fs.readFile(catalogFile, 'utf-8')
      const po = poParser.parse(poFile)

      for (const translation of translationsByCatalog[catalogFile]) {
        po.translations[''][translation.key]['msgstr'] = [translation.translation]
      }

      const buffer = poParser.compile(po, {foldLength: 0})
      await fs.writeFile(catalogFile, buffer)
    }
  }

  async format(catalogFiles: string[]) {
    for (const catalogFile of catalogFiles) {
      const translations = await this.parser.parse(catalogFile)

      const rebuiltContent = translations
        .filter((translation) => translation.msgid.length > 0)
        .map((translation) => [...translation.comments, ...translation.msgid, ...translation.msgstr, ''].join('\n'))
        .join('\n')

      await fs.writeFile(catalogFile, rebuiltContent)
    }
  }

  async getMissing(catalogFiles: string[]): Promise<MissingTranslation[]> {
    const missingTranslations: MissingTranslation[] = []

    for (const catalogFile of catalogFiles) {
      const poFile = await fs.readFile(catalogFile, 'utf-8')
      const po = poParser.parse(poFile)
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
