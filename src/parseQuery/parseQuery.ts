// クエリをパースする

import { Parser, Option as NSPOption, AST } from 'node-sql-parser';

import { parseQueryParams } from '../types/types.d';

// node-sql-parser instance
const parser = new Parser();


// パース実行
export function parseQuery({ query, database = 'BigQuery' }: parseQueryParams): AST[] {
    let ast: AST[];
    try {
        const opt: NSPOption = {
            database,
        };
        const ret = parser.parse(query, opt);
        if (Array.isArray(ret.ast)) {
            ast = ret.ast;
        } else {
            ast = [ret.ast];
        }
        //console.log(ast);
    } catch(e: unknown) {
        //console.error('Error at Parser.parse().');
        //console.error('e.message');
        if ( e instanceof Error ){
            throw new Error(`Error in Parsing-Process: ${e.message}`);
        } else {
            throw new Error('Error in Parsing-Process.');
        }
    }

    return ast;
}

// for debug
parseQuery({query: 'select col1 from t1'});
