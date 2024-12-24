import {createOpenAICompatible} from '@ai-sdk/openai-compatible'
import {generateText} from 'ai'
import fs from 'node:fs/promises'

import {MissingTranslation} from '../lingui/translations.js'
import {FilledTranslation} from '../ui/AskForTranslations.js'

const SYSTEM_PROMPT = `You are a professional translator. You are given a text appearing in an application and you need to translate to the desired language. You will be given context and instructions on how to translate the text. Do not answer with anything else than the translated text.`
const getTranslationPrompt = ({fileContents, key, locale}: {fileContents: string; key: string; locale: string}) =>
  `I need you to translate a text for me. The text appears in an application and I need you to give me the translation to the ${locale} language locale.
The translation includes some special characters like placeholders (e.g. {0} or {1}) or markup (e.g. <1> or </1>) that need to be preserved. DO NOT include extra spaces, end of line characters or punctuation.
I'm including here the file where the translation appears to give you additional context:

\`\`\`
${fileContents}
\`\`\`

Finally, the untranslated text is: "${key}"`

export class Llm {
  async translate(missingTranslations: MissingTranslation[]): Promise<FilledTranslation[]> {
    const llmProvider = createOpenAICompatible({baseURL: 'http://localhost:1234/v1', name: 'lmstudio'})
    const model = llmProvider('gemma-2-9b-it')

    const translations: FilledTranslation[] = []

    for (const missingTranslation of missingTranslations) {
      const fileContents = await fs.readFile(missingTranslation.reference.filePath, 'utf-8')

      const {text} = await generateText({
        model,
        prompt: getTranslationPrompt({
          fileContents,
          key: missingTranslation.key,
          locale: missingTranslation.locale,
        }),
        system: SYSTEM_PROMPT,
      })

      translations.push({...missingTranslation, translation: text.trim()})
    }

    return translations
  }
}
