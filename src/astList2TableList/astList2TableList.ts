// SQLの構造形式になっているASTを、テーブル単位の配列に変換する

import { AST } from 'node-sql-parser';

import { astList2TableListParams, ParsedTable, parseAstParams, ast2TableListParams } from '../types/types.d';
import { TOP_STMT_TABLE_NAME } from '../types/const';

import { parseSelectAst } from './parseSelectAst';

// SQLの構造形式になっているASTを、テーブル単位の配列に変換する
export function astList2TableList({ astList }: astList2TableListParams): ParsedTable[] {
    return astList.flatMap(( ast:AST ) => ast2TableList({ast}));
}

// ast１つから必要な情報を抜き出し、テーブル単位の配列に変換する
// astのtypeによって読み取る関数が異なる
// typeごとの関数の定義
export const astParseFn: Record<string, (_param: parseAstParams) => ParsedTable[]> = {
    'select': parseSelectAst,
};
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
