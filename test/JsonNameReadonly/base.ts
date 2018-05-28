import { JsonNameReadonly, deserialize, serialize } from './../../src';

class BaseReadonlyCase {
    @JsonNameReadonly()
    fieldToSerialize: string;

    ignoredField: number;
}

describe('JsonNameReadonly deserialize case', () => {
    const referenceValue = 'hello';
    const data = {fieldToSerialize: referenceValue};
    const instance = deserialize(data, BaseReadonlyCase);

    const serialized = serialize(instance);

    test('have property', () => {
        expect(instance).toHaveProperty('fieldToSerialize');
    });

    test('dont have undecorated property', () => {
        expect(instance).not.toHaveProperty('ignoredField');
    });

    test('be equal to reference', () => {
        expect(instance).toEqual({fieldToSerialize: `${referenceValue}`});
    });

    test('serialized value not have field', () => {
        expect(serialized).toEqual({});
    });
});
