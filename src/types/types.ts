
import { AST } from 'node-sql-parser';

// このモジュール的に、この条件を満たせばASTと呼ぶ
export function myIsAst(value: unknown): value is AST {
    if (!value) { return false; }
    if (typeof value !== 'object') { return false; }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    return (
        ('type' in value) &&
        ('columns' in value) &&
        (Array.isArray((value as any).columns)) &&
        ('from' in value) &&
        (Array.isArray((value as any).from)) &&
        ('with' in value) &&
        (Array.isArray((value as any).with))
    );
    /* eslint-enable @typescript-eslint/no-explicit-any */
}
