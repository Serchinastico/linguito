import {Args, Command} from '@oclif/core'
import {ArrayExpression, Literal, ObjectExpression, Property, VariableDeclaration, VariableDeclarator} from 'acorn'
import gettextParser from 'gettext-parser'
import fs from 'node:fs/promises'
import * as path from 'node:path'
import invariant from 'tiny-invariant'

import {Ast} from '../lib/ast/ast.js'
import {canReadFile} from '../lib/fs/fs.js'

type MissingTranslation = {
  file: string
  key: string
}

const SEPARATOR = '\n\t• '

export default class Create extends Command {
  static args = {
    projectDir: Args.file({default: '.', description: 'Project root directory', required: false}),
  }
  static description = 'check'
  static examples = []
  static summary = 'check'

  async run() {
    const {args} = await this.parse(Create)
    const {projectDir} = args

    const linguiConfigFilePath = path.resolve(projectDir, 'lingui.config.js')

    const isLinguiConfigFileReadable = await canReadFile(linguiConfigFilePath)
    invariant(isLinguiConfigFileReadable, 'lingui.config.js does not exist or is not readable')

    const ast = await Ast.fromFile(linguiConfigFilePath)

    const exports = ast
      .filterByType('ExportNamedDeclaration')
      .get<VariableDeclaration>('declaration')
      .get<VariableDeclarator>('declarations')

    const locales = exports
      .filter((node) => node.id?.type === 'Identifier' && node.id.name === 'locales')
      .get<ArrayExpression>('init')
      .get<Literal>('elements')
      .get('value')

    const catalogs = exports
      .filter((node) => node.id?.type === 'Identifier' && node.id.name === 'catalogs')
      .get<ArrayExpression>('init')
      .get<ObjectExpression>('elements')
      .get<Property>('properties')
      .filter((node) => node.key.type === 'Identifier' && node.key.name === 'path')
      .get<Literal>('value')
      .get('value')

    const formats = exports
      .filter((node) => node.id?.type === 'Identifier' && node.id.name === 'format')
      .get<Literal>('init')
      .get('value')

    const format = formats[0]
    invariant(format === 'po', "Translation files must be in 'po' format")

    const catalogFiles: string[] = []
    for (const locale of locales) {
      for (const catalog of catalogs) {
        const resolvedPath = catalog.replace('<rootDir>', projectDir).replace('{locale}', locale)
        catalogFiles.push(`${resolvedPath}.${format}`)
      }
    }

    const missingTranslations: MissingTranslation[] = []
    for (const catalogFile of catalogFiles) {
      const poFile = await fs.readFile(catalogFile, 'utf-8')
      const po = gettextParser.po.parse(poFile)
      const translations = po.translations['']

      for (const [key, translation] of Object.entries(translations)) {
        if (key === '') continue

        if (!translation.msgstr) {
          missingTranslations.push({file: catalogFile, key})
        } else if (translation.msgstr.length === 0) {
          missingTranslations.push({file: catalogFile, key})
        } else if (translation.msgstr.some((msgstr) => msgstr === '')) {
          missingTranslations.push({file: catalogFile, key})
        }
      }
    }

    if (missingTranslations.length > 0) {
      const missingTranslationsString = missingTranslations
        .map((translation) => `${translation.file}:"${translation.key}"`)
        .join(SEPARATOR)

      this.error(`The following translations are missing: ${SEPARATOR}${missingTranslationsString}`, {
        code: 'missing_translations',
        exit: -1,
      })
    }

    return Promise.resolve(undefined)
  }
}
