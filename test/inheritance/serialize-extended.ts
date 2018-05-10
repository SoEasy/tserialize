import { expect } from 'chai';
import { JsonName, serialize } from '../../src/index';
import 'reflect-metadata';

class Base {
    static calledNumber: number = 0;

    @JsonName()
    field1: number = 1;

    @JsonName()
    field2: number = 2;

    protected static serializeSome(value: any): any {
        Base.calledNumber += 1;
        return value;
    }
}

class ChildOne extends Base {
    @JsonName('c1', Base.serializeSome)
    childOneField: string = 'Im one!';
}

class ChildTwo extends Base {
    @JsonName('c2')
    childTwoField: boolean = true;
}

describe('Serialize extended class', () => {
    const c1 = new ChildOne();
    const c2 = new ChildTwo();
    const serialized1 = serialize(c1);

    it('must run', () => {
        console.log(serialized1);
        expect(c2).to.be.not.null;
        expect(serialized1).to.eql({ field1: 1, field2: 2, c1: 'Im one!' });
        expect(Base.calledNumber).to.eql(1);
    });
});
