#!/usr/bin/env -S npx tsx --disable-warning=ExperimentalWarning

// eslint-disable-next-line n/shebang
import {execute} from '@oclif/core'

require('tsconfig-paths').register()

await execute({development: true, dir: import.meta.url})
