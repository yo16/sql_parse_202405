import { Select } from 'node-sql-parser';
import { parseAstParams, ParsedTable, ParsedColumn, parseAstFunction } from '../types/types.d';
import { parseAstColumns } from './parseAstColumns';
import { parseAstFrom } from './parseAstFrom';
import { parseAstWith } from './parseAstWith';


export const parseSelectAst: parseAstFunction = ({name, ast, isTopQuery}: parseAstParams): ParsedTable[] => {
    // このクエリから抽出されるテーブル群情報
    let tables: ParsedTable[] = [];

    const astSel: Select = ast as Select;

    // Selectの最終クエリの解析
    tables.push(
        {
            tableName: name,
            columns: parseAstColumns((astSel).columns),
        }
    );

    // astのfromを解析
    tables = tables.concat(parseAstFrom(astSel.from));

    // astのwithを解析
    tables = tables.concat(parseAstWith(astSel.with));

    return tables;
};
