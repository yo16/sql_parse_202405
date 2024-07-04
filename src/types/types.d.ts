// Type definitisions for sql-parser-202405
/* eslint-disable no-unused-vars */

import { AST, ExpressionValue } from 'node-sql-parser';

// 解析後の列レベルの情報
// fromColumnsをParsedColumn[]とすると、子孫たちは各々ですべての先祖を持たないといけなくなる
export type ParsedColumn = {
    currentColumnName: string;
    fromColumns: TableColumnName[];
}
// 名前の部分
export type TableColumnName = {
    tableName: string | null;
    columnName: string | null;
}

// 解析後のテーブルレベルの情報
// ParsedColumnを内包する
// columnsの中では、テーブルをasのテーブル名で呼んでいるかもしれない
export type ParsedTable = {
    tableName: string;
    tableNameAs?: string | null;
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

// ExpressionValueを調べて、そのもととなっている列の配列を返す
// ParsedColumn.fromColumns へ設定されるべき値を返す
export interface parseAstExpressionValueFunction {
    (expr: ExpressionValue | Expr | ExprList): TableColumnName[];
}

/* eslint-enable no-unused-vars */
