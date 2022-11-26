export class List<T> {
    public Items: Array<T>;

    constructor(items: Array<T>) {
        this.Items = items;
    }

    Size(): number {
        return this.Items.length;
    }

    Add(value: T): void {
        this.Items.push(value);
    }

    Get(index: number): T {
        return this.Items[index];
    }
};