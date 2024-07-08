import { AST, Select, From, Column } from 'node-sql-parser';

import { parseAstWith } from './parseAstWith';
import { parseAstFrom } from './parseAstFrom';
import { parseAstColumn } from './parseAstColumn';
import { AbstractTableStructure, QueryStructure, ast2QueryStructureFunction, ColumnStructure } from "./types.d"
import { TableMap } from './tableMap';

// type='select'のASTを受け取って、QueryStructureを返す
export const parseAstSelect: ast2QueryStructureFunction = (
    ast: AST,
    parentTableMap: TableMap    // 親のスコープのテーブルマップ
) => {
    const astSelect: Select = ast as Select;

    // このselect内で使えるテーブルマップ
    const curTableMap: TableMap = parentTableMap.clone();   // まず親からコピー

    // withを解析
    let withTables: AbstractTableStructure[] | null = null;
    if (astSelect.with) {
        withTables = astSelect.with.map((w) => {
            return parseAstWith(w, curTableMap);
        });
    }

    // fromを解析
    let fromTables: AbstractTableStructure[] | null = null;
    if (astSelect.from) {
        fromTables = astSelect.from.reduce((
            accumFromClauses: AbstractTableStructure[],
            currentFromClause: From
        ) => {
            // fromを解析し、nullでなかったら追加する
            const result: AbstractTableStructure | null
                = parseAstFrom(currentFromClause, curTableMap);
            if (result) {
                return accumFromClauses.concat([result]);
            }

            // nullだったら何もしない
            return accumFromClauses;
        }, [] as AbstractTableStructure[]);
    }

    // columnを解析
    const columns: ColumnStructure[] | null = astSelect.columns.reduce((
        accumColumns: ColumnStructure[] | null,
        curAstColumn: any | Column,
    ) => {
        const parsedColumn: ColumnStructure | null
            = parseAstColumn(curAstColumn, curTableMap);
        if (!parsedColumn) {
            return accumColumns;
        }
        
        return (accumColumns)
            ? accumColumns.concat([parsedColumn])
            : [parsedColumn];
    }, null);


    return {
        withTables,
        fromTables,
        columns,
    } as QueryStructure;
}
