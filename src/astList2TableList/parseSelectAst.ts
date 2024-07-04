import { Select } from 'node-sql-parser';
import { parseAstParams, ParsedTable, ParsedColumn, parseAstFunction } from '../types/types.d';
import { parseColumns } from './parseAstColumns';


export const parseSelectAst: parseAstFunction = ({name, ast, isTopQuery}: parseAstParams): ParsedTable[] => {
    // テーブル名
    const tableName: string = name;

    // astはSelect
    const astSel: Select = ast as Select;

    // astのcolumnを解析
    const columns: ParsedColumn[] = parseColumns(astSel.columns);

    // astのfromを解析
    // よてい

    // astのwithを解析
    

    return [{
        tableName,
        columns: columns,    // 追加予定
    }];
};
