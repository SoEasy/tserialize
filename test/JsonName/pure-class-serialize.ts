import { serialize } from './../../src';

class A {
    field1: string;
}

describe('Сериализация классов без декораторов', () => {
    const instance = new A();

    test('Должно запуститься и не упасть', () => {
        const serialized = serialize(instance);
    });

    test('Должно сериализовать как пустой объект', () => {
        const serialized = serialize(instance);
        expect(serialized).toEqual({});
    });
});
