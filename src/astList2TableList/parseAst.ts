import { parseAstFunction } from '../types/types.d';

import { parseSelectAst } from './parseSelectAst';
import { parseInsertAst } from './parseInsertAst';

// ast１つから必要な情報を抜き出し、テーブル単位の配列に変換する
// astのtypeによって読み取る関数が異なる
// typeごとの関数の定義
export const astParseFn: Record<string, parseAstFunction> = {
    'select': parseSelectAst,
    'insert': parseInsertAst,
};
