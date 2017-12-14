import { expect } from 'chai';
import { JsonNameReadonly, deserialize, serialize } from './../../src';
import 'reflect-metadata';

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

    it('have property', () => {
        expect(instance).have.property('fieldToSerialize');
    });

    it('dont have undecorated property', () => {
        expect(instance).not.have.property('ignoredField');
    });

    it('be equal to reference', () => {
        expect(instance).to.deep.equal({fieldToSerialize: `${referenceValue}`});
    });

    it('serialized value not have field', () => {
        expect(serialized).to.deep.equal({});
    });
});
