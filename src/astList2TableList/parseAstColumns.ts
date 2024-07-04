import { Column, ExpressionValue } from 'node-sql-parser';
import { ParsedColumn } from '../types/types.d';
import { parseAstExpressionValueFn } from './parseAstExpr';
//import { isColumn } from '../types/types';

// 列群を解析
/* eslint-disable @typescript-eslint/no-explicit-any */
export function parseAstColumns(astColumns: any[] | Column[]): ParsedColumn[] {
/* eslint-enable @typescript-eslint/no-explicit-any */
    return astColumns.reduce((parsedCols, curCol) => {
        const curParsedCol = parseSingleColumn(curCol);
        // nullでなかったら、戻り値に追加
        if (curParsedCol) {
            parsedCols.push(curParsedCol);
        }
        return parsedCols;
    }, []);
}

// 列を１つ解析
/* eslint-disable @typescript-eslint/no-explicit-any */
export function parseSingleColumn(astColumn: any | Column): ParsedColumn | null {
/* eslint-enable @typescript-eslint/no-explicit-any */
    // anyもある！
    // ColumnとしてのExprのところで、ExpressionValueを使っている
    // もうそのまま突っ込む
    //// anyだったらnull
    //if ( !isColumn(astColumn) ){
    //    return null;
    //}

    // memo
    // Column.typeはいつ使われるのか？？
    //types.d.ts(173)
    //export interface Column {
    //    expr: ExpressionValue;
    //    as: string | null;
    //    type?: string;
    //    loc?: LocationRange;
    //}

    //pegjs/bigquery.pegjsを見るべき！？

    // expr.typeがなかったらnull
    if (( !astColumn.expr ) || ( !astColumn.expr.type )){
        return null;
    }

    // 新しい列名
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
    const tmpFromColumns = parseAstExpressionValueFn[expressionValueType](val);
    const fromColumns = tmpFromColumns? tmpFromColumns: [];
    const extractedResults: ParsedColumn = {
        currentColumnName: newColumnName,
        fromColumns,
    };
    return extractedResults;
}
