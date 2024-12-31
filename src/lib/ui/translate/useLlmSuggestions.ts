import {FilledTranslation, MissingTranslation} from '@/lib/common/types.js'
import {ConfigManager} from '@/lib/config/config-manager.js'
import {Llm} from '@/lib/llm/llm.js'
import useArray from '@/lib/ui/hooks/useArray.js'
import {useCallback, useEffect, useMemo} from 'react'

interface Props {
  isLlmAssisted: boolean
  missingTranslations: MissingTranslation[]
}

type SuggestedTranslation = (FilledTranslation & {isLoading: false}) | {isLoading: true}

/**
 * A custom hook that generates and manages LLM-assisted translation suggestions.
 *
 * @param props The properties required by the hook.
 * @param props.isLlmAssisted A flag indicating whether LLM-assisted translation is enabled.
 * @param props.missingTranslations A list of missing translations to be processed.
 * @returns An object containing the following:
 * - `regenerateSuggestedTranslation` (function): A function to regenerate a single translation suggestion for a specific index.
 * - `suggestedTranslations` (Array<Object>): An array of suggested translations, where each object contains the translated content and loading status.
 */
export const useLlmSuggestions = ({isLlmAssisted, missingTranslations}: Props) => {
  const {array: suggestedTranslations, update: updateSuggestedTranslation} = useArray<SuggestedTranslation>(
    missingTranslations.map(() => ({isLoading: true})),
  )
  const configManager = useMemo(() => new ConfigManager(), [])
  const llm = useMemo(() => new Llm(configManager.config), [])

  const generateSuggestedTranslations = useCallback(async () => {
    if (!isLlmAssisted) return

    missingTranslations.forEach((missingTranslation, index) => {
      llm.translateOne(missingTranslation).then((translation) => {
        updateSuggestedTranslation(index, {...translation, isLoading: false})
      })
    })
  }, [isLlmAssisted, llm, updateSuggestedTranslation])

  const regenerateSuggestedTranslation = useCallback(
    async (index: number) => {
      if (!isLlmAssisted) return

      updateSuggestedTranslation(index, {isLoading: true})

      const missingTranslation = missingTranslations[index]
      const translation = await llm.translateOne(missingTranslation)
      updateSuggestedTranslation(index, {...translation, isLoading: false})
    },
    [isLlmAssisted, llm, updateSuggestedTranslation],
  )

  useEffect(() => {
    generateSuggestedTranslations().then()
  }, [generateSuggestedTranslations])

  return {regenerateSuggestedTranslation, suggestedTranslations}
}
