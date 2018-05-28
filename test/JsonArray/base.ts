import { JsonArray, JsonName, deserialize, serialize } from './../../src/index';

class PartialClass {
    @JsonName()
    fieldOne: string;

    @JsonName('field_two')
    fieldTwo: string;

    constructor(
        fieldOne: string, fieldTwo: string
    ) {
        Object.assign(this, { fieldOne, fieldTwo });
    }
}

class DataClass {
    @JsonArray(PartialClass)
    parts: Array<PartialClass>;
}

describe('JsonNameReadonly deserialize case', () => {
    test('must serialize null data', () => {
        const d = new DataClass();
        expect(serialize(d)).toEqual({});
    });

    test('must serialize empty array', () => {
        const d = new DataClass();
        d.parts = [];
        expect(serialize(d)).toEqual({ parts: [] });
    });

    test('must serialize not-array data', () => {
        const d = new DataClass();
        (d.parts as any) = 123;
        expect(serialize(d)).toEqual({});
    });

    test('must serialize array with invalid instances', () => {
        const d = new DataClass();
        const p1 = new PartialClass('one', 'two');
        const p2 = new PartialClass('three', 'four');
        d.parts = [];
        d.parts.push(p1);
        d.parts.push(p2);
        d.parts.push(3 as any);
        d.parts.push({ fieldOne: 'five', fieldTwo: 'six' }); // Not instanceof!
        expect(serialize(d)).toEqual({
            parts: [
                { fieldOne: 'one', field_two: 'two' },
                { fieldOne: 'three', field_two: 'four' }
            ]
        });
    });

    test('must serialize array of valid instances', () => {
        const d = new DataClass();
        const p1 = new PartialClass('one', 'two');
        const p2 = new PartialClass('three', 'four');
        d.parts = [];
        d.parts.push(p1);
        d.parts.push(p2);
        expect(serialize(d)).toEqual({
            parts: [
                { fieldOne: 'one', field_two: 'two' },
                { fieldOne: 'three', field_two: 'four' }
            ]
        });
    });

    test('must deserialize undefined data', () => {
        const data = {};
        expect(deserialize(data, DataClass).parts).toBeUndefined();
    });

    test('must deserialize null data', () => {
        const data = { parts: null };
        expect(deserialize(data, DataClass).parts).toBeNull();
    });

    test('must deserialize empty array', () => {
        const data = { parts: [] };
        expect(deserialize(data, DataClass).parts.length).toBe(0);
    });

    test('must deserialize valid instances', () => {
        const data = { parts: [{ fieldOne: 'foo', field_two: 'bar' }] };
        expect(deserialize(data, DataClass).parts.length).toBe(1);
        expect(deserialize(data, DataClass).parts[0]).toEqual({ fieldOne: 'foo', fieldTwo: 'bar' });
        expect(deserialize(data, DataClass) instanceof DataClass).toBeTruthy();
        expect(deserialize(data, DataClass).parts[0] instanceof PartialClass).toBeTruthy();
    });
});
