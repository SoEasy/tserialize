import { expect } from 'chai';
import { JsonName, serialize } from '../../';
import 'reflect-metadata';

class SerializerWithInstanceCase {
    @JsonName('fieldToSerialize', (value, instance) => `${value}${instance.ignoredField}`)
    fieldToSerialize: string;

    ignoredField: number;
}

class SerializerUndefinedValue {
    @JsonName('nullField', (_, instance) => instance.ignoredField + 1)
    nullField: number;

    ignoredField: number = 2;
}

describe('Serializer with instance case', () => {
    const referenceValue = 'hello';
    const instance = new SerializerWithInstanceCase();
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
        expect(serialized).to.deep.equal({
            fieldToSerialize: `${referenceValue}${instance.ignoredField}`,
        });
    });

    describe('Serializer with instance case upon undefined value', () => {
        const v = new SerializerUndefinedValue();
        const serialized = serialize(v);

        it('should have property', () => {
            expect(serialized).have.property('nullField');
        });

        it('should be correct', () => {
            expect(serialized).to.deep.equal({nullField: 3});
        });
    });

});
