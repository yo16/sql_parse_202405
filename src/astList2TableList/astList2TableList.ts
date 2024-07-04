// SQLの構造形式になっているASTを、テーブル単位の配列に変換する
// 具体的にはParsedTableの配列

import { AST } from 'node-sql-parser';

import { astList2TableListParams, ParsedTable, ast2TableListParams } from '../types/types.d';
import { astParseFn } from './parseAst';
import { TOP_STMT_TABLE_NAME } from '../types/const';

// SQLの構造形式になっているASTを、テーブル単位の配列に変換する
export function astList2TableList({ astList }: astList2TableListParams): ParsedTable[] {
    // astをバラしてast2TableList()を呼び出す
    // その戻り値は、ParsedTable[]なので、それをflat化して、この関数の戻り値とする
    return astList.flatMap(( ast:AST ) => ast2TableList({ast}));
}

export function ast2TableList({ast, name = null}: ast2TableListParams): ParsedTable[] {
    // 未知のtypeの場合はエラー
    if (!(ast.type in astParseFn)) {
        throw Error('Unknown AST type. ${ast.type}');
    }
    
    // typeごとの関数を呼び出して返す
    return astParseFn[ast.type]({
        name: name ? name : TOP_STMT_TABLE_NAME,
        ast,
        isTopQuery: true,       // ここから呼び出すものはtop
    });
}
