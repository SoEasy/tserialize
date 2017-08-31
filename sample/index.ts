import { JsonName, JsonStruct, JsonMeta, serialize, deserialize } from './../index';
import 'reflect-metadata';

class Nested {
    @JsonName('operationSystem', value => value + '1', value => value + '2')
    os: string;

    @JsonName()
    version: number;

    toServer(): object {
        return serialize(this);
    }

    static fromServer(data: any): Nested {
        return deserialize(data, Nested);
    }
}

class Foo {
    @JsonStruct(Nested, 'foo')
    n: Nested = new Nested();
}

const f = new Foo();
f.n = new Nested();
f.n.os = 'win';
f.n.version = 2;
console.log(serialize(f));
