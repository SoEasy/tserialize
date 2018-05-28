import { JsonName, serialize } from './../../src';

class NullCase {
    @JsonName()
    firstField: string;

    @JsonName('second_field')
    secondField: number;

    @JsonName('thirdField', _ => null)
    thirdField: boolean = true;
}

describe('Null case serialization', () => {
    const instance = new NullCase();
    const serialized = serialize(instance);

    test('dont have properties', () => {
        expect(serialized).not.toHaveProperty('firstField');
        expect(serialized).not.toHaveProperty('secondField');
        expect(serialized).not.toHaveProperty('thirdField');
    });

    test('be equal to reference', () => {
        expect(serialized).toEqual({});
    });
});
