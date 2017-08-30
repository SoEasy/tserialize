import { expect } from 'chai';
import { JsonName, serialize, deserialize } from '../../';
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

    it('have property', () => {
        expect(serialized).have.property('custom_name');
    });

    it('dont have undecorated property', () => {
        expect(serialized).not.have.property('ignoredField');
    });

    it('be equal to reference', () => {
        expect(serialized).to.deep.equal({custom_name: referenceValue});
    });
});

describe('Base named deserialization case', () => {
    const referenceValue = 'hello';
    const data = {custom_name: referenceValue, ignoredField: 2};
    const instance = deserialize(data, BaseNamedCase);

    it('have property', () => {
        expect(instance).have.property('fieldToSerialize');
    });

    it('dont have custom_name property', () => {
        expect(instance).not.have.property('custom_name');
    });

    it('dont have undecorated property', () => {
        expect(instance).not.have.property('ignoredField');
    });

    it('be equal to reference', () => {
        expect(instance).to.deep.equal({fieldToSerialize: referenceValue});
    });
});
