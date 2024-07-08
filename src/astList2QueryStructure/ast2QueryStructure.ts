import { AST } from 'node-sql-parser';

import { ast2QueryStructureFunction, QueryStructure } from "./types.d";
import { parseAstSelect } from './parseAstSelect';
import { TableMap } from './tableMap';

// ASTを１つ受け取って、１つのQueryStructureを返す
export function ast2QueryStructure(
    ast: AST,
    parentTableMap: TableMap      // 親のスコープ内のtableMap
): QueryStructure {
    // 実装済みのDML
    const implementedDMLs: Record<string, ast2QueryStructureFunction> = {
        'select': parseAstSelect,
    };
    if (! (ast.type in implementedDMLs)) {
        throw Error(`Unknown AST type. ${ast.type}`);
    }

    return implementedDMLs[ast.type](ast, parentTableMap);
}

