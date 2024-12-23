/** @type {import("@lingui/conf").LinguiConfig} */
export const locales = ['en', 'es']
export const catalogs = [
  {
    include: ['src'],
    path: '<rootDir>/messages.{locale}',
  },
]
export const format = 'po'
