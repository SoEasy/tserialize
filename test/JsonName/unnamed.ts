import { expect } from 'chai';
import { JsonName, serialize, deserialize } from '../../';
import 'reflect-metadata';

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

    it('have property', () => {
        expect(serialized).have.property('fieldToSerialize');
    });

    it('dont have undecorated property', () => {
        expect(serialized).not.have.property('ignoredField');
    });

    it('be equal to reference', () => {
        expect(serialized).to.deep.equal({fieldToSerialize: referenceValue});
    });
});

describe('Base unnamed deserialization case', () => {
    const referenceValue = 'hello';
    const data = {fieldToSerialize: referenceValue, ignoredField: 2};
    const instance = deserialize(data, BaseUnnamedCase);

    it('have property', () => {
        expect(instance).have.property('fieldToSerialize');
    });

    it('dont have undecorated property', () => {
        expect(instance).not.have.property('ignoredField');
    });

    it('be equal to reference', () => {
        expect(instance).to.deep.equal({fieldToSerialize: referenceValue});
    });
});
