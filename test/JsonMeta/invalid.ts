import { JsonName, JsonMeta, serialize } from './../../src';

class InnerClass {
    @JsonName()
    fieldToSerialize: string;

    @JsonName('customName')
    fieldTwo: number;

    fieldThree: boolean = false;
}

class BaseMetaCase {
    @JsonMeta(InnerClass)
    inner: InnerClass = new InnerClass();
}

describe('JsonMeta without toServer case', () => {
    const instance = new BaseMetaCase();
    instance.inner.fieldToSerialize = 'hello';
    instance.inner.fieldTwo = 2;
    const serialized = serialize(instance);

    test('be equal to reference', () => {
        expect(serialized).toEqual({ fieldToSerialize: 'hello', customName: 2 });
    });
});
