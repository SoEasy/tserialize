import { expect } from 'chai';
import { JsonName, JsonMeta, serialize } from '../../';
import 'reflect-metadata';

class InnerClass {
    @JsonName()
    fieldToSerialize: string;

    @JsonName('customName')
    fieldTwo: number;

    fieldThree: boolean = false;

    toServer(): object {
        return serialize(this);
    }
}

class BaseMetaCase {
    @JsonMeta()
    inner: InnerClass = new InnerClass();
}

describe('JsonMeta serialize case', () => {
    const instance = new BaseMetaCase();
    instance.inner.fieldToSerialize = 'hello';
    instance.inner.fieldTwo = 2;
    const serialized = serialize(instance);

    it('be equal to reference', () => {
        expect(serialized).to.deep.equal({
            fieldToSerialize: 'hello',
            customName: 2
        });
    });
});
