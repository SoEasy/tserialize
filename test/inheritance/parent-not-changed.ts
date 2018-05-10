import { JsonName, serialize } from '../../src/index';
import 'reflect-metadata';

class Base {
    @JsonName()
    field1: number = 1;

    @JsonName()
    field2: number = 2;
}

class Child extends Base {
    @JsonName('anotherName')
    field1: number = 3;
}

describe('Serialize extended class', () => {
    const b = new Base();
    const serializedBase = serialize(b);
    const c = new Child();
    const serializedChild = serialize(c);

    test('must run', () => {
        expect(serializedBase).toBeDefined();
        expect(serializedChild).toEqual({ anotherName: 3, field2: 2 });
        expect(serializedBase).toEqual({ field1: 1, field2: 2 });
    });
});
