import { Dual, TableExpr, Join, BaseFrom } from "node-sql-parser";
import type { From } from "node-sql-parser";

import { astParseFn } from './parseAst';
import type { ParsedTable, ParsedColumn, TableColumnName } from "@src/types/types.d";
import { parseAstExpressionValueFn } from "./parseAstColumns";

// From句を解析して、テーブル定義を返す
export function parseAstFrom(astFromArray: From[] | null): ParsedTable[] {
    if (!astFromArray) return [];

    return astFromArray.reduce((accumTables, curFrom) => {
        return accumTables.concat(parseAstFromOne(curFrom));
    }, [] as ParsedTable[]);
}


// Fromは4パターン
// BaseFrom | Join | TableExpr | Dual
// type: "dual"があったら、Dual
//      なにもしない
// exprがあったら、TableExpr
//      From.exprをSelectとしてParse
// joinがあったら、Join
//      列は空、名前とasだけ
// else、BaseFrom
//      列は空、名前とasだけ
function parseAstFromOne(astFrom: From): ParsedTable[] {
    // typeがあったらDual
    if (astFrom.hasOwnProperty('type')) {
        const maybeDual: Dual = astFrom as Dual;
        if (maybeDual.type === 'dual') {
            return [];
        }
        // dual以外のタイプは存在しないはず
        console.error(`Unknown From type: ${maybeDual.type}`);
        return [];
    }

    // exprがあったら、TableExpr
    if (astFrom.hasOwnProperty('expr')) {
        const tableExpr: TableExpr = astFrom as TableExpr;

        return astParseFn[tableExpr.expr.ast.type]({
            name: (tableExpr.as)? tableExpr.as: 'no_name_table',
            ast: tableExpr.expr.ast,
            isTopQuery: false,
        });
    }

    // joinがあったら、Join　でもBaseFromと同じだから分岐しない
    if (astFrom.hasOwnProperty('join')) {
        const join: Join = astFrom as Join;

        // 参照する列名の配列
        const columns: TableColumnName[] = [];
        // usingがあるとき、その列名がテーブルに存在する
        if (join.using !== undefined) {     // hasOwnPropertyだとlinterがundefの可能性を除去できないのでこの書き方
            join.using.forEach((tn: string) => {
                columns.push({
                    tableName: join.table,
                    columnName: tn,
                })
            });
        }
        // onがあるとき、Exprを解析して追加
        if (join.on !== undefined) {
            const onExprResult: TableColumnName[] = parseAstExpressionValueFn[join.on.type](join.on);
            onExprResult.forEach((col) => {
                columns.push({
                    tableName: col.tableName,
                    columnName: col.columnName,
                });
            });
        }

        // columnsを、テーブルごとに分ける
        const classedCols: {[tableName:string]: TableColumnName[]} = {};
        columns.forEach((col: TableColumnName) => {
            if (!col.tableName) return;
            if (col.tableName in classedCols) {
                classedCols[col.tableName].push(col);
            } else {
                classedCols[col.tableName] = [col];
            }
        });
        const resultColumns: ParsedTable[] = [];
        for (const tableName in classedCols) {
            resultColumns.push(
                {
                    tableName,
                    columns: classedCols[tableName].map((colName) => {
                        return {
                            currentColumnName: colName.columnName,
                            fromColumns: [] as TableColumnName[],
                        } as ParsedColumn;
                    }),
                }
            );
        }

        return resultColumns;
    }

    const baseFrom: BaseFrom = astFrom as BaseFrom;
    return [{
        tableName: baseFrom.table,
        tableNameAs: baseFrom.as,
        columns: [],
    }];
}
