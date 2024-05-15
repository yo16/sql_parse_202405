
import { parseAstParams, ParsedTable } from '../types/types.d';

export function parseSelectAst({name, ast, isTopQuery}: parseAstParams): ParsedTable[] {
    return [{
        name,
    }];
}
