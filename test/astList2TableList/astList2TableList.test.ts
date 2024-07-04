import { AST } from 'node-sql-parser';
import { parseAstParams, ParsedTable } from '@src/types/types.d';
//import { parseAstParams, ParsedTable } from '../../src/types/types.d';
import { ast2TableList } from '@src/astList2TableList/astList2TableList';
import * as pSelA from '@src/astList2TableList/parseSelectAst'; 
import * as pInsA from '@src/astList2TableList/parseInsertAst'; 


const TEST_NAME = "T_AL2TL";

let desc = `${TEST_NAME}_OK`;
describe(desc, () => {
    beforeEach(() => {
        // テストの前にスタブをリセット
        jest.resetAllMocks();
    });

    test(`${desc}_select 1`, () => {
        // Selectスタブを立てる
        /* eslint-disable no-unused-vars */
        const fn = ({name, ast, isTopQuery}:parseAstParams) => {
            return [{
                tableName: 'test',
            }] as ParsedTable[];
        };
        /* eslint-enable no-unused-vars */
        jest.spyOn(pSelA, 'parseSelectAst').mockImplementation(fn);

        // テスト
        const testAst: unknown = {
            type: 'select',
            from: [{ db: null, table: 'table1', as: null }],
            columns: [{ expr: { type: 'column_ref', table: null, column: '*' }, as: null }],
            where: null,
            groupby: null,
            having: null,
            orderby: null,
            limit: null,
            offset: null,
            with: [],
        };
        const result = ast2TableList({
            name: '',
            ast: testAst as AST,
        });
        expect(Array.isArray(result)).toBeTruthy();
        expect(result.length).toBe(2);  // selectとfrom
        expect(result[0].tableName).toBe('__top__');
    });

    test(`${desc}_insert 1`, () => {
        // insertスタブを立てる
        /* eslint-disable no-unused-vars */
        const fn = ({name, ast, isTopQuery}:parseAstParams) => {
            return [{
                tableName: 'test',
            }] as ParsedTable[];
        };
        /* eslint-enable no-unused-vars */
        jest.spyOn(pInsA, 'parseInsertAst').mockImplementation(fn);

        // テスト
        const testAst: unknown = {
            type: 'insert',
            from: [{ db: null, table: 'table1', as: null }],
            columns: [{ expr: { type: 'column_ref', table: null, column: '*' }, as: null }],
            where: null,
            groupby: null,
            having: null,
            orderby: null,
            limit: null,
            offset: null,
            with: [],
        };
        const result = ast2TableList({
            name: '',
            ast: testAst as AST,
        });
        expect(Array.isArray(result)).toBeTruthy();
        expect(result.length).toBe(1);
        expect(result[0].tableName).toBe('__top__');
    });
});


desc = `${TEST_NAME}_NG`;
describe(desc, () => {
    beforeEach(() => {
        // テストの前にスタブをリセット
        jest.resetAllMocks();
    });

    test(`${desc}_未定義のtypeの場合はErrorがthrowされる`, () => {
        // テスト
        const testAst: unknown = {
            type: 'unknown_type',
            from: [{ db: null, table: 'table1', as: null }],
            columns: [{ expr: { type: 'column_ref', table: null, column: '*' }, as: null }],
            where: null,
            groupby: null,
            having: null,
            orderby: null,
            limit: null,
            offset: null,
            with: [],
        };
        expect(() => {
            ast2TableList({
                name: '',
                ast: testAst as AST,
            });
        }).toThrow(Error);
    });
});
