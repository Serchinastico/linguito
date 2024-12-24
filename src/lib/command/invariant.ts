export const INVARIANT_ERROR_PREFIX: string = 'Invariant failed::'

export type InvariantErrorCode =
  | 'invalid_translate_options'
  | 'lmstudio:no_models_found'
  | 'missing_lingui_config_file'
  | 'unknown_catalog_file_format'

export const invariantErrorMessage: Record<InvariantErrorCode, string> = {
  invalid_translate_options:
    "Invalid options passed to 'translate' function. Both interactive and llm options can't be false at the same time.",
  'lmstudio:no_models_found': 'No models loaded in LM Studio',
  missing_lingui_config_file: 'lingui.config.js does not exist or is not readable',
  unknown_catalog_file_format: 'Translation files must be in a known format. Currently supported formats are: po',
}

export function invariant(condition: boolean, code: InvariantErrorCode): asserts condition {
  if (condition) {
    return
  }

  throw new Error(`${INVARIANT_ERROR_PREFIX}${code}`)
}
