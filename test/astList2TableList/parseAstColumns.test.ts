import { Cast, Column } from 'node-sql-parser';
import { parseSingleColumn } from '@src/astList2TableList/parseAstColumns';

const TEST_NAME = "T_PAC";

let desc = `${TEST_NAME}_OK`;
describe(desc, () => {
    test(`${desc}: query1`, () => {

    });
});
/*
describe('parseSingleColumn tests', () => {
    beforeEach(() => {
        // テストの前にスタブをリセット
        jest.resetAllMocks();
    });

    test('cast 1', () => {
        const col = {
            expr: {
                type: 'cast',
                keyword: 'cast',
                expr: { // ColumnだとExprだが、実際はanyで、ExpressionValueが入っている(node-sql-parser 5.1.0 時点)
                    type: 'column_ref',
                    table: 'table1',
                    column: 'column1',
                },
                symbol: 'as',
                target: {
                    dataType: 'FLOAT64',
                    suffix: [],
                },
            },
            as: null,
        };
        const parsedColumns = parseSingleColumn(col);
        expect(parsedColumns).not.toBeNull();
        if (!parsedColumns) return;
        expect(parsedColumns.length).toBe(2);
        expect(parsedColumns[0].columnName).toBe('column1');
        expect(parsedColumns[0].tableName).toBe('table1');
        expect(parsedColumns[1].columnName).toBe('column2');
        expect(parsedColumns[1].tableName).toBe('table2');
    });

    test('column_ref 1', () => {
        const col: Column = {
            type: 'column_ref',
            expr: {
                type: 'column_ref',
                table: 'table1',
                column: 'column1',
            },
            as: null,
        };
        const parsedColumns = parseSingleColumn(col);
        expect(parsedColumns).not.toBeNull();
        if (!parsedColumns) return;
        expect(parsedColumns.length).toBe(1);
        expect(parsedColumns[0].columnName).toBe('column1');
        expect(parsedColumns[0].tableName).toBe('table1');
    });
});


*/
