export function deserialize<T>(data: any, cls: { new (...args: Array<any>): T }): T {
    return new cls();
}
