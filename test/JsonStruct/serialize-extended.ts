import { JsonName, JsonStruct, deserialize, serialize } from './../../src';

interface IModelChild<T> {
    new (props: object): T;
}

class Model {
    static fromServer<T extends Model>(this: IModelChild<T>, data: object): T {
        return deserialize(data, this);
    }

    toServer(): object {
        return serialize(this);
    }
}

class ChildClass extends Model {
    @JsonName() name: string;
}

class ResponseWithJsonStruct extends Model {
    @JsonStruct(ChildClass, 'a') a: ChildClass;
}

describe('JsonStruct extended serialize case', () => {
    const childInstance = new ChildClass();
    childInstance.name = 'hello';
    const instance = new ResponseWithJsonStruct();
    instance.a = childInstance;

    const serializedInstance = instance.toServer();

    test('correct serialize extended JsonStruct', () => {
        expect(serializedInstance).toEqual({
            a: {
                name: 'hello',
            }
        });
    });
});
