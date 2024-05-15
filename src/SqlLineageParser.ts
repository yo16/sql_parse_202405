/*
クエリを解析して、
- テーブルごとの配列の形式にする
- テーブル間・列間の関係性を持つ
*/

import { SqlLineageParserParams } from './types/sql-parser-202405';
import { parseQuery } from './parseQuery/parseQuery';

function SqlLineageParser ({query, database = 'BigQuery'}: SqlLineageParserParams): void {
    // node-sql-parserを利用して結果を得る
    const astArray = parseQuery({query, database});

    // テーブル単位の配列に変換する
    // ast2TableArray()

    // 関係性を構築する
    // analyzeConnections()

    // 戻り値
    return;
}

export {
    SqlLineageParser,
};
