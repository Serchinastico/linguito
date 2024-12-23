import {ModuleDeclaration, Statement} from 'acorn'
import * as espree from 'espree'
import fs from 'node:fs/promises'

import {AnyNode} from './types'

type NodeByType<T extends AnyNode['type']> = Extract<AnyNode, {type: T}>

/**
 * Represents an abstract syntax tree (AST) with a collection of nodes.
 * Provides functionality to parse and traverse nodes in the AST.
 *
 * @template TNode Extends `AnyNode` to define the type of nodes contained in the AST.
 */
export class Ast<TNode extends AnyNode = ModuleDeclaration | Statement> {
  constructor(public nodes: TNode[]) {}

  static async fromFile(filePath: string): Promise<Ast> {
    const code = await fs.readFile(filePath, 'utf-8')

    const program = espree.parse(code, {ecmaVersion: 'latest', sourceType: 'module'})
    return new Ast(program.body)
  }

  filter(predicate: (node: TNode) => boolean): Ast<TNode> {
    const nodes = this.nodes.filter(predicate)
    return new Ast(nodes)
  }

  filterByType<TType extends AnyNode['type']>(type: TType): Ast<NodeByType<TType>> {
    const nodes = this.nodes.filter((node) => node.type === type) as unknown[] as NodeByType<TType>[]
    return new Ast(nodes)
  }

  get(accessor: keyof TNode): string[]
  get<TNewNode extends AnyNode>(accessor: keyof TNode): Ast<TNewNode>
  get<TNewNode extends AnyNode>(accessor: keyof TNode): Ast<TNewNode> | string[] {
    const values = this.nodes.flatMap((node) => node[accessor]).filter((node) => node !== null && node !== undefined)

    if (values.length === 0) return []

    const exampleValue = values[0]
    if (typeof exampleValue === 'string') return values as string[]
    else return new Ast(values as unknown[] as TNewNode[])
  }
}
