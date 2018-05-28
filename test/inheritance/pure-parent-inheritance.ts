import { JsonName, serialize } from '../../src/index';

class AmountMixin {
    _amount: number = 1;

    get amount(): number {
        return this.amount;
    }

    set amount(value: number) {
        this.amount = value;
    }
}

class Employee extends AmountMixin {
    @JsonName('name')
    name: string = 'Im one!';
}

class Product extends AmountMixin {
    @JsonName('hello')
    greet: string = 'oppa';
}

describe('Сериализация экземпляров, унаследованных от чистого класса', () => {
    const c1 = new Employee();
    const serialized1 = serialize(c1);
    const c2 = new Product();
    const serialized2 = serialize(c2);

    test('Должны корректно сериализоваться', () => {
        expect(serialized1).toEqual({ name: 'Im one!' });
        expect(serialized2).toEqual({ hello: 'oppa' });
    });
});
