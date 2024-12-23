import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import {describe, it} from 'vitest'

describe('check', () => {
  it('runs check command in a project with all translations included', async () => {
    const {error} = await runCommand('check test/fixtures/all-translations-included')

    expect(error).to.be.undefined
  })

  it('runs check command in a project with missing translations', async () => {
    const {error} = await runCommand('check test/fixtures/missing-translations')

    expect(error).to.not.be.undefined
    expect(error!.code).to.be.eq('missing_translations')
    expect(error!.oclif).to.not.be.undefined
    expect(error!.oclif!.exit).to.be.eq(-2)
    expect(error!.message).to.contain('test/fixtures/missing-translations/messages.en.po:"{0} of {1}"')
    expect(error!.message).to.contain('test/fixtures/missing-translations/messages.es.po:"{0} - Manual"')
    expect(error!.message).to.contain(
      'test/fixtures/missing-translations/messages.es.po:"<0><1>Support us in this project and get the app with no limitations </1><2>forever</2><3>.</3></0>"',
    )
  })

  it('runs check command in a project with no lingui config file', async () => {
    const {error} = await runCommand('check test/fixtures/no-lingui-config-file')

    expect(error).to.not.be.undefined
    expect(error!.code).to.be.eq('missing_lingui_config_file')
    expect(error!.oclif).to.not.be.undefined
    expect(error!.oclif!.exit).to.be.eq(-1)
  })

  it('runs check command in a project with unknown catalog file', async () => {
    const {error} = await runCommand('check test/fixtures/unknown-catalog-format')

    expect(error).to.not.be.undefined
    expect(error!.code).to.be.eq('unknown_catalog_file_format')
    expect(error!.oclif).to.not.be.undefined
    expect(error!.oclif!.exit).to.be.eq(-1)
  })
})
