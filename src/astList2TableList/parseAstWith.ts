import { With } from "node-sql-parser";

import { astParseFn } from './parseAst';
import type { ParsedTable } from "@src/types/types.d";

// With句を解析して、テーブル定義を返す
export function parseAstWith(astWithArray: With[] | null): ParsedTable[] {
    if (!astWithArray) return [];

    return astWithArray.reduce((accumTables, curWith) => {
        // curWithにあるnameとstmt.astを使って、テーブル情報を解析する
        return accumTables.concat(
            astParseFn[curWith.stmt.ast.type]({
                name: curWith.name.value,
                ast: curWith.stmt.ast,
                isTopQuery: false,
            })
        );
    }, [] as ParsedTable[]);
}
