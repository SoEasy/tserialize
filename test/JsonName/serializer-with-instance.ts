import { JsonName, serialize } from './../../src';

class SerializerWithInstanceCase {
    @JsonName('fieldToSerialize', (value, instance) => `${value}${instance.ignoredField}`)
    fieldToSerialize: string;

    ignoredField: number;
}

class SerializerUndefinedValue {
    @JsonName('nullField', (_, instance) => instance.ignoredField + 1)
    nullField: number;

    ignoredField: number = 2;
}

describe('Serializer with instance case', () => {
    const referenceValue = 'hello';
    const instance = new SerializerWithInstanceCase();
    instance.fieldToSerialize = referenceValue;
    instance.ignoredField = 2;
    const serialized = serialize(instance);

    test('have property', () => {
        expect(serialized).toHaveProperty('fieldToSerialize');
    });

    test('dont have undecorated property', () => {
        expect(serialized).not.toHaveProperty('ignoredField');
    });

    test('be equal to reference', () => {
        expect(serialized).toEqual({
            fieldToSerialize: `${referenceValue}${instance.ignoredField}`,
        });
    });

    describe('Serializer with instance case upon undefined value', () => {
        const v = new SerializerUndefinedValue();
        const serialized = serialize(v);

        test('should have property', () => {
            expect(serialized).toHaveProperty('nullField');
        });

        test('should be correct', () => {
            expect(serialized).toEqual({nullField: 3});
        });
    });

});
