#!/usr/bin/env node

import {execute} from '@oclif/core'

require('tsconfig-paths').register()

await execute({dir: import.meta.url})
