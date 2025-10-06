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
    const objectWithoutChildInstances = deserialize(data, DeserializerWithoutInstance, {
        makeInstance: false,
        makeChildInstance: false
    });

    // makeInstance: true (default), makeChildInstance; true (default)
    test('class instance instanceof class', () => {
      expect(classInstance instanceof DeserializerWithoutInstance).toBeTruthy();
      expect(classInstance.nestedArray[0] instanceof NestedClass).toBeTruthy();
    });

    // makeInstance: false, makeChildInstance; true (default)
    test('object instance instanceof object', () => {
      expect(objectInstance instanceof Object).toBeTruthy();
    });

    // makeInstance: false, makeChildInstance; true (default)
    test('object instance in arrays', () => {
      expect(objectInstance.nestedArray[0] instanceof NestedClass).toBeTruthy();
    });

    // makeInstance: false, makeChildInstance; true (default)
    test('object instance in nested arrays', () => {
      expect(objectInstance.nestedArray[0].array[0] instanceof NestedClass2).toBeTruthy();
    });

    // makeInstance: false, makeChildInstance; false
    test('object instance without child instances instanceof object', () => {
      expect(objectWithoutChildInstances instanceof Object).toBeTruthy();
    });

    // makeInstance: false, makeChildInstance; false
    test('object instance without child instances in arrays has nested object without instance', () => {
      expect(objectWithoutChildInstances.nestedArray[0] instanceof Object).toBeTruthy();
      expect(objectWithoutChildInstances.nestedArray[0] instanceof NestedClass).toBeFalsy();
    });

    // makeInstance: false, makeChildInstance; false
    test('object instance without child instances in array item has nested object without instance', () => {
      expect(objectWithoutChildInstances.nestedArray[0].array[0] instanceof Object).toBeTruthy();
      expect(objectWithoutChildInstances.nestedArray[0].array[0] instanceof NestedClass2).toBeFalsy();
    });
});
