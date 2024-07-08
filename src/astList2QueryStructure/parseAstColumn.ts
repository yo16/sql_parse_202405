import { Column, ExpressionValue } from "node-sql-parser";

import { ColumnStructure, TableColumnName } from "./types.d";
import { TableMap } from "./tableMap";
import { parseAstExpressionValueFn } from "./parseAstExpr";

// astのcolumnsのcolumn1つを解析する
export function parseAstColumn(
    astColumn: any | Column,
    parentTableMap: TableMap,
): ColumnStructure | null {
    // expr.typeがなかったらnull
    if (( !astColumn.expr ) || ( !astColumn.expr.type )){
        return null;
    }

    // 新しい列名を設定する
    const newColumnName = ((astCol)=>{
        // asがあればその名前
        if (astCol.as) {
            return astCol.as;
        }

        switch (astCol.expr.type) {
            // column_refは元の列名
            case 'column_ref':
                return astCol.expr.column;
            // numberは、Val_値
            case 'number':
                return `Val_${astCol.expr.value}`;
            // stringは、Str_値
            case 'string':
                return `Str_${astCol.expr.value}`;
        }

        // それ以外は何かの処理ということで適当に
        return `__${astCol.expr.type}__`;
    })(astColumn);

    // Exprとtypeを変数化（型がわからなくなりがちだから）
    const val: ExpressionValue = astColumn.expr;
    const expressionValueType: string = astColumn.expr.type;

    // ExpressionValueを、typeに従って解析
    // 戻り値のTableColumnは、テーブル名と列名。一時的な型。
    // export type TableColumnName = {
    //     tableName: string | null;
    //     columnName: string | null;
    // }
    const fromColumnNames: TableColumnName[] = parseAstExpressionValueFn[expressionValueType](val);

    // テーブル名と列名の情報から、テーブル名をIDへ変換する
    const fromColumns = fromColumnNames.map((cn) => {
        // tableIdを取得
        // ＜未実装！！＞列にテーブル名を指定していない場合は、推測する
        //      if (!cn.tableName) { parentTableMapの中の列を探す }
        const tableId = parentTableMap.getTableIdByName(cn.tableName);

        return {
            tableId,
            columnName: cn.columnName,
        };
    });

    // ColumnStructureの型
    // export interface ColumnStructure {
    //     columnName: string;
    //     columnNameAs: string | null;
    //     fromColumns: {
    //         tableId: number | null;
    //         columnName: string;
    //     }[];
    // }
    return {
        columnName: newColumnName,
        columnNameAs: astColumn.as,
        fromColumns,
    } as ColumnStructure;
}
