import {deserialize, JsonName, serialize} from './../../src';

class DeserializerWithoutInstance {
    @JsonName('f')
    fieldToSerialize: string;
}

describe('Deserialize config case', () => {
    const referenceValue = 'hello';
    const data = { f: referenceValue };
    const defaultInstance = deserialize(data, DeserializerWithoutInstance);
    const objectInstance = deserialize(data, DeserializerWithoutInstance, { makeInstance: false });

    test('default instance instanceof class', () => {
        expect(defaultInstance instanceof DeserializerWithoutInstance).toBeTruthy();
    });

    test('object instance instanceof object', () => {
        expect(objectInstance instanceof Object).toBeTruthy();
    });
});
