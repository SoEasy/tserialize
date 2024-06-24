import { TSerializeConfig } from '../../src/core/types';
import { JsonName, JsonStruct, serialize } from './../../src';

class InnerClass {
    @JsonName()
    fieldToSerialize: string;

    @JsonName('customName')
    fieldTwo: number;

    toServer(config?: TSerializeConfig): object {
        return serialize(this, config);
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

    let serialized = serialize(instance);

    test('be equal to reference', () => {
        expect(serialized).toEqual({
            inner: {
                fieldToSerialize: referenceValue,
                customName: 2
            },
            customInner: {}
        });
    });

    test('must serialize fields with null value', () => {
        instance.inner2.fieldTwo = null
        serialized = serialize(instance, { allowNullValues: true });
        expect(serialized).toEqual({
            inner: {
                fieldToSerialize: referenceValue,
                customName: 2
            },
            customInner: {
                customName: null
            }
        });
    });

    test('must serialize raw data with auto create instances', () => {
        instance.inner2 = {
            fieldToSerialize: 'fieldToSerialize',
            fieldTwo: 42
        } as any;

        serialized = serialize(instance, { allowNullValues: true, autoCreateModelForRawData: true });
        expect(serialized).toEqual({
            inner: {
                fieldToSerialize: referenceValue,
                customName: 2
            },
            customInner: {
                fieldToSerialize: 'fieldToSerialize',
                customName: 42
            }
        });
    });

    test('must serialize raw data with auto create instances', () => {
        instance.inner2 = {
            fieldToSerialize: 'fieldToSerialize',
            fieldTwo: 42
        } as any;

        serialized = serialize(instance, { allowNullValues: true, autoCreateModelForRawData: true });
        expect(serialized).toEqual({
            inner: {
                fieldToSerialize: referenceValue,
                customName: 2
            },
            customInner: {
                fieldToSerialize: 'fieldToSerialize',
                customName: 42
            }
        });
    });
});
