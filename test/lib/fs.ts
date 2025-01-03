import fs from 'node:fs/promises'

/**
 * Asynchronously creates backups of test fixture files for the specified test case.
 *
 * This function copies `.po` files associated with the given fixture to backup files
 * with a `.backup` extension in the same directory. It ensures that the original files
 * remain intact and backed up for further testing or restoration purposes.
 *
 * This is an alternative to using an in-memory file system for tests. As long as this
 * solution does not cause any problem, we will keep it this way for its simplicity.
 *
 * @param fixture - The name of the test fixture directory containing the files
 *                  to back up (e.g., 'missing-translations').
 * @returns A promise that resolves when all backup operations are complete.
 */
export const backupCatalogTestFiles = async (fixture: 'missing-translations') => {
  await Promise.all([
    fs.cp(`test/fixtures/${fixture}/messages.en.po`, `test/fixtures/${fixture}/messages.en.po.backup`, {}),
    fs.cp(`test/fixtures/${fixture}/messages.es.po`, `test/fixtures/${fixture}/messages.es.po.backup`, {}),
  ])
}

/**
 * Restores catalog test files to their default state by copying backup files to their original locations
 * and removing the backup files.
 *
 * This is an alternative to using an in-memory file system for tests. As long as this
 * solution does not cause any problem, we will keep it this way for its simplicity.
 *
 * @param fixture - The specific fixture directory containing the test catalog files to be restored.
 *                  Example: 'missing-translations'
 * @returns A promise that resolves once the restoration process is complete.
 */
export const restoreCatalogTestFiles = async (fixture: 'missing-translations') => {
  await Promise.all([
    fs.cp(`test/fixtures/${fixture}/messages.en.po.backup`, `test/fixtures/${fixture}/messages.en.po`, {}),
    fs.cp(`test/fixtures/${fixture}/messages.es.po.backup`, `test/fixtures/${fixture}/messages.es.po`, {}),
  ])

  await Promise.all([
    fs.rm(`test/fixtures/${fixture}/messages.en.po.backup`),
    fs.rm(`test/fixtures/${fixture}/messages.es.po.backup`),
  ])
}