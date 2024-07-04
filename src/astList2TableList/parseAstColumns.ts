import { Column, ExpressionValue, Expr, ExprList, Case, Cast, ColumnRef, Function as NSPFunction } from 'node-sql-parser';
import { ParsedColumn, parseAstExpressionValueFunction } from '../types/types.d';
import type { TableColumnName } from '../types/types.d';
//import { isColumn } from '../types/types';

// 列群を解析
/* eslint-disable @typescript-eslint/no-explicit-any */
export function parseColumns(astColumns: any[] | Column[]): ParsedColumn[] {
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


/* eslint-enable no-unused-vars */
// parseAstExpressionValueFnの関数群
/* eslint-disable no-unused-vars */
const unsupport: parseAstExpressionValueFunction = (expr: ExpressionValue) => {console.error(`Unsupported expr type! ${expr.type}`); return [];};
//const parseExpressionValueAlter: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr);return [];};
const parseExpressionValueAggrFunc: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
//const parseExpressionValueAnyValue: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
//const parseExpressionValueWindowFunc: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
//const parseExpressionValueArray: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
//const parseExpressionValueAssign: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
const parseExpressionValueBinaryExpr: parseAstExpressionValueFunction = (expr: Expr) => {
    let names: TableColumnName[] = [];

    names = names.concat( parseAstExpressionValueFn[expr.left.type](expr.left) );
    names = names.concat( parseAstExpressionValueFn[expr.right.type](expr.right) );

    return names;
};
const parseExpressionValueCase: parseAstExpressionValueFunction = (exprVal: ExpressionValue) => {
    const exprCase: Case = exprVal as Case;

    // 各argsのcondとresutを確認
    const names: TableColumnName[] = exprCase.args.reduce((tmpNames, curArg) => {
        // 更新するので、変数をコピーしておく
        let curNames: TableColumnName[] = tmpNames.concat();

        // whenの場合だけ、cond
        if (curArg.type === 'when') {
            curNames = curNames.concat(parseAstExpressionValueFn[curArg.cond.type](curArg.cond));
        }

        // when, elseの両方とも、result
        if (curArg.result.type === 'column_ref') {
            curNames = curNames.concat(parseAstExpressionValueFn[curArg.result.type](curArg.result));
        }

        return curNames;
    }, [] as TableColumnName[]);

    return names;
};
const parseExpressionValueCast: parseAstExpressionValueFunction = (exprVal: ExpressionValue) => {
    const exprCast: Cast = exprVal as Cast;
    const childExprVal: ExpressionValue = exprCast.expr as unknown as ExpressionValue;
    // Cast.exprは、ExprでなくExpressionValueが入っている.（leftなどがない）
    // types.d.ts(140)のCastのinterfaceでは、Exprと定義されているが、なぜかわからない.

    const exprValArray = parseAstExpressionValueFn[childExprVal.type](childExprVal);

    return exprValArray;
};
const parseExpressionValueColumn_ref: parseAstExpressionValueFunction = (expr: ExpressionValue) => {
    //return [{tableName: expr.table, columnName: expr.column}];
    const exprColumnRef: ColumnRef = expr as ColumnRef;
    // 値が直接入っている場合(columnが{expr:ValueExpr}の場合)は、なし
    if (typeof exprColumnRef.column === 'object') { return [];}

    return [{
        tableName: exprColumnRef.table,
        columnName: exprColumnRef.column,
    }];
};
//const parseExpressionValueDatatype: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
//const parseExpressionValueExtract: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
const parseExpressionValueExprList: parseAstExpressionValueFunction = (exprList: ExprList) => {
    
    const names: TableColumnName[] = exprList.value.reduce((tmpNames, curVal) => {
        // value要素をExpressionValueとみなして追加
        return tmpNames.concat(parseAstExpressionValueFn[curVal.type](curVal));
    }, [] as TableColumnName[]);

    return names;
};
//const parseExpressionValueFlatten: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
//const parseExpressionValueFulltextSearch: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
const parseExpressionValueFunction: parseAstExpressionValueFunction = (expr: ExpressionValue) => {
    const exprFunction: NSPFunction = expr as NSPFunction;
    //return [].concat(...expr.args.value.map(v => parseAstExpressionValueFn[v.type](v)));
    if (!exprFunction.args) return [];

    // argsがExprListになっているので、その関数を呼ぶ
    return parseExpressionValueExprList(exprFunction.args);
};
//const parseExpressionValueInsert: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
const parseExpressionValueInterval: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
const parseExpressionValueParam: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
//const parseExpressionValueShow: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
//const parseExpressionValueStruct: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
//const parseExpressionValueTables: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
//const parseExpressionValueUnnest: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
//const parseExpressionValueWindow: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
const parseExpressionValueNumber: parseAstExpressionValueFunction = (expr: ExpressionValue | Expr) => {
    // 列を参照していないので空を返す
    return [];
};
const parseExpressionValueString: parseAstExpressionValueFunction = (expr: ExpressionValue | Expr) => {
    // 列を参照していないので空を返す
    return [];
};
/* eslint-enable no-unused-vars */
/* eslint-disable key-spacing */
export const parseAstExpressionValueFn: Record<string, parseAstExpressionValueFunction> = {
    // type ExpressionValue
    'column_ref'        : parseExpressionValueColumn_ref,
    'param'               : parseExpressionValueParam,
    'function'          : parseExpressionValueFunction,
    'case'              : parseExpressionValueCase,
    'aggr_func'         : parseExpressionValueAggrFunc,
    'cast'              : parseExpressionValueCast,
    'interval'          : parseExpressionValueInterval,

    //'alter'             : parseExpressionValueAlter,
    //'any_value'         : parseExpressionValueAnyValue,
    //'window_func'       : parseExpressionValueWindowFunc,
    //'array'             : parseExpressionValueArray,
    //'assign'            : parseExpressionValueAssign,
    'binary_expr'       : parseExpressionValueBinaryExpr,
    //'datatype'          : parseExpressionValueDatatype,
    //'extract'           : parseExpressionValueExtract,
    'expr_list'         : parseExpressionValueExprList,
    //'flatten'           : parseExpressionValueFlatten,
    //'fulltext_search'   : parseExpressionValueFulltextSearch,
    //'insert'            : parseExpressionValueInsert,
    //'show'              : parseExpressionValueShow,
    //'struct'            : parseExpressionValueStruct,
    //'tables'            : parseExpressionValueTables,
    //'unnest'            : parseExpressionValueUnnest,
    //'window'            : parseExpressionValueWindow,
    'number'            : parseExpressionValueNumber,
    'string'            : parseExpressionValueString,
};
/* eslint-enable key-spacing */
