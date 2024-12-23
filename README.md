# Linguito

Linguito is a CLI tool designed to enhance the capabilities of [Lingui](https://lingui.dev/). It provides advanced utilities to ensure smooth internationalization (i18n) workflows, making it a great companion for managing translations in your project.

## Commands

### `linguito check`

Verifies your project's translation files to ensure all translations are complete. It scans the catalog files defined in `lingui.config.js` and reports any missing translations in the format `<file>:"<missing_key>"`.

#### Examples

```shell
# By default, linguito check looks for a lingui config file in the current directory
linguito check

# Or you can specify your project's directory
linguito check ~/Development/my-app
```

## Development

This project is built with [oclif](https://oclif.io/) and [Typescript](https://www.typescriptlang.org/).

### Commands

Here is a list of useful commands to use and develop this tool locally:
- `npm run start -- {command}` - Runs linguito locally
- `npm run lint` - Validate lint rules
- `npm run test` - Runs all tests
- `npm run test:watch` - Runs all tests and watches for changes to rerun them when they happen
