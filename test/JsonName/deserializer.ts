import { expect } from 'chai';
import { JsonName, deserialize } from '../../';
import 'reflect-metadata';

class BaseDeserializerCase {
    @JsonName('fieldToSerialize', value => value, value => `${value}!`)
    fieldToSerialize: string;

    ignoredField: number;
}

describe('Custom deserializer case', () => {
    const referenceValue = 'hello';
    const data = {fieldToSerialize: referenceValue};
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
