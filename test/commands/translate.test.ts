import {captureOutput} from '@oclif/test'
import fs from 'node:fs/promises'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

// @ts-expect-error WebStorm will not detect this import
import Translate from '@/commands/translate.js'

import {backupCatalogTestFiles, restoreCatalogTestFiles} from '../lib/fs.js'

const mocks = vi.hoisted(() => {
  return {translate: vi.fn()}
})
vi.mock('@/lib/llm/llm.js', () => ({
  Llm: vi.fn(() => ({
    translate: mocks.translate,
  })),
}))

describe('translate', () => {
  beforeEach(async () => {
    await backupCatalogTestFiles('missing-translations')
    vi.restoreAllMocks()
  })

  afterEach(async () => {
    await restoreCatalogTestFiles('missing-translations')
  })

  it('translates all missing copies using the configured LLM', async () => {
    mocks.translate.mockReturnValue(
      Promise.resolve([
        {
          file: 'test/fixtures/missing-translations/messages.en.po',
          key: '{0} of {1}',
          locale: 'en',
          reference: {filePath: 'src/features/image-viewer/components/Header.tsx', line: '24'},
          translation: 'llm-translation-01',
        },
        {
          file: 'test/fixtures/missing-translations/messages.es.po',
          key: '<0><1>Support us in this project and get the app with no limitations </1><2>forever</2><3>.</3></0>',
          locale: 'es',
          reference: {filePath: 'src/features/settings/components/AppPurchasePrompt.tsx', line: '18'},
          translation: 'llm-translation-02',
        },
      ]),
    )

    const {error} = await captureOutput(() => Translate.run(['test/fixtures/missing-translations', '--llm']))
    const [enCatalogFile, esCatalogFile] = await Promise.all([
      fs.readFile('test/fixtures/missing-translations/messages.en.po', 'utf-8'),
      fs.readFile('test/fixtures/missing-translations/messages.es.po', 'utf-8'),
    ])

    expect(error).to.be.undefined
    expect(enCatalogFile).to.contain(['msgid "{0} of {1}"', 'msgstr "llm-translation-01"'].join('\n'))
    expect(esCatalogFile).to.contain(
      [
        'msgid "<0><1>Support us in this project and get the app with no limitations </1><2>forever</2><3>.</3></0>"',
        'msgstr "llm-translation-02"',
      ].join('\n'),
    )
  })
})
