/* テーブルとIDを管理するクラス
- スコープに応じて作るため、上位から受け取ったテーブル群をコピーして、新たにローカル用のクラスを作るということが多くなる
*/

// グローバルなTableMap
// 各スコープ内で使うTableMapで、新しくテーブルが定義されると、ここにも登録される
class GlobalTableMap {
    lastTableId: number;

    // テーブル名とIDの配列
    // 必ず同じ長さ
    tableNames: (string | null)[];
    tableIds: number[];

    constructor() {
        this.lastTableId = -1;

        this.tableNames = [];
        this.tableIds = [];
    }

    // 新規ID発行(private)
    private publishNewTableId(): number {
        this.lastTableId += 1;
        return this.lastTableId;
    }

    // テーブル登録し、新しいtableIdを返す
    public addNewTable(tableName: string | null): number {
        const newTableId: number = this.publishNewTableId();

        this.tableNames.push(tableName);
        this.tableIds.push(newTableId);

        return newTableId;
    }

    // IDから名前の検索、ない場合はnullを返す
    public getTableNameById(tableId: number): string | null {
        const idx = this.tableIds.indexOf(tableId);
        return (idx >= 0)? this.tableNames[idx]: null;
    }

    // 名前は重複できるので、名前からIDの検索はない

    // すべてのIDと名前を返すイテレーター
    public *createTableIterator(): Generator<{tableId: number, tableName: string | null}, void, unknown> {
        for (let i=0; i<this.tableIds.length; i++) {
            yield {
                tableId: this.tableIds[i],
                tableName: this.tableNames[i],
            };
        }
    }
}
// 唯一ここでインスタンス化する
export const globalTableMap = new GlobalTableMap();



// 各スコープ内で使う、TableMap
export class TableMap {
    // テーブル名とIDの配列
    // 必ず同じ長さ
    tableNames: (string | null)[];
    tableIds: number[];

    constructor(tableNames?: (string | null)[], tableIds?: number[]) {
        this.tableNames = [];
        this.tableIds = [];

        if (tableNames) {
            // 必ずtableIdsもあり、同じ長さであることを確認
            if (!tableIds) {
                throw new Error("tableNamesが登録されているのに、tableIdsが登録されていない");
            }
            if (tableNames.length != tableIds.length) {
                throw new Error(`tableNamesとtableIdsは同じ長さである必要がある.nm:${tableNames.length}, id:${tableIds.length}`);
            }

            // 配列を代入するのではなく、１つずつコピーする
            tableNames.forEach((n) => {
                this.tableNames.push(n);
            });
            tableIds.forEach((i) => {
                this.tableIds.push(i);
            })
        }
    }

    // テーブル登録し、新しいtableIdを返す
    private addNewTable(tableName: string | null): number {
        // グローバルなtableMapに作ってもらう
        const newTableId: number = globalTableMap.addNewTable(tableName);

        this.tableNames.push(tableName);
        this.tableIds.push(newTableId);

        return newTableId;
    }

    // IDから名前の検索、ない場合はundefinedを返す
    public getTableNameById(tableId: number): string | null | undefined {
        const idx = this.tableIds.indexOf(tableId);
        return (idx >= 0)? this.tableNames[idx]: undefined;
    }

    // 名前からIDの検索し、見つからない場合は新規登録（undefinedは返らない）
    // 名前は、t1などリネームした名前が１つのクエリ内に複数存在する可能性はあり
    // そうすると新しいテーブルなのに、別のテーブルIDを返すことになる。
    // しかし、同一スコープ内にはないはずで、そのように使う前提で、ここでは気にしない
    public getTableIdByName(tableName: string | null): number {
        let idx: number = this.tableNames.indexOf(tableName);
        if (idx < 0) {
            idx = this.addNewTable(tableName);
        }

        return this.tableIds[idx];
    }

    // 新しいTableMapの複製
    public clone(): TableMap {
        return new TableMap(this.tableNames, this.tableIds);
    }
}
