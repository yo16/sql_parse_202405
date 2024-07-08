import { From, Dual, TableExpr, Join, BaseFrom } from "node-sql-parser";
import { AbstractTableStructure, TableStructureWithQuery, TableStructureDB, ColumnStructure, TableColumnName } from "./types.d";
import { ast2QueryStructure } from "./ast2QueryStructure";
import { parseAstExpressionValueFn } from "./parseAstExpr";
import { TableMap } from "./tableMap";

// Fromを１つ解析して、TableStructureを１つ返す（Dualの場合はnull）
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
export function parseAstFrom(
    astFrom: From,
    parentTableMap: TableMap,
): AbstractTableStructure | null {
    // typeがあったらDual
    if (astFrom.hasOwnProperty('type')) {
        const maybeDual: Dual = astFrom as Dual;
        if (maybeDual.type === 'dual') {
            return null;
        }
        // dual以外のタイプは存在しないはずだけど念のためのerror
        console.error(`Unknown From type: ${maybeDual.type}`);
        return null;
    }

    // exprがあったら、TableExpr
    if (astFrom.hasOwnProperty('expr')) {
        const tableExpr: TableExpr = astFrom as TableExpr;
        const newTableName: string | null = (tableExpr.as)? tableExpr.as: null;
        const newTableId: number = parentTableMap.getTableIdByName(newTableName);

        return {
            tableId: newTableId,
            tableName: newTableName,
            tableNameAs: newTableName,
            query: ast2QueryStructure(
                    tableExpr.expr.ast,
                    parentTableMap,
                ),
        } as TableStructureWithQuery;
    }

    // joinがあったら、Join
    else if (astFrom.hasOwnProperty('join')) {
        const join: Join = astFrom as Join;

        // 参照する列名の配列
        //const columns: {tableName: string, columnName: string}[] = [];
        // usingがあるとき、その列名がテーブルを参照している
        // `inner join t1 using (col1, col2)`の場合、`(select col1, col2 from t1) as t1`と同様に評価する
        if (join.using !== undefined) {     // hasOwnPropertyだとlinterがundefの可能性を除去できないのでこの書き方
            const tableName = join.table;
            const newTableId = parentTableMap.getTableIdByName(tableName);
            const columns: ColumnStructure[] = join.using.map((col: string) => {
                return {
                    columnName: col,
                    columnNameAs: null,
                    fromColumns: [{
                        tableId: newTableId,
                        columnName: col,
                    },],
                } as ColumnStructure;
            });
            // TableStructureを作って返す
            return {
                tableId: newTableId,
                tableName: tableName,
                tableNameAs: null,
                columns,
            } as TableStructureDB;
        }

        // onがあるとき、Exprを解析して追加
        else if (join.on !== undefined) {
            let columns: TableColumnName[] = [];
            const onExprResult: TableColumnName[] = parseAstExpressionValueFn[join.on.type](join.on);
            onExprResult.forEach((col) => {
                columns.push({
                    tableName: col.tableName,
                    columnName: col.columnName,
                });
            });

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
            const resultTables: TableStructureDB[] = [];
            for (const tableName in classedCols) {
                // 今のテーブルだけにする！（たぶん暫定）
                if (tableName !== join.table) continue;

                const newTableId = parentTableMap.getTableIdByName(tableName);
                resultTables.push(
                    {
                        tableId: newTableId,
                        tableName: tableName,
                        tableNameAs: null,
                        columns: classedCols[tableName].map((colName) => {
                            return {
                                columnName: colName.columnName,
                                columnNameAs: null,
                                fromColumns: [{
                                    tableId: newTableId,
                                    columnName: colName.columnName,
                                }]
                            } as ColumnStructure;
                        }),
                    }
                );
            }
            return resultTables[0];     // 今のテーブルだけ！（たぶん暫定）
        }
    }

    // 普通のfrom
    const baseFrom: BaseFrom = astFrom as BaseFrom;
    const newTableName = baseFrom.table
    const newTableId = parentTableMap.getTableIdByName(newTableName);
    return {
        tableId: newTableId,
        tableName: newTableName,
        tableNameAs: null,
        columns: [],
    } as TableStructureDB;
}
