
import { parseAstParams, ParsedTable, parseAstFunction } from '../types/types.d';

export const parseSelectAst: parseAstFunction = ({name, ast, isTopQuery}: parseAstParams): ParsedTable[] => {
    return [{
        name,
    }];
};
