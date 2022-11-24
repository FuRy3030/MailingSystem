export class List<T> {
    private items: Array<T>;

    constructor() {
        this.items = [];
    }

    Size(): number {
        return this.items.length;
    }

    Add(value: T): void {
        this.items.push(value);
    }

    Get(index: number): T {
        return this.items[index];
    }
};