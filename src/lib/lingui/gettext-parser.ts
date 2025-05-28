import fs from 'node:fs/promises'

import {invariant} from '@/lib/command/invariant'

type Translation = {
  comments: string[]
  msgid: string[]
  msgstr: string[]
}

export class GetTextParser {
  constructor() {}

  async parse(catalogFilePath: string): Promise<Translation[]> {
    const catalogFile = await fs.readFile(catalogFilePath, 'utf-8')
    const lines = catalogFile.split('\n')

    const translations: Translation[] = []
    let currentTranslation: Translation | undefined = undefined

    for (const line of lines) {
      if (line.startsWith('#')) {
        if (currentTranslation && currentTranslation.msgstr.length > 0) {
          translations.push(currentTranslation)
          currentTranslation = {comments: [line], msgid: [], msgstr: []}
        } else if (currentTranslation) {
          currentTranslation?.comments.push(line)
        } else {
          currentTranslation = {comments: [line], msgid: [], msgstr: []}
        }
      } else if (line.startsWith('msgid')) {
        if (currentTranslation && currentTranslation.msgstr.length > 0) {
          translations.push(currentTranslation)
          currentTranslation = {comments: [], msgid: [line], msgstr: []}
        } else if (currentTranslation) {
          currentTranslation.msgid.push(line)
        } else {
          currentTranslation = {comments: [], msgid: [line], msgstr: []}
        }
      } else if (line.startsWith('msgstr')) {
        invariant(currentTranslation !== undefined, 'internal_error')

        currentTranslation.msgstr.push(line)
      } else if (line.startsWith('"')) {
        invariant(currentTranslation !== undefined, 'internal_error')

        if (currentTranslation.msgstr.length > 0) {
          currentTranslation.msgstr.push(line)
        } else {
          currentTranslation.msgid.push(line)
        }
      } else if (line.trim().length === 0) {
        if (currentTranslation) {
          translations.push(currentTranslation)
          currentTranslation = undefined
        }
      }
    }

    return translations
  }
}
