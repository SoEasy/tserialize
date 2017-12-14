import { expect } from 'chai';
import { JsonName, serialize } from './../../src';
import 'reflect-metadata';

class NullCase {
    @JsonName()
    firstField: string;

    @JsonName('second_field')
    secondField: number;

    @JsonName('thirdField', _ => null)
    thirdField: boolean = true;
}

describe('Null case serialization', () => {
    const instance = new NullCase();
    const serialized = serialize(instance);

    it('dont have properties', () => {
        expect(serialized).not.have.property('firstField');
        expect(serialized).not.have.property('secondField');
        expect(serialized).not.have.property('thirdField');
    });

    it('be equal to reference', () => {
        expect(serialized).to.deep.equal({});
    });
});
