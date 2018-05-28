import { JsonName, serialize } from '../../src/index';

class Base {
    @JsonName()
    field1: number = 1;

    @JsonName()
    field2: number = 2;

    log(): number {
        return this.field1;
    }
}

class Child extends Base {
    @JsonName('anotherName', (v: number) => v + 2)
    field1: number = 3;
}

class AnotherChild extends Base {
    @JsonName('anotherName', (v: number) => v + 3)
    field1: number = 4;
}

describe('Serialize extended class', () => {
    const c1 = new Child();
    const serializedChild = serialize(c1);
    const c2 = new AnotherChild();
    const serializedAnotherChild = serialize(c2);

    test('Когда в дочерних классах одинаковые имена, они вызовут свои сериализаторы', () => {
        expect(serializedChild).toEqual({ anotherName: 5, field2: 2 });
        expect(c1.log()).toBe(3);
        expect(serializedAnotherChild).toEqual({ anotherName: 7, field2: 2 });
        expect(c2.log()).toBe(4);
    });

    test('Родительские методы должны быть корректно доступны у дочерних классов', () => {
        expect(c1.log()).toBe(3);
        expect(c2.log()).toBe(4);
    });
});
