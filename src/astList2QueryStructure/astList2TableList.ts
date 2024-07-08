import { AST } from 'node-sql-parser';

import { TableStructureWithQuery } from "./types.d";
import { ast2QueryStructure } from './ast2QueryStructure';
import { TableMap, globalTableMap } from './tableMap';


// astリストをインプットし、TableStructureのリストにして返す
interface astList2QueryStructuresParams {
    astList: AST[];
};
export function astList2TableStructures(
    {astList}: astList2QueryStructuresParams
): TableStructureWithQuery[] {
    // このスコープ内のtableMapを生成
    const map: TableMap = new TableMap();

    // ASTを１つずつ調べる
    const tableList: TableStructureWithQuery[] = astList.map(
        (ast: AST, i: number) => {
            const newTableName = `__top_${i}__`;
            const newTableId = map.getTableIdByName(newTableName);

            return {
                tableId: newTableId,
                tableName: newTableName,
                tableNameAs: null,
                query: ast2QueryStructure(ast, map)
            } as TableStructureWithQuery;
        }
    );

    // 全テーブルを調べてみる（確認用）
    const tablesIterator = globalTableMap.createTableIterator();
    for (const idName of tablesIterator) {
        const id = idName.tableId;
        const nm = idName.tableName;
        console.log(`id:${id}, nm:${nm}`);
    }

    return tableList;
};

