import { Select } from 'node-sql-parser';
import { parseAstParams, ParsedTable, ParsedColumn, parseAstFunction } from '../types/types.d';
import { parseColumns } from './parseAstColumns';
import { parseAstWith } from './parseAstWith';


export const parseSelectAst: parseAstFunction = ({name, ast, isTopQuery}: parseAstParams): ParsedTable[] => {
    // このクエリから抽出されるテーブル群情報
    let tables: ParsedTable[] = [];

    const astSel: Select = ast as Select;

    // Selectの最終クエリの解析
    tables.push(
        {
            tableName: name,
            columns: parseColumns((astSel).columns),
        }
    );

    // astのfromを解析
    // よてい

    // astのwithを解析
    tables = tables.concat(parseAstWith(astSel.with));

    return tables;
};
