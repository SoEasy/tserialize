import { expect } from 'chai';
import { JsonName, JsonNameLate, deserialize } from '../../';
import 'reflect-metadata';

class BaseDeserializerCase {
    @JsonName('baseField', value => value, value => `${value}!`)
    baseField: string;

    @JsonNameLate('relatedField', value => value, (value, instance: BaseDeserializerCase) => `${value} with ${instance.baseField}`)
    relatedField: string;
}

describe('JsonNameLate case', () => {
    const data = { baseField: 'hello', relatedField: 'must be'};
    const instance = deserialize(data, BaseDeserializerCase);

    it('be equal to reference', () => {
        expect(instance).to.be.eql({
            baseField: 'hello!',
            relatedField: 'must be with hello!'
        });
    });
});
