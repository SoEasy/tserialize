import { expect } from 'chai';
import { JsonName, deserialize } from '../../';
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

    it('have property', () => {
        expect(instance).have.property('fieldToSerialize');
    });

    it('dont have undecorated property', () => {
        expect(instance).not.have.property('ignoredField');
    });

    it('be equal to reference', () => {
        expect(instance).to.deep.equal({fieldToSerialize: `${referenceValue}!`});
    });
});

describe('Deserializer must receive raw data', () => {
    const referenceValue = 'hello';
    const data = { field: referenceValue, related: '!' };
    const instance = deserialize(data, DeserializeWithRawData);

    it('must receive raw data', () => {
        expect(instance).to.be.eql({field: `${referenceValue}!${referenceValue}`});
    });
});
