import { JsonName, serialize, deserialize, ParentKey } from './../index';
import 'reflect-metadata';

class Nested {
    @JsonName('operationSystem')
    os: string;

    @JsonName()
    version: number;
}

class Foo {
    @JsonName<string>('bb', value => value.split('').reverse().join(''), value => `${value}!!!`)
    bar: string;

    @JsonName(ParentKey)
    n: Nested;

    @JsonName(ParentKey)
    n1: Nested;
}

const f = new Foo();
f.bar = 'gello';
f.n = new Nested();
f.n.os = 'win';
console.log(serialize(f));
console.log(deserialize({bb: 'gg1g', os: 'hello'}, Foo));
