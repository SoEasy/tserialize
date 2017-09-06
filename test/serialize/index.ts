import { expect } from 'chai';
import { serializeValue } from './../../src/serialize/helpers';
import { PropertyMetadata } from './../../src/meta-store';

describe('serializeValue helper', () => {
    const defaultMeta: PropertyMetadata = {
        propertyKey: 'prop',
        targetKey: 'prop',
        serialize: null,
        deserialize: null,
        struct: false
    };

    class TestClass {
        prop: number = 1;

        toServer(): any {
            return {prop: this.prop};
        }
    }

    it('must return undefined without metadata => undefined', () => {
        expect(serializeValue(null, 1, 1)).to.be.undefined;
    });

    it('must serialize null struct with null serializer => null', () => {
        const meta = {...defaultMeta, ...{ struct: true }};

        expect(serializeValue(meta, null, null)).to.be.null;
    });

    // it('must serialize null struct with not null serializer => null', () => {
    //     const meta = {...defaultMeta, ...{serialize: () => null}};
    //
    //     expect(serializeValue(meta, null, null)).to.be.null;
    // });
    //
    // it('must serialize null struct with not null serializer => value', () => {
    //     const meta = {...defaultMeta, ...{serialize: () => 2}};
    //
    //     expect(serializeValue(meta, null, null)).to.be.equal(2);
    // });

    it('must serialize not null struct in them context', () => {
        const t = new TestClass();
        const meta = {...defaultMeta, ...{struct: true}};
        expect(serializeValue(meta, t, null)).to.deep.equal({prop: 1});
    });

    it('must serialize not null struct with custom serializer', () => {});

    it('must serialize not null struct with default serializer', () => {});

    it('must call custom serializer in them context', () => {
        // const meta = {...defaultMeta, ...{serialize: ()}}
    });

    it('must call custom serializer in them context which return null');

    it('must serialize struct with custom serializer');

    it('must serialize struct without custom serializer');

    it('must serialize value with serializer in them context');

    it('must serialize value without serializer');
});
