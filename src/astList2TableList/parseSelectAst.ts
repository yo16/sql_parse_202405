import { Select } from 'node-sql-parser';
import { parseAstParams, ParsedTable, ParsedColumn, parseAstFunction } from '../types/types.d';
import { parseColumns } from './parseAstUtils';


export const parseSelectAst: parseAstFunction = ({name, ast, isTopQuery}: parseAstParams): ParsedTable[] => {
    // テーブル名
    const tableName: string = name;

    // astはSelect
    const astSel: Select = ast as Select;

    // astのColumnを解析
    const columns: ParsedColumn[] = parseColumns(astSel.columns);

    return [{
        tableName,
        columns: [],    // 追加予定
    }];
};
