import { Select, Column, ExpressionValue, ColumnRef, BaseFrom } from 'node-sql-parser';
import type { From } from 'node-sql-parser';
import { parseQuery } from '@src/parseQuery/parseQuery';

const TEST_NAME = "T_PQ";

let desc = `${TEST_NAME}_OK`;
describe(desc, () => {

    test(`${desc}: query1`, () => {
        const query = 'select col1 from t1';
        const expectedAst0 = {
            columns: [
                {
                    as: null,
                    expr: {
                        type: 'column_ref',
                        table: null,
                        column: 'col1',
                    },
                }
            ],
            from: [
                {
                    as: null,
                    db: null,
                    table: 't1',
                },
            ],
        };

        // 実行
        const ret = parseQuery({query});

        // astのテスト
        expect(ret.ast[0]).toMatchObject(expectedAst0);
    });


    test(`${desc}: query2-ExpressionValue cast`, () => {
        const query = 'select cast(col1 as float64) from t1';
        const expectedAst0 = {
            columns: [
                {
                    as: null,
                    expr: {
                        type: 'cast',
                        keyword: 'cast',
                        target: {
                            dataType: 'FLOAT64',
                        },
                        expr: {
                            type: 'column_ref',
                            table: null,
                            column: 'col1',
                        },
                    },
                },
            ],
            from: [
                {
                    as: null,
                    db: null,
                    table: 't1',
                },
            ]
        };

        // 実行
        const ret = parseQuery({query});

        // astのテスト
        expect(ret.ast[0]).toMatchObject(expectedAst0);
    });


    test(`${desc}: query2-ExpressionValue case 2`, () => {
        const query = 'select case col1 when 1 then "one" when 2 then "two" else "else" end from t1';
        const expectedAst0 = {
            columns: [
                {
                    as: null,
                    expr: {
                        type: 'case',
                        expr: {
                            type: 'column_ref',
                            table: null,
                            column: 'col1',
                        },
                        args: [
                            {
                                type: 'when',
                                cond: {
                                    type: 'number',
                                    value: 1,
                                },
                                result: {
                                    type: 'string',
                                    value: 'one',
                                }
                            },
                            {
                                type: 'when',
                                cond: {
                                    type: 'number',
                                    value: 2,
                                },
                                result: {
                                    type: 'string',
                                    value: 'two',
                                }
                            },
                            {
                                type: 'else',
                                result: {
                                    type: 'string',
                                    value: 'else',
                                }
                            },
                        ],
                    },
                },
            ],
            from: [
                {
                    as: null,
                    db: null,
                    table: 't1',
                },
            ]
        };

        // 実行
        const ret = parseQuery({query});

        // astのテスト
        expect(ret.ast[0]).toMatchObject(expectedAst0);
    });
    

    test(`${desc}: query2-ExpressionValue case 2`, () => {
        const query = 'select case when col1 = 1 then "one" when col1 between 2 and 3 then "two-three" else col2 end from t1';
        const expectedAst0 = {
            columns: [
                {
                    as: null,
                    expr: {
                        type: 'case',
                        expr: null,
                        args: [
                            {
                                type: 'when',
                                cond: {
                                    type: 'binary_expr',
                                    operator: '=',
                                    left: {
                                        type: 'column_ref',
                                        column: 'col1',
                                        table: null,
                                    },
                                    right: {
                                        type: 'number',
                                        value: 1,
                                    }
                                },
                                result: {
                                    type: 'string',
                                    value: 'one',
                                }
                            },
                            {
                                type: 'when',
                                cond: {
                                    type: 'binary_expr',
                                    operator: 'BETWEEN',
                                    left: {
                                        type: 'column_ref',
                                        table: null,
                                        column: 'col1',
                                    },
                                    right: {
                                        type: 'expr_list',
                                        value: [
                                            {
                                                type: 'number',
                                                value: 2,
                                            },
                                            {
                                                type: 'number',
                                                value: 3,
                                            },
                                        ],
                                    },
                                },
                                result: {
                                    type: 'string',
                                    value: 'two-three',
                                },
                            },
                            {
                                type: 'else',
                                result: {
                                    type: 'column_ref',
                                    table: null,
                                    column: 'col2',
                                }
                            },
                        ],
                    },
                },
            ],
            from: [
                {
                    as: null,
                    db: null,
                    table: 't1',
                },
            ]
        };

        // 実行
        const ret = parseQuery({query});

        // astのテスト
        expect(ret.ast[0]).toMatchObject(expectedAst0);
    });
    

    test(`${desc}: query2-ExpressionValue case 3`, () => {
        const query = 'select case when col1 is null then "null" when col1 in (1,2) then "one_or_tow" when col1 like "3%" then "like3" else "else" end from t1';
        const expectedAst0 = {
            columns: [
                {
                    as: null,
                    expr: {
                        type: 'case',
                        expr: null,
                        args: [
                            {
                                type: 'when',
                                cond: {
                                    type: 'binary_expr',
                                    operator: 'IS',
                                    left: {
                                        type: 'column_ref',
                                        table: null,
                                        column: 'col1',
                                    },
                                    right: {
                                        type: 'null',
                                        value: null,
                                    }
                                },
                                result: {
                                    type: 'string',
                                    value: 'null',
                                }
                            },
                            {
                                type: 'when',
                                cond: {
                                    type: 'binary_expr',
                                    operator: 'IN',
                                    left: {
                                        type: 'column_ref',
                                        table: null,
                                        column: 'col1',
                                    },
                                    right: {
                                        type: 'expr_list',
                                        value: [
                                            {
                                                type: 'number',
                                                value: 1,
                                            },
                                            {
                                                type: 'number',
                                                value: 2,
                                            },
                                        ],
                                    },
                                },
                                result: {
                                    type: 'string',
                                    value: 'one_or_tow',
                                },
                            },
                            {
                                type: 'when',
                                cond: {
                                    type: 'binary_expr',
                                    operator: 'LIKE',
                                    left: {
                                        type: 'column_ref',
                                        table: null,
                                        column: 'col1',
                                    },
                                    right: {
                                        type: 'string',
                                        value: '3%',
                                    },
                                },
                                result: {
                                    type: 'string',
                                    value: 'like3',
                                },
                            },
                            {
                                type: 'else',
                                result: {
                                    type: 'string',
                                    value: 'else',
                                }
                            },
                        ],
                    },
                },
            ],
            from: [
                {
                    as: null,
                    db: null,
                    table: 't1',
                },
            ]
        };

        // 実行
        const ret = parseQuery({query});

        // astのテスト
        expect(ret.ast[0]).toMatchObject(expectedAst0);
    });


    test(`${desc}: query3 star, table rename`, () => {
        const query = 'select t1.* from db1.t1_origin as t1';
        const expectedAst0 = {
            columns: [
                {
                    as: null,
                    expr: {
                        type: 'column_ref',
                        table: 't1',
                        column: '*',
                    },
                },
            ],
            from: [
                {
                    as: 't1',
                    db: 'db1',
                    table: 't1_origin',
                },
            ],
        };

        // 実行
        const ret = parseQuery({query});

        // astのテスト
        expect(ret.ast[0]).toMatchObject(expectedAst0);
    });


    test(`${desc}: query4 multi columns & tables`, () => {
        const query = 'select t1.col1 as t1_col1, t2.col2 as t2_col2 from db1.t1_origin as t1, db2.t2_origin as t2 where t1.col1=t2.col2';
        const expectedAst0 = {
            columns: [
                {
                    as: 't1_col1',
                    expr: {
                        type: 'column_ref',
                        table: 't1',
                        column: 'col1',
                    },
                },
                {
                    as: 't2_col2',
                    expr: {
                        type: 'column_ref',
                        table: 't2',
                        column: 'col2',
                    },
                },
            ],
            from: [
                {
                    as: 't1',
                    db: 'db1',
                    table: 't1_origin',
                },
                {
                    as: 't2',
                    db: 'db2',
                    table: 't2_origin',
                },
            ],
        };

        // 実行
        const ret = parseQuery({query});

        // astのテスト
        expect(ret.ast[0]).toMatchObject(expectedAst0);
    });


    test(`${desc}: query5 with`, () => {
        const query = 'with t2 as (select t3.col3 as t3_col3 from t3) select t1.col1 as col_a, t2.t3_col3 as col_b from t1_origin as t1, t2';
        const expectedAst0 = {
            columns: [
                {
                    as: 'col_a',
                    expr: {
                        type: 'column_ref',
                        table: 't1',
                        column: 'col1',
                    },
                },
                {
                    as: 'col_b',
                    expr: {
                        type: 'column_ref',
                        table: 't2',
                        column: 't3_col3',
                    },
                },
            ],
            from: [
                {
                    as: 't1',
                    db: null,
                    table: 't1_origin',
                },
                {
                    as: null,
                    db: null,
                    table: 't2',
                },
            ],
            with: [
                {
                    name: {
                        value: 't2',
                    },
                    stmt: {
                        ast: {
                            type: 'select',
                            columns: [
                                {
                                    as: 't3_col3',
                                    expr: {
                                        type: 'column_ref',
                                        table: 't3',
                                        column: 'col3',
                                    },
                                },
                            ],
                            from: [
                                {
                                    db: null,
                                    table: 't3',
                                    as: null,
                                },
                            ],
                        },
                    },
                },
            ],
        };

        // 実行
        const ret = parseQuery({query});

        // astのテスト
        expect(ret.ast[0]).toMatchObject(expectedAst0);
    });


    test(`${desc}: query5 two withs`, () => {
        const query = 'with t3 as (select t4.col4 as col3 from t4), ' + 
            't2 as (select t3.col3 as t3_col3 from t3) ' +
            'select t1.col1 as col_a, t2.t3_col3 as col_b from t1_origin as t1, t2';
        const expectedAst0 = {
            columns: [
                {
                    as: 'col_a',
                    expr: {
                        type: 'column_ref',
                        table: 't1',
                        column: 'col1',
                    },
                },
                {
                    as: 'col_b',
                    expr: {
                        type: 'column_ref',
                        table: 't2',
                        column: 't3_col3',
                    },
                },
            ],
            from: [
                {
                    as: 't1',
                    db: null,
                    table: 't1_origin',
                },
                {
                    as: null,
                    db: null,
                    table: 't2',
                },
            ],
            with: [
                {
                    name: {
                        type: 'default',
                        value: 't3',
                    },
                    stmt: {
                        ast: {
                            type: 'select',
                            columns: [
                                {
                                    as: 'col3',
                                    expr: {
                                        type: 'column_ref',
                                        table: 't4',
                                        column: 'col4',
                                    },
                                },
                            ],
                            from: [
                                {
                                    db: null,
                                    table: 't4',
                                    as: null,
                                },
                            ],
                        },
                    },
                },
                {
                    name: {
                        type: 'default',
                        value: 't2',
                    },
                    stmt: {
                        ast: {
                            type: 'select',
                            columns: [
                                {
                                    as: 't3_col3',
                                    expr: {
                                        type: 'column_ref',
                                        table: 't3',
                                        column: 'col3',
                                    },
                                },
                            ],
                            from: [
                                {
                                    db: null,
                                    table: 't3',
                                    as: null,
                                },
                            ],
                        },
                    },
                },
            ],
        };

        // 実行
        const ret = parseQuery({query});

        // astのテスト
        expect(ret.ast[0]).toMatchObject(expectedAst0);
    });
});


desc = `${TEST_NAME}_NG`;
describe(desc, () => {
    test(`${desc}: query1`, () => {
        const query = 'select col1 form t1';    // fromがformになっている誤り
        
        // 実行
        expect(() => {
            parseQuery({query});
        }).toThrow(Error);
    });
});

