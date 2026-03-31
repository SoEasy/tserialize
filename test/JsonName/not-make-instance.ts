import {deserialize, JsonArray, JsonName, JsonStruct} from './../../src';

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
    const data = { f: referenceValue, nested: { nestedField: referenceValue, array: [{ nestedField: referenceValue }] } };
    const defaultInstance = deserialize(data, DeserializerWithoutInstance);
    const objectInstance = deserialize(data, DeserializerWithoutInstance, { makeInstance: false });
    const objectWithoutChildInstances = deserialize(data, DeserializerWithoutInstance, {
        makeInstance: false,
        makeChildInstance: false
    });

    // makeInstance: true (default), makeChildInstance; true (default)
    test('default instance instanceof class', () => {
        expect(defaultInstance instanceof DeserializerWithoutInstance).toBeTruthy();
    });

    // makeInstance: false, makeChildInstance; true (default)
    test('object instance instanceof object', () => {
      expect(objectInstance instanceof Object).toBeTruthy();
    });

    // makeInstance: false, makeChildInstance; true (default)
    test('object child instance instanceof class', () => {
      expect(objectInstance.nested instanceof NestedClass).toBeTruthy();
    });

    // makeInstance: false, makeChildInstance; true (default)
    test('object child with array child instance instanceof class', () => {
      expect(objectInstance.nested.array[0] instanceof NestedClass2).toBeTruthy();
    });

    // makeInstance: false, makeChildInstance; false
    test('object instance instanceof object', () => {
      expect(objectWithoutChildInstances instanceof Object).toBeTruthy();
    });

    // makeInstance: false, makeChildInstance; false
    test('object child instance instanceof class', () => {
      expect(objectWithoutChildInstances.nested instanceof Object).toBeTruthy();
      expect(objectWithoutChildInstances.nested instanceof NestedClass).toBeFalsy();
    });

    // makeInstance: false, makeChildInstance; false
    test('object child with array child instance instanceof class', () => {
      expect(objectWithoutChildInstances.nested.array[0] instanceof Object).toBeTruthy();
      expect(objectWithoutChildInstances.nested.array[0] instanceof NestedClass2).toBeFalsy();
    });
});
