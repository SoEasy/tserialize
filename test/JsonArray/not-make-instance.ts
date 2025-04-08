import {deserialize, JsonArray, JsonName, } from './../../src';

class NestedClass2 {
    @JsonName('nestedField')
    nestedField: string;
}

class NestedClass {
    @JsonArray(NestedClass2, 'array')
    array: NestedClass2[];
}

class DeserializerWithoutInstance {
    @JsonArray(NestedClass, 'nestedArray')
    nestedArray: NestedClass[];
}

describe('Deserialize config case', () => {
    const referenceValue = 'hello';
    const data = { nestedArray: [{ nestedField: referenceValue, array: [{ nestedField: referenceValue }] }] };
    const classInstance = deserialize(data, DeserializerWithoutInstance);
    const objectInstance = deserialize(data, DeserializerWithoutInstance, { makeInstance: false });

    test('class instance instanceof class', () => {
      expect(classInstance instanceof DeserializerWithoutInstance).toBeTruthy();
      expect(classInstance.nestedArray[0] instanceof NestedClass).toBeTruthy();
    });

    test('object instance instanceof object', () => {
      expect(objectInstance instanceof Object).toBeTruthy();
    });

    test('object instance in arrays', () => {
      expect(objectInstance.nestedArray[0] instanceof NestedClass).toBeFalsy();
    })

    test('object instance in nested arrays', () => {
      expect(objectInstance.nestedArray[0].array[0] instanceof NestedClass2).toBeFalsy();
    })
});
