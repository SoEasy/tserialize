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

    test('class instance instanceof class', () => {
      expect(classInstance instanceof DeserializerWithoutInstance).toBeTruthy();
      expect(classInstance.nested instanceof NestedClass).toBeTruthy();
    });

    test('object instance instanceof object', () => {
      expect(objectInstance instanceof Object).toBeTruthy();
    });
      
    test('object instance for nested model', () => {
      expect(objectInstance.nested instanceof NestedClass).toBeFalsy();
    })
});
