import {captureOutput} from '@oclif/test'
import {beforeEach, describe, expect, it, vi} from 'vitest'

import Config from '../../src/commands/config.js'

const mocks = vi.hoisted(() => {
  return {default: vi.fn()}
})
vi.mock('configstore', () => ({default: mocks.default}))

describe('config', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('gets a nested config value', async () => {
    const llmProvider = 'llm-provider'
    mocks.default.mockReturnValue({all: {llmSettings: {provider: llmProvider}}})

    const {error, stdout} = await captureOutput(() => Config.run(['-g llmSettings.provider']))

    expect(error).to.be.undefined
    expect(stdout).to.contain(llmProvider)
  })

  it('gets a config value', async () => {
    const systemPrompt = 'system-prompt'
    mocks.default.mockReturnValue({all: {systemPrompt}})

    const {error, stdout} = await captureOutput(() => Config.run(['-g systemPrompt']))

    expect(error).to.be.undefined
    expect(stdout).to.contain(systemPrompt)
  })

  it('sets a config value', async () => {
    const systemPromptValue = 'system-prompt'

    const setMock = vi.fn()
    mocks.default.mockReturnValue({
      all: {},
      set: setMock,
    })

    const {error} = await captureOutput(() => Config.run([`-s systemPrompt=${systemPromptValue}`]))

    expect(error).to.be.undefined
    expect(setMock).toHaveBeenCalledTimes(1)
    expect(setMock).toHaveBeenCalledWith({systemPrompt: systemPromptValue})
  })

  it('sets multiple config value', async () => {
    const systemPromptValue = 'system-prompt'
    const llmProvider = 'llm-provider'

    const setMock = vi.fn()
    mocks.default.mockReturnValue({
      all: {},
      set: setMock,
    })

    const {error} = await captureOutput(() =>
      Config.run([`-s systemPrompt=${systemPromptValue}`, `-s llmSettings.provider=${llmProvider}`]),
    )

    expect(error).to.be.undefined
    expect(setMock).toHaveBeenCalledTimes(1)
    expect(setMock).toHaveBeenCalledWith({llmSettings: {provider: llmProvider}, systemPrompt: systemPromptValue})
  })
})
