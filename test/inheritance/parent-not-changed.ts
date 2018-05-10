import { expect } from 'chai';
import { JsonName, serialize } from '../../src/index';
import 'reflect-metadata';

class Base {
    @JsonName()
    field1: number = 1;

    @JsonName()
    field2: number = 2;
}

class Child extends Base {
    @JsonName('anotherName')
    field1: number = 3;
}

describe('Serialize extended class', () => {
    const b = new Base();
    const serializedBase = serialize(b);
    const c = new Child();
    const serializedChild = serialize(c);

    it('must run', () => {
        expect(serializedBase).to.be.not.null;
        expect(serializedChild).to.eql({ anotherName: 3, field2: 2 });
        expect(serializedBase).to.eql({ field1: 1, field2: 2 });
    });
});
