import { expect } from 'chai';
import { JsonName, JsonMeta, deserialize } from './../../src';
import 'reflect-metadata';

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
    @JsonMeta()
    inner: InnerClass = new InnerClass();
}

describe('JsonMeta deserialize case', () => {
    const instance = deserialize({
        fieldToSerialize: 'hello',
        customName: 2,
        fieldThree: true
    }, BaseMetaCase);

    it('be equal to reference', () => {
        expect(instance).to.deep.equal({
            inner: {
                fieldToSerialize: 'hello',
                fieldTwo: 2,
                fieldThree: false
            }
        });
    });
});
