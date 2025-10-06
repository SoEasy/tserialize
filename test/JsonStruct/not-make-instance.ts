import {deserialize, JsonName, JsonStruct} from './../../src';

class NestedClass {
    @JsonName('nestedField')
    nestedField: string;
}

class DeserializerWithoutInstance {
    @JsonStruct(NestedClass, 'nested')
    nested: NestedClass;
}

describe('Deserialize config case', () => {
    const referenceValue = 'hello';
    const data = { nested: { nestedField: referenceValue } };
    const classInstance = deserialize(data, DeserializerWithoutInstance);
    const objectInstance = deserialize(data, DeserializerWithoutInstance, { makeInstance: false });
    const objectWithoutChildInstances = deserialize(data, DeserializerWithoutInstance, {
        makeInstance: false,
        makeChildInstance: false
    });


    // makeInstance: true (default), makeChildInstance; true (default)
    test('class instance instanceof class', () => {
      expect(classInstance instanceof DeserializerWithoutInstance).toBeTruthy();
      expect(classInstance.nested instanceof NestedClass).toBeTruthy();
    });

    // makeInstance: false, makeChildInstance; true (default)
    test('object instance instanceof object', () => {
      expect(objectInstance instanceof Object).toBeTruthy();
    });

    // makeInstance: false, makeChildInstance; true (default)
    test('object instance for nested model', () => {
      expect(objectInstance.nested instanceof NestedClass).toBeTruthy();
    });

    // makeInstance: false, makeChildInstance; false
    test('object instance without child instances instanceof object', () => {
        expect(objectWithoutChildInstances instanceof Object).toBeTruthy();
    });

    // makeInstance: false, makeChildInstance; false
    test('object instance without child instances has nested class instanceof object', () => {
      expect(objectWithoutChildInstances.nested instanceof NestedClass).toBeFalsy();
      expect(objectWithoutChildInstances.nested instanceof Object).toBeTruthy();
    })
});
