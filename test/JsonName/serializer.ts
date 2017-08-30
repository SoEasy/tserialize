import { expect } from 'chai';
import { JsonName, serialize } from '../../';
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

    it('have property', () => {
        expect(serialized).have.property('fieldToSerialize');
    });

    it('dont have undecorated property', () => {
        expect(serialized).not.have.property('ignoredField');
    });

    it('be equal to reference', () => {
        expect(serialized).to.deep.equal({fieldToSerialize: `${referenceValue}!`});
    });
});
