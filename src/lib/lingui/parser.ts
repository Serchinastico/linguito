import {Ast} from '@/lib/ast/ast.js'
import {invariant} from '@/lib/command/invariant.js'
import {ArrayExpression, Literal, ObjectExpression, Property, VariableDeclaration, VariableDeclarator} from 'acorn'

/**
 * Utility class for parsing and processing Lingui configuration files.
 * It extracts specific data such as locales, catalog paths, and formats
 * for generating catalog file paths.
 */
export class ConfigParser {
  constructor(private projectDir: string) {}

  async parse(configFilePath: string) {
    const ast = await Ast.fromFile(configFilePath)

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
    invariant(format === 'po', 'unknown_catalog_file_format')

    const catalogFiles: string[] = []

    for (const locale of locales) {
      for (const catalog of catalogs) {
        const resolvedPath = catalog.replace('<rootDir>', this.projectDir).replace('{locale}', locale)
        catalogFiles.push(`${resolvedPath}.${format}`)
      }
    }

    return catalogFiles
  }
}
