import { JsonName, JsonStruct, deserialize } from './../../src';

class InnerClass {
    @JsonName()
    fieldToSerialize: string;

    @JsonName('customName')
    fieldTwo: number;

    static fromServer(data: object): InnerClass {
        return deserialize(data, InnerClass);
    }
}

class BaseStructCase {
    @JsonStruct(InnerClass)
    inner: InnerClass;

    @JsonStruct(InnerClass, 'customInner')
    inner2: InnerClass;
}

describe('JsonStruct deserialize case', () => {
    const instance = deserialize({
        inner: {
            fieldToSerialize: 'hello',
            customName: 2
        },
        customInner: {
            fieldToSerialize: 'good buy'
        },
        noMatterInner: {
            customName: 3
        }
    }, BaseStructCase);

    test('be equal to reference', () => {
        expect(instance).toEqual({
            inner: {
                fieldToSerialize: 'hello',
                fieldTwo: 2
            },
            inner2: {
                fieldToSerialize: 'good buy'
            }
        });
    });
});
