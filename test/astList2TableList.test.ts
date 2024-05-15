import { AST } from 'node-sql-parser';
import { parseAstParams, ParsedTable } from '../src/types/types.d';
import { ast2TableList } from '../src/astList2TableList/astList2TableList';
import * as pSA from '../src/astList2TableList/parseSelectAst'; 


describe('ast2TableList test!', () => {
    beforeEach(() => {
        // テストの前にスタブをリセット
        jest.resetAllMocks();
    });

    test('select 1, ', () => {
        // スタブを立てる
        /* eslint-disable no-unused-vars */
        const fn = ({name, ast, isTopQuery}:parseAstParams) => {
            return [{
                name: 'test',
            }] as ParsedTable[];
        };
        /* eslint-enable no-unused-vars */
        jest.spyOn(pSA, 'parseSelectAst').mockImplementation(fn);

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
        expect(result.length).toBe(1);
        expect(result[0].name).toBe('__top__');
    });
});
