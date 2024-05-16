
import { parseAstParams, ParsedTable, parseAstFunction } from '../types/types.d';

export const parseInsertAst: parseAstFunction = ({name, ast, isTopQuery}: parseAstParams): ParsedTable[] => {
    return [{
        tableName: name,
        columns: [],
    }];
};
