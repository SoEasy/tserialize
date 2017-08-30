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
    @JsonName<string>('bb', value => value.split('').reverse().join(''), value => `${value}!!!`)
    bar: string;

    @JsonMeta(Nested)
    n: Nested = new Nested();
}

const f = new Foo();
f.bar = 'gello';
f.n = new Nested();
f.n.os = 'win';
console.log(serialize(f));
console.log(deserialize({bb: 'gg1g', operationSystem: 'hello'}, Foo));
