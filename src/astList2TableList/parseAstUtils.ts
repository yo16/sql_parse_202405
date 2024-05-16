import { Column, ExpressionValue, Expr, ExprList, Cast, ColumnRef, Function as NSPFunction } from 'node-sql-parser';
import { ParsedColumn, parseAstExpressionValueFunction } from '../types/types.d';
import { isColumn } from '../types/types';

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
export function parseSingleColumn(astColumn: any | Column): ParsedColumn[] | null {
/* eslint-enable @typescript-eslint/no-explicit-any */
    // anyだったらnull
    if ( !isColumn(astColumn) ){
        return null;
    }
    // typeがなかったらnull
    if ( !astColumn.type ){
        return null;
    }

    const extractedResults = parseAstExpressionValueFn[astColumn.type](astColumn.expr);
    if (extractedResults.length === 0){
        return null;
    }
    return extractedResults;
}


/* eslint-enable no-unused-vars */
// parseAstExpressionValueFnの関数群
/* eslint-disable no-unused-vars */
const unsupport: parseAstExpressionValueFunction = (expr: ExpressionValue) => {console.error(`Unsupported expr type! ${expr.type}`); return [];};
const parseExpressionValueAlter: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr);return [];};
const parseExpressionValueAggrFunc: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
const parseExpressionValueAnyValue: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
const parseExpressionValueWindowFunc: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
const parseExpressionValueArray: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
const parseExpressionValueAssign: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
const parseExpressionValueBinaryExpr: parseAstExpressionValueFunction = (expr: Expr) => {
    // left
    const leftArray = parseAstExpressionValueFn[expr.left.type](expr.left);
    
    // right
    const rightArray = parseAstExpressionValueFn[expr.right.type](expr.right);
    
    // 合わせて返す
    return leftArray.concat(rightArray);
};
const parseExpressionValueCase: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
const parseExpressionValueCast: parseAstExpressionValueFunction = (expr: Expr) => {
    // left
    const leftArray = parseAstExpressionValueFn[expr.left.type](expr.left);

    // right
    const rightArray = parseAstExpressionValueFn[expr.right.type](expr.right);

    // 合わせて返す
    return leftArray.concat(rightArray);
};
const parseExpressionValueColumn_ref: parseAstExpressionValueFunction = (expr: ExpressionValue) => {
    //return [{tableName: expr.table, columnName: expr.column}];
    const exprColumnRef: ColumnRef = expr as ColumnRef;
    // 値が直接入っている場合(columnが{expr:ValueExpr}の場合)は、なし
    if (typeof exprColumnRef.column === 'object') { return [];}

    return [{
        tableName: exprColumnRef.table ? exprColumnRef.table : '',
        columnName: exprColumnRef.column,
        fromColumns: [],
    }];
};
const parseExpressionValueDatatype: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
const parseExpressionValueExtract: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
const parseExpressionValueExprList: parseAstExpressionValueFunction = (expr: ExprList) => {
    return expr.value.flatMap((expr_val: ExpressionValue) => parseAstExpressionValueFn[expr_val.type](expr_val));
};
const parseExpressionValueFlatten: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
const parseExpressionValueFulltextSearch: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
const parseExpressionValueFunction: parseAstExpressionValueFunction = (expr: ExpressionValue) => {
    const exprFunction: NSPFunction = expr as NSPFunction;
    //return [].concat(...expr.args.value.map(v => parseAstExpressionValueFn[v.type](v)));
    if (!exprFunction.args) return [];

    // argsがExprListになっているので、その関数を呼ぶ
    return parseExpressionValueExprList(exprFunction.args);
};
const parseExpressionValueInsert: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
const parseExpressionValueInterval: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
const parseExpressionValueShow: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
const parseExpressionValueStruct: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
const parseExpressionValueTables: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
const parseExpressionValueUnnest: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
const parseExpressionValueWindow: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
const parseExpressionValueNumber: parseAstExpressionValueFunction = (expr: ExpressionValue) => {unsupport(expr); return [];};
/* eslint-enable no-unused-vars */
/* eslint-disable key-spacing */
const parseAstExpressionValueFn: Record<string, parseAstExpressionValueFunction> = {
    'alter'             : parseExpressionValueAlter,
    'aggr_func'         : parseExpressionValueAggrFunc,
    'any_value'         : parseExpressionValueAnyValue,
    'window_func'       : parseExpressionValueWindowFunc,
    'array'             : parseExpressionValueArray,
    'assign'            : parseExpressionValueAssign,
    'binary_expr'       : parseExpressionValueBinaryExpr,
    'case'              : parseExpressionValueCase,
    'cast'              : parseExpressionValueCast,
    'column_ref'        : parseExpressionValueColumn_ref,
    'datatype'          : parseExpressionValueDatatype,
    'extract'           : parseExpressionValueExtract,
    'expr_list'         : parseExpressionValueExprList,
    'flatten'           : parseExpressionValueFlatten,
    'fulltext_search'   : parseExpressionValueFulltextSearch,
    'function'          : parseExpressionValueFunction,
    'insert'            : parseExpressionValueInsert,
    'interval'          : parseExpressionValueInterval,
    'show'              : parseExpressionValueShow,
    'struct'            : parseExpressionValueStruct,
    'tables'            : parseExpressionValueTables,
    'unnest'            : parseExpressionValueUnnest,
    'window'            : parseExpressionValueWindow,
    'number'            : parseExpressionValueNumber,
};
/* eslint-enable key-spacing */
