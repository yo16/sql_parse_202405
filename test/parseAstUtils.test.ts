import { Cast, Column } from 'node-sql-parser';
import { parseSingleColumn } from '../src/astList2TableList/parseAstUtils';

describe('parseSingleColumn tests', () => {
    beforeEach(() => {
        // テストの前にスタブをリセット
        jest.resetAllMocks();
    });

    test('cast 1', () => {
        const col: Cast = {
            type: 'cast',
            keyword: 'cast',
            expr: { // Expr
                type: 'binary_expr',
                operator: 'string',
                left: {
                    type: 'column_ref',
                    table: 'table1',
                    column: 'column1',
                },
                right: {
                    type: 'column_ref',
                    table: 'table2',
                    column: 'column2',
                },
            },
            symbol: 'as',
            target: {
                dataType: 'dataType1',
                suffix: [],
            },
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

