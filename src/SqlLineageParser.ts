/*
クエリを解析して、
- テーブルごとの配列の形式にする
- テーブル間・列間の関係性を持つ
*/

import { SqlLineageParserParams } from './types/types';
import { parseQuery } from './parseQuery/parseQuery';
import { astList2TableList } from './astList2TableList/astList2TableList';

function SqlLineageParser ({query, database = 'BigQuery'}: SqlLineageParserParams): void {
    // node-sql-parserを利用して結果を得る
    const astList = parseQuery({query, database});

    // テーブル単位の配列に変換する
    const tableList = astList2TableList({astList});

    // 関係性を構築する
    // analyzeConnections()

    // 戻り値
    return;
}

export {
    SqlLineageParser,
};
