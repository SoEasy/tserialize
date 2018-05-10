import { JsonName, serialize } from './../../src';
import 'reflect-metadata';

class BaseSerializerCase {
    @JsonName('fieldToSerialize', value => `${value}!`)
    fieldToSerialize: string;

    ignoredField: number;
}

describe('Custom serializer case', () => {
    const referenceValue = 'hello';
    const instance = new BaseSerializerCase();
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
        expect(serialized).toEqual({fieldToSerialize: `${referenceValue}!`});
    });
});
