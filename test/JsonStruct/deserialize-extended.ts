import { JsonName, JsonStruct, deserialize } from './../../src';

interface IModelChild<T> {
    new (props: object): T;
}

class Model {
    static fromServer<T extends Model>(this: IModelChild<T>, data: object): T {
        return deserialize(data, this);
    }
}

class ChildClass extends Model {
    @JsonName() name: string;
}

class ResponseWithJsonStruct extends Model {
    @JsonStruct(ChildClass, 'a') a: ChildClass;
}

describe('JsonStruct extended deserialize case', () => {
    const instance = ResponseWithJsonStruct.fromServer({
        a: {
            name: 'hello'
        }
    });

    test('correct deserialize extended JsonStruct', () => {
        expect(instance).toEqual({
            a: {
                name: 'hello',
            }
        });
    });

    test('a must be instance of ResponseA', () => {
        expect(instance.a instanceof ChildClass).toBe(true);
    });
});
