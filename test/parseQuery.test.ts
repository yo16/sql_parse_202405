import { parseQuery } from '../src/parseQuery/parseQuery';

describe('parseQuery query-test', () => {
    test('query1', () => {
        const query = 'select col1 from t1';

        // 実行
        const ret = parseQuery({query});

        // （１件でも）配列であること
        expect(Array.isArray(ret)).toBeTruthy();
        expect(ret.length).toBe(1);
    });
});
