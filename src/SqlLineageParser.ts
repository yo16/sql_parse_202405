/*
クエリを解析して、
- テーブルごとの配列の形式にする
- テーブル間・列間の関係性を持つ
*/

import { SqlLineageParserParams } from './types/types.d';
import { parseQuery } from './parseQuery/parseQuery';
import { astList2TableStructures } from './astList2QueryStructure/astList2TableList';

function SqlLineageParser ({query, database = 'BigQuery'}: SqlLineageParserParams): void {
    // node-sql-parserを利用して結果を得る
    const {ast} = parseQuery({query, database});

    // テーブル単位の配列に変換する
    //const tableList2 = astList2TableList({astList: ast});
    const tableList2 = astList2TableStructures({astList: ast});

    // 関係性を構築する
    // analyzeConnections()

    // 戻り値
    return;
}

export {
    SqlLineageParser,
};


// testで使用するクエリ
// column
//SqlLineageParser({query: 'select col1 from t1'});
SqlLineageParser({query: 'select cast(col1 as float64) from t1'});
//SqlLineageParser({query: 'select case col1 when 1 then "one" when 2 then "two" else "else" end from t1'});
//SqlLineageParser({query: 'select case when col1 = 1 then "one" when col1 between 2 and 3 then "two-three" else col2 end from t1'});
//SqlLineageParser({query: 'select case when col1 is null then "null" when col1 in (1,2) then "one_or_tow" when col1 like "3%" then "like3" else "else" end from t1'});
//SqlLineageParser({query: 'select t1.* from db1.t1_origin as t1'});
//SqlLineageParser({query: 'select t1.col1 as t1_col1, t2.col2 as t2_col2 from db1.t1_origin as t1, db2.t2_origin as t2 where t1.col1=t2.col2'});

// from
//SqlLineageParser({query: 'select t2.col1 as col2 from t1 as t2'});
//SqlLineageParser({query: 'select t2.col1 as col2 from t1 as t2 inner join t3 using (col3, col4)'});
//SqlLineageParser({query: 'select t2.col1 as col2 from t1 inner join t2 on t1.col3 = t2.col4 and t1.col5 = t2.col6 and t1.col7 = t2.col8'});

//SqlLineageParser({query: 'select t1.col1 from (select t2.col2 as col1 from t2) as t1'});
//SqlLineageParser({query: 'select t1.col1, t3.col3 from (select t2.col2 as col1 from t2) as t1, (select t4.col4 as col3 from t4) as t3'});
//SqlLineageParser({query: 'select col1 from (select col2 as col1 from t1)'});
//SqlLineageParser({query: 'with tw1 as (select t1_col2 from (select col2 as t1_col2 from t1)) select tw1_col2 from (select t1_col2 as tw1_col2 from tw1)'});

// with
//SqlLineageParser({query: 'with t2 as (select t3.col3 as t3_col3 from t3) select t1.col1 as col_a, t2.t3_col3 as col_b from t1_origin as t1, t2'});
//SqlLineageParser({query: 'with t3 as (select t4.col4 as col3 from t4), t2 as (select t3.col3 as t3_col3 from t3) select t1.col1 as col_a, t2.t3_col3 as col_b from t1_origin as t1, t2'});

// 複数の無名テーブル
//'with tw1 as (select t1_col2 from (select col2 as t1_col2 from t1)) select tw1_col2 from (select t1_col2 as tw1_col2 from tw1)'

// 試行用
//SqlLineageParser({query: 'select cast(t1.col1 as float64) as aabb from t1, t2'});
//SqlLineageParser({query: 'select cast(t1.col1 as float64) as aabb, t1.col1 as ccdd from t1_origin as t1, t2'});
//SqlLineageParser({query: 'with t2 as (select t3.a as t3_a from t3) select cast(t1.col1 as float64) as aabb, t2.t3_a as t3_a2 from t1_origin as t1, t2'});
//SqlLineageParser({query: 'with t2 as (select t3.col3 as t3_col3 from t3) select t1.col1 as col_a, t2.t3_col3 as col_b from t1_origin as t1, t2'});
//SqlLineageParser({query: 'select * from t1_origin as t1'});
//SqlLineageParser({query: 'select t1.a as a1, t1.a+1 as a2 from t1'});
//SqlLineageParser({query: 'select col1 from t1'});
//SqlLineageParser({query: 'select t1_2.col1 as col1_2 from t1 as t1_2'});
//SqlLineageParser({query: 'select cast(col1 as float64) from t1'});
