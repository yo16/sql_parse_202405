import { parseQuery } from '../src/parseQuery/parseQuery';

describe('normal test', () => {
    test('normal query1', () => {
        const query = 'select col1 from t1';

        // 実行
        const ret = parseQuery({query});

        // （１件でも）配列であること
        expect(Array.isArray(ret)).toBeTruthy();
        expect(ret.length).toBe(1);
    });
});

describe('abnormal test', () => {
    test('abnormal query1', () => {
        const query = 'select col1 form t1';    // fromがformになっている誤り
        
        // 実行
        expect(() => {
            parseQuery({query});
        }).toThrow(Error);
    });
});
