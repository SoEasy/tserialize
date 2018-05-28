import { JsonName, serialize, deserialize } from './../../src';

class BaseUnnamedCase {
    @JsonName()
    fieldToSerialize: string;

    ignoredField: number;
}

describe('Base unnamed serialization case', () => {
    const referenceValue = 'hello';
    const instance = new BaseUnnamedCase();
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
        expect(serialized).toEqual({fieldToSerialize: referenceValue});
    });
});

describe('Base unnamed deserialization case', () => {
    const referenceValue = 'hello';
    const data = {fieldToSerialize: referenceValue, ignoredField: 2};
    const instance = deserialize(data, BaseUnnamedCase);

    test('have property', () => {
        expect(instance).toHaveProperty('fieldToSerialize');
    });

    test('dont have undecorated property', () => {
        expect(instance).not.toHaveProperty('ignoredField');
    });

    test('be equal to reference', () => {
        expect(instance).toEqual({fieldToSerialize: referenceValue});
    });
});
