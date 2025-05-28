import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import fs from 'node:fs/promises'
import {afterEach, beforeEach, describe, it, vi} from 'vitest'

import {backupCatalogTestFiles, restoreCatalogTestFiles} from '../lib/fs.js'

describe('format', () => {
  beforeEach(async () => {
    await backupCatalogTestFiles('all-translations-included')
    await backupCatalogTestFiles('commented-translations')
    vi.restoreAllMocks()
  })

  afterEach(async () => {
    await restoreCatalogTestFiles('all-translations-included')
    await restoreCatalogTestFiles('commented-translations')
  })
  it('no changes when runs format command in a well-formed project', async () => {
    const enCatalogFile = await fs.readFile('test/fixtures/all-translations-included/messages.en.po', 'utf-8')

    const {error} = await runCommand('format test/fixtures/all-translations-included')

    const newEnCatalogFile = await fs.readFile('test/fixtures/all-translations-included/messages.en.po', 'utf-8')

    expect(error).to.be.undefined
    expect(newEnCatalogFile).to.equal(enCatalogFile)
  })

  it('removes commented translations', async () => {
    const enCatalogFile = await fs.readFile('test/fixtures/commented-translations/messages.en.po', 'utf-8')

    const {error} = await runCommand('format test/fixtures/commented-translations')

    const newEnCatalogFile = await fs.readFile('test/fixtures/commented-translations/messages.en.po', 'utf-8')

    expect(error).to.be.undefined
    expect(newEnCatalogFile).to.not.equal(enCatalogFile)
    expect(enCatalogFile).to.contain('#~ msgstr "{0} of {1}"')
    expect(newEnCatalogFile).to.not.contain('#~ msgstr "{0} of {1}"')
  })
})
