import { With } from "node-sql-parser";

import { parseAstSelect } from "./parseAstSelect";
import { TableStructureWithQuery, QueryStructure } from "./types.d";
import { TableMap } from "./tableMap";

// Withを１つ解析して、TableStructureを返す
export function parseAstWith(
    withClause: With,
    parentTableMap: TableMap
): TableStructureWithQuery {
    // with句の名前（テーブル名）
    const tableName = withClause.name.value;

    // テーブルIDを発行
    // withのテーブル名は、親のスコープ内なので、parentTableMapに追加する
    const tableId: number = parentTableMap.getTableIdByName(tableName);

    // astを解析
    const queryStructure: QueryStructure = parseAstSelect(
        withClause.stmt.ast,
        parentTableMap,
    );

    return {
        tableId: tableId,
        tableName: tableName,
        tableNameAs: null,
        query: queryStructure,
    } as TableStructureWithQuery;
}
