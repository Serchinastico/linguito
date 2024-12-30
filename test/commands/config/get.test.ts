// @ts-expect-error WebStorm will not detect this import
import Get from '@/commands/config/get.js'
import {captureOutput} from '@oclif/test'
import {beforeEach, describe, expect, it, vi} from 'vitest'

const mocks = vi.hoisted(() => {
  return {default: vi.fn()}
})
vi.mock('configstore', () => ({default: mocks.default}))

describe('config get', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('gets a nested config value', async () => {
    const llmProvider = 'llm-provider'
    mocks.default.mockReturnValue({all: {llmSettings: {provider: llmProvider}}})

    const {error, stdout} = await captureOutput(() => Get.run(['llmSettings.provider']))

    expect(error).to.be.undefined
    expect(stdout).to.contain(llmProvider)
  })

  it('gets a config value', async () => {
    const systemPrompt = 'system-prompt'
    mocks.default.mockReturnValue({all: {systemPrompt}})

    const {error, stdout} = await captureOutput(() => Get.run(['systemPrompt']))

    expect(error).to.be.undefined
    expect(stdout).to.contain(systemPrompt)
  })
})
