// クエリをパースする

import { Parser, Option as NSPOption, AST } from 'node-sql-parser';

import { parseQueryParams } from '../types/types.d';

// node-sql-parser instance
const parser = new Parser();


// パース実行
export function parseQuery({ query, database = 'BigQuery' }: parseQueryParams): {ast:AST[], tableList:string[], columnList:string[]} {
    let ast: AST[];
    let tableList: string[];
    let columnList: string[];
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
        tableList = ret.tableList;
        columnList = ret.columnList;
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

    return {ast, tableList, columnList};
}

// for debug
//parseQuery({query: 'select col1 from t1'});
parseQuery({query: 'select cast(col1 as float64) from t1'});
