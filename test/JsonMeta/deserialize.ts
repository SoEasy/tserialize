import { JsonName, JsonMeta, deserialize } from './../../src';

class InnerClass {
    @JsonName()
    fieldToSerialize: string;

    @JsonName('customName')
    fieldTwo: number;

    fieldThree: boolean = false;

    static fromServer(data: object): object {
        return deserialize(data, InnerClass);
    }
}

class BaseMetaCase {
    @JsonMeta(InnerClass)
    inner: InnerClass = new InnerClass();
}

describe('JsonMeta deserialize case', () => {
    const instance = deserialize({
        fieldToSerialize: 'hello',
        customName: 2,
        fieldThree: true
    }, BaseMetaCase);

    test('be equal to reference', () => {
        expect(instance).toEqual({
            inner: {
                fieldToSerialize: 'hello',
                fieldTwo: 2,
                fieldThree: false
            }
        });
    });
});
