import {backupCatalogTestFiles, restoreCatalogTestFiles} from '../test/lib/fs.js'

const main = async (command: string) => {
  if (command === 'backup') {
    await backupCatalogTestFiles('missing-translations')
  } else if (command === 'restore') {
    await restoreCatalogTestFiles('missing-translations')
  } else {
    console.error(`Unknown command: ${command}`)
  }
}

const args = process.argv.slice(2)

main(args[0])
