import { expect } from 'chai';
import { JsonName, JsonStruct, serialize } from '../../';
import 'reflect-metadata';

class InnerClass {
    @JsonName()
    fieldToSerialize: string;

    @JsonName('customName')
    fieldTwo: number;

    toServer(): object {
        return serialize(this);
    }
}

class BaseStructCase {
    @JsonStruct(InnerClass)
    inner: InnerClass;

    @JsonStruct(InnerClass, 'customInner')
    inner2: InnerClass;
}

describe('JsonStruct serialize case', () => {
    const referenceValue = '12';
    const instance = new BaseStructCase();
    instance.inner = new InnerClass();
    instance.inner.fieldToSerialize = referenceValue;
    instance.inner.fieldTwo = 2;
    instance.inner2 = new InnerClass();

    const serialized = serialize(instance);

    it('be equal to reference', () => {
        expect(serialized).to.deep.equal({
            inner: {
                fieldToSerialize: referenceValue,
                customName: 2
            },
            customInner: {}
        });
    });
});
