import { JsonName, serialize, deserialize } from './../../src';
import 'reflect-metadata';

class BaseNamedCase {
    @JsonName('custom_name')
    fieldToSerialize: string;

    ignoredField: number;
}

describe('Base named serialization case', () => {
    const referenceValue = 'hello';
    const instance = new BaseNamedCase();
    instance.fieldToSerialize = referenceValue;
    instance.ignoredField = 2;
    const serialized = serialize(instance);

    test('have property', () => {
        expect(serialized).toHaveProperty('custom_name');
    });

    test('dont have undecorated property', () => {
        expect(serialized).not.toHaveProperty('ignoredField');
    });

    test('be equal to reference', () => {
        expect(serialized).toEqual({custom_name: referenceValue});
    });
});

describe('Base named deserialization case', () => {
    const referenceValue = 'hello';
    const data = {custom_name: referenceValue, ignoredField: 2};
    const instance = deserialize(data, BaseNamedCase);

    test('have property', () => {
        expect(instance).toHaveProperty('fieldToSerialize');
    });

    test('dont have custom_name property', () => {
        expect(instance).not.toHaveProperty('custom_name');
    });

    test('dont have undecorated property', () => {
        expect(instance).not.toHaveProperty('ignoredField');
    });

    test('be equal to reference', () => {
        expect(instance).toEqual({fieldToSerialize: referenceValue});
    });
});
