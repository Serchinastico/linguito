import {captureOutput} from '@oclif/test'
import {beforeEach, describe, expect, it, vi} from 'vitest'

// @ts-expect-error WebStorm will not detect this import
import Set from '@/commands/config/set.js'

const mocks = vi.hoisted(() => {
  return {default: vi.fn()}
})
vi.mock('configstore', () => ({default: mocks.default}))

describe('config set', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('sets a config value', async () => {
    const systemPromptValue = 'system-prompt'

    const setMock = vi.fn()
    mocks.default.mockReturnValue({
      all: {},
      set: setMock,
    })

    const {error} = await captureOutput(() => Set.run([`systemPrompt=${systemPromptValue}`]))

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
      Set.run([`systemPrompt=${systemPromptValue}`, `llmSettings.provider=${llmProvider}`]),
    )

    expect(error).to.be.undefined
    expect(setMock).toHaveBeenCalledTimes(1)
    expect(setMock).toHaveBeenCalledWith({llmSettings: {provider: llmProvider}, systemPrompt: systemPromptValue})
  })
})
