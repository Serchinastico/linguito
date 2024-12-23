import {Project, SyntaxKind} from 'ts-morph'

const main = async () => {
  const project = new Project({tsConfigFilePath: 'tsconfig.json'})

  const declarationFile = project.addSourceFileAtPath('node_modules/acorn/dist/acorn.d.ts')

  const declarations = declarationFile.getDescendantsOfKind(SyntaxKind.InterfaceDeclaration)

  const nodeSubtypes = declarations
    .filter((node) => node.getHeritageClauses().length > 0 && node.getHeritageClauses()[0].getTypeNodes().length > 0)
    .map((node) => ({name: node.getName(), parent: node.getHeritageClauses()[0].getTypeNodes()[0].getText()}))
    .filter((node) => node.parent === 'Node')

  const anyNodeDefinition = `
/**
 * This type is automatically generated by the build-acorn-node-types script.
 *
 * It generates all types defined in the acorn library as types rather than interfaces.
 * This helps while working with the AST as the new defined AnyNode type is a closed
 * union of all the node types.
 *
 * Do not modify directly, instead run the command 'npm run generate:acorn'.
 */
 
import {${nodeSubtypes.map((node) => node.name).join(', ')}} from 'acorn'
 
export type AnyNode = ${nodeSubtypes.map((node) => node.name).join(' | ')}
`

  project.createSourceFile('src/lib/ast/types.ts', anyNodeDefinition, {overwrite: true})

  await project.save()
}

main()
