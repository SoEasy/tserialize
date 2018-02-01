import { expect } from 'chai';
import { JsonArray, JsonName, JsonStruct, deserialize, serialize } from './../../src/index';
import 'reflect-metadata';

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

class ContactPairModel {
    @JsonName('is_verified') isVerified: boolean;

    @JsonName('value') value: string;

    static fromServer(data: any): ContactPairModel {
        return deserialize<ContactPairModel>(data, ContactPairModel);
    }
}

class ContactModel {
    @JsonArray(ContactPairModel, 'email')
    emails: Array<ContactPairModel> = [];

    @JsonArray(ContactPairModel, 'phone')
    phones: Array<ContactPairModel> = [];

    static fromServer(data: any): ContactModel {
        return deserialize<ContactModel>(data, ContactModel);
    }
}

class UserInfoMoreModel {
    @JsonStruct('contacts') contacts: ContactModel;

    static fromServer(data: any): UserInfoMoreModel {
        console.log('one');
        return deserialize<UserInfoMoreModel>(data, UserInfoMoreModel);
    }
}

describe('JsonNameReadonly deserialize case', () => {
    it('must serialize null data', () => {
        const d = new DataClass();
        expect(serialize(d)).to.be.eql({});
    });

    it('must serialize empty array', () => {
        const d = new DataClass();
        d.parts = [];
        expect(serialize(d)).to.be.eql({ parts: [] });
    });

    it('must serialize not-array data', () => {
        const d = new DataClass();
        (d.parts as any) = 123;
        expect(serialize(d)).to.be.eql({});
    });

    it('must serialize array with invalid instances', () => {
        const d = new DataClass();
        const p1 = new PartialClass('one', 'two');
        const p2 = new PartialClass('three', 'four');
        d.parts = [];
        d.parts.push(p1);
        d.parts.push(p2);
        d.parts.push(3 as any);
        d.parts.push({ fieldOne: 'five', fieldTwo: 'six' }); // Not instanceof!
        expect(serialize(d)).to.be.eql({
            parts: [
                { fieldOne: 'one', field_two: 'two' },
                { fieldOne: 'three', field_two: 'four' }
            ]
        });
    });

    it('must serialize array of valid instances', () => {
        const d = new DataClass();
        const p1 = new PartialClass('one', 'two');
        const p2 = new PartialClass('three', 'four');
        d.parts = [];
        d.parts.push(p1);
        d.parts.push(p2);
        expect(serialize(d)).to.be.eql({
            parts: [
                { fieldOne: 'one', field_two: 'two' },
                { fieldOne: 'three', field_two: 'four' }
            ]
        });
    });

    it('must deserialize undefined data', () => {
        const data = {};
        expect(deserialize(data, DataClass).parts).to.be.undefined;
    });

    it('must deserialize null data', () => {
        const data = { parts: null };
        expect(deserialize(data, DataClass).parts).to.be.null;
    });

    it('must deserialize empty array', () => {
        const data = { parts: [] };
        expect(deserialize(data, DataClass).parts.length).to.be.eq(0);
    });

    it('must deserialize valid instances', () => {
        const data = { parts: [{ fieldOne: 'foo', field_two: 'bar' }] };
        expect(deserialize(data, DataClass).parts.length).to.be.eq(1);
        expect(deserialize(data, DataClass).parts[0]).to.be.eql({ fieldOne: 'foo', fieldTwo: 'bar' });
    });

    it('foo', () => {
        const test = UserInfoMoreModel.fromServer({
            contacts: {
                phone: [
                    { value: '+79037249865', is_verified: true }
                ],
                email: []
            }
        });
        expect(test).to.be.not.null;
    })
});
