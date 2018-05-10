import { JsonName, JsonStruct, serialize } from './../../src';
import 'reflect-metadata';

class InnerClass {
    @JsonName()
    fieldToSerialize: string;

    @JsonName('customName')
    fieldTwo: number;
}

class BaseStructCase {
    @JsonStruct()
    inner: InnerClass;

    @JsonStruct('customInner')
    inner2: InnerClass;

    @JsonStruct()
    inner3: InnerClass;

    @JsonStruct()
    inner4: InnerClass = null;
}

describe('JsonStruct without toServer case', () => {
    const referenceValue = '12';
    const instance = new BaseStructCase();
    instance.inner = new InnerClass();
    instance.inner.fieldToSerialize = referenceValue;
    instance.inner.fieldTwo = 2;
    instance.inner2 = new InnerClass();

    const serialized = serialize(instance);

    test('be equal to reference', () => {
        expect(serialized).toEqual({inner: { fieldToSerialize: referenceValue, customName: 2 } , customInner: {}});
    });
});
