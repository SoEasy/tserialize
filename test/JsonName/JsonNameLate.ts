import { JsonName, JsonNameLate, deserialize } from './../../src';
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

    test('be equal to reference', () => {
        expect(instance).toEqual({
            baseField: 'hello!',
            relatedField: 'must be with hello!'
        });
    });
});
