import {deserialize, JsonArray, JsonName, JsonStruct, serialize} from './../../src';

class NestedClass2 {
    @JsonName('nestedField')
    nestedField: string;
}

class NestedClass {
    @JsonName('nestedField')
    nestedField: string;

    @JsonArray(NestedClass2, 'array')
    array: NestedClass2[];
}

class DeserializerWithoutInstance {
    @JsonName('f')
    fieldToSerialize: string;

    @JsonStruct(NestedClass, 'nested')
    nested: NestedClass;

    @JsonArray(NestedClass, 'nestedArray')
    nestedArray: NestedClass[];
}

describe('Deserialize config case', () => {
    const referenceValue = 'hello';
    const data = { f: referenceValue, nested: { nestedField: referenceValue }, nestedArray: [{ nestedField: referenceValue, array: [{ nestedField: referenceValue }] }] };
    const defaultInstance = deserialize(data, DeserializerWithoutInstance);
    const objectInstance = deserialize(data, DeserializerWithoutInstance, { makeInstance: false });

    test('default instance instanceof class', () => {
        expect(defaultInstance instanceof DeserializerWithoutInstance).toBeTruthy();
    });

    test('object instance instanceof object', () => {
      expect(objectInstance instanceof Object).toBeTruthy();
    });
});
