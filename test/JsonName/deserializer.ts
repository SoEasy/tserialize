import { JsonName, deserialize } from './../../src';
import 'reflect-metadata';

class BaseDeserializerCase {
    @JsonName('fieldToSerialize', value => value, value => `${value}!`)
    fieldToSerialize: string;

    ignoredField: number;
}

class DeserializeWithRawData {
    @JsonName('field', value => value, (rawValue, rawData) => `${rawValue}${rawData.related}${rawValue}`)
    field: string;
}

describe('Custom deserializer case', () => {
    const referenceValue = 'hello';
    const data = { fieldToSerialize: referenceValue};
    const instance = deserialize(data, BaseDeserializerCase);

    test('have property', () => {
        expect(instance).toHaveProperty('fieldToSerialize');
    });

    test('dont have undecorated property', () => {
        expect(instance).not.toHaveProperty('ignoredField');
    });

    test('be equal to reference', () => {
        expect(instance).toEqual({fieldToSerialize: `${referenceValue}!`});
    });
});

describe('Deserializer must receive raw data', () => {
    const referenceValue = 'hello';
    const data = { field: referenceValue, related: '!' };
    const instance = deserialize(data, DeserializeWithRawData);

    test('must receive raw data', () => {
        expect(instance).toEqual({field: `${referenceValue}!${referenceValue}`});
    });
});
