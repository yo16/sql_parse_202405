// Type definitisions for sql-parser-202405

import { AST } from 'node-sql-parser';

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
export type ParsedTable = {
    name: string;
    // ほかも追加予定
};
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
    (_param: parseAstParams): ParsedTable[];
}

