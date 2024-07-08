import { TableMap } from "./tableMap";

// 列
export interface ColumnStructure {
    columnName: string;
    columnNameAs: string | null;
    fromColumns: {
        tableId: number | null;
        columnName: string;
    }[];
}
export type TableColumnName = {
    tableName: string | null;
    columnName: string | null;
}

// テーブル
export interface AbstractTableStructure {
    tableId: number;
    tableName: string | null;
    tableNameAs: string | null;
}
// 問い合わせる場合
export interface TableStructureWithQuery extends AbstractTableStructure {
    query: QueryStructure;
}
// 直接の場合
export interface TableStructureDB extends AbstractTableStructure {
    columns: ColumnStructure[];
}

// クエリ
export interface QueryStructure {
    withTables: AbstractTableStructure[] | null;
    fromTables: AbstractTableStructure[] | null;
    columns: ColumnStructure[] | null;
}


// ASTの解析関数のインタフェース
// ASTを受け取って、StatementQueryを返す
export interface ast2QueryStructureFunction {
    (
        ast: AST,
        parentTableMap: TableMap,
    ): QueryStructure;
}
