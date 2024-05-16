// Type definitisions for sql-parser-202405
/* eslint-disable no-unused-vars */

import { AST, ExpressionValue } from 'node-sql-parser';

// 解析後の列レベルの情報
export type ParsedColumn = {
    tableName: string;
    columnName: string;
    fromColumns: ParsedColumn[];
}
// 解析後のテーブルレベルの情報
// ParsedColumnを内包する
export type ParsedTable = {
    tableName: string;
    columns: ParsedColumn[];
};


export interface SqlLineageParserParams {
    query: string;
    database?: string;
}

// parseQuery
export interface parseQueryParams {
    query: string;
    database?: string;
}

// astList2TableList
export interface astList2TableListParams {
    astList: AST[];
}
export interface ast2TableListParams {
    ast: AST;
    name?: string | null;
}

// typeごとのパース関数
export interface parseAstParams {
    name: string;
    ast: AST;
    isTopQuery: boolean;
}
export interface parseAstFunction {
    (param: parseAstParams): ParsedTable[];
}

export interface parseAstExpressionValueFunction {
    (expr: ExpressionValue | Expr | ExprList): ParsedColumn[];
}

/* eslint-enable no-unused-vars */
