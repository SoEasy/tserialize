# Serialization/deserialization utilities for TypeScript and ES6
[![Build Status](https://travis-ci.org/SoEasy/tserialize.svg?branch=master)](https://travis-ci.org/SoEasy/tserialize)
<img src="img/logo.svg" width="300" align="center">
<br/>

## Installation
>npm install --save tserialize

Installation from github
>npm install https://github.com/SoEasy/tserialize/tarball/master

### Change overview
Up version to 1.4.0
- Reimplemented internal store of metadata
- Fixed bugs when inheriting the models
- Started the process of moving from reflect-metadata

## Overview
This library servers as a convenient way for handling backend sources models with inappropriate formats. Also it is a great solution for transforming raw data in a required classes instances.

Lets do a quick example for backend source model:

```
data = {
    field_one: 1,
    field_two: 2,
    ...
    field_ten: 10
}

class ProgressionClass {
    fieldOne: number;
    fieldTwo: number;
    fieldThree: number;
    ...
    fieldTen: number;

    firstFiveSum(): number {
        return this.fieldOne + this.fieldTwo + fieldThree;
    }

    lastTwoSum(): number {
        return this.fieldNine + this.fieldTen;
    }
}

```
We need to initialize the instance of `ProgressionClass` with `data` from backend source. A few ways are possible:
- Pass fields as arguments in to constructor
- Create a fabric method for handling passing data and create instances from it
- Create a method which applies passing data to the instance

Each of this options requires cost imperative way of handling data

Library allows to use declarative way for describing how to manage incoming data.
```
import { deserialize, JsonName } from 'teserialize';

class ProgressionClass {
    @JsonName('field_one')
    fieldOne: number;

    @JsonName('field_two')
    fieldTwo: number;

    @JsonName('field_three')
    fieldThree: number;
    ...

    static fromServer(data: object): ProgressionClass {
        return deserialize(data, ProgressionClass);
    }
}

const data = {
    field_one: 1,
    field_two: 2,
    ...
    field_ten: 10
}

const progressionInstance = ProgressionClass.fromServer(data);

console.log(progressionInstance.fieldTwo); // 2
```

## API
- Functions
 - [Deserialization of raw data](#deserialize)
 - [Serialization of instance](#serialize)
- Decorators
 - [Basic decorator JsonName](#jsonname)
 - [Decorator for reading JsonNameReadonly](#jsonnamereadonly)
 - [Decorator for nested classes JsonStruct](#jsonstruct)
 - [Decorator for metadata JsonMeta](#jsonmeta)
 - [Decorator for arrays JsonArray](#jsonarray)

### deserialize
Function from `tserialize`, uses for transforming raw data in to instance of a class

##### Import
```
import { deserialize } from 'tserialize';
```

##### Signature
```
function deserialize<T>(rawData: any, TargetClass: { new (...args: Array<any>): T }): T
```

##### Example
```
class Foo {}

const fooInstance = deserialize<Foo>(rawData, Foo);
```

##### Recommendations
The recommended way of using `deserialize` is by calling it within `static fromServer`.
```
class Foo {
    static fromServer(data: object): Foo {
        return deserialize<Foo>(data, Foo);
    }
}
```
- It is a internal *static method* using by the library when it works with [JsonStruct](#jsonstruct) and [JsonMeta](#jsonmeta).
- Also using of `fromServer` allows to put some logic when you requesting for the instance of a class


### serialize
Function from the `teserialize` allows to transform instance of a class in to raw data. Useful when you need to pass the data in to server.

##### Import
```
import { serialize } from 'teserialize';
```

##### Signature
```
function serialize(model: { [key: string]: any }): object
```

##### Example
```
class Foo {}

const fooInstance = new Foo();
const dataToServer = serialize(fooInstance);
```

##### Recommendations
The recommended way of using `serialize` is by calling it within `toServer`.
```
class Foo {
    toServer(): object {
        return serialize(this);
    }
}
```
- It is a internal *static method* using by the library when it works with [JsonStruct](#jsonstruct) and [JsonMeta](#jsonmeta).
- Also using of `fromServer` allows to put some logic when you requesting for the instance of a class


### JsonName
It indicates the field like required for serialization. The most basic decorator in library. Other decorators use it.

##### Signature
```
JsonName<T>(
            name?: string,
            serialize?: (obj: T, instance: any) => any,
            deserialize?: (serverObj: any) => T)
        )
```
- name - name of a key in a raw data. If skip then the name of a field is using.
- serialize - function for transforming the data [serialize](#serialize). If the value of a field is `null/undefined` then function serializator returns `null/undefined` - and the field will not be included in to final model.
- deserialize - function for clearing incoming data [deserialize](#deserialize)

##### Example
```
class Foo {
    @JsonName()
    firstName: string;

    @JsonName('last_name, value => value.toUpperCase())
    lastName: string;

    @JsonName('sex', value => value ? 'M' : 'F', value: string => value === 'M' : true : false)
    sex: boolean;

    @JsonName()
    alwaysNull: string = null; // field will not be changed and will not go in to final model after serialization

    @JsonName('always_null_2', () => null)
    alwaysNull2: string;

    toServer(): object {
        return serialize(this);
    }
}

const f = new Foo();
f.firstName = 'Name';
f.lastName = 'Last';
f.sex = true;
f.alwaysNull2 = 'hello'; // Serializator returns null no result
const serialized = f.toServer(); // { firstName: 'Name', last_name: 'LAST', sex: 'M' }
```

### JsonNameReadonly
It works like `JsonName` with nullifier serializator. Uses when it needs to return data and don't need to serialize before sending.

*When serialization field with this decorator will never go to the result model*
##### Signature
```
JsonNameReadonly<T>(
            name?: string,
            deserialize?: (serverObj: any) => T)
        )
```
- name - name of a key in a raw data
- deserialize - function for clearing incoming data [deserialize](#deserialize)

### JsonStruct
Decorator for serialization of nested objects where fields are decorated for serialization and deserialization as well.

If the nested class has a `fromServer` method, it will be used for deserialization. If not, the usual deserialize will be called.

If the nested class has a `toServer` method, it will be used for serialization. If not, normal serialize will be called.

##### Signature
```
function JsonStruct(
    proto: any
    name?: string
)
```
- proto - constructor of a class of nested structure
- name - name of a key for data

##### Example
```
class SysInfo {
    @JsonName('operation_system')
    name: string;

    @JsonName()
    version: number;
}

class Computer {
    @JsonStruct(SysInfo, 'sys_info')
    os: SysInfo;

    @JsonName()
    ram: number;

    static fromServer(data: object): Computer {
        return deserialize(data, Computer);
    }
}

const data = { ram: 8, sys_info: { operation_system: 'Win', version: 10 } };
const instance = Computer.fromServer(data);
// { ram: 8, os: { name: 'Win', version: 10 } }
```

### JsonMeta
Similar to `JsonStruct`, but it takes data not from the key but from the raw data. Uses for transforming flatten-composite models.

For example when the object of a source data consists a lot of keys but each of it relates to the different entity and you want to de-composite for small pieces of independent entity.

##### Signature
```
function JsonMeta(proto: any)
```
- proto - constructor of a class for flatten structure

##### Example
```
class SysInfo {
    @JsonName('operation_system')
    name: string;

    @JsonName('os_version')
    version: number;
}

class Computer {
    @JsonMeta(SysInfo)
    os: SysInfo;

    @JsonName()
    ram: number;

    static fromServer(data: object): Computer {
        return deserialize(data, Computer);
    }
}

const data = { ram: 8, operation_system: 'Win', os_version: 10 }; // flat data
const instance = Computer.fromServer(data);
// { ram: 8, os: { name: 'Win', version: 10 } } // composite model
```

### JsonArray
Decorator for serialize/deserialize arrays of serializing instances
In canse of implementations of toServer/static fromServer, otherwise native serialize/deserialize

##### Signature
```
function JsonArray(proto, name)
```
proto - class, instances of will be persisted in array

##### Example
```
class Person {
    @JsonName('name') personName: string;
    @JsonName() phone: string;

    constructor(personName, phone) {
        Object.assign(this, { personName, phone });
    }
}

class PhoneBook {
    @JsonArray(Person, 'records')
    persons: Array<Person> = [];
}

const book = new PhoneBook();
book.persons.push(new Person('Mike', '1'));
book.persons.push(new Person('Jane', '2'));
const data = serialize(book);
// { records: [ {name: 'Mike', phone: 1 }, { name: 'Jane', phone: 2 } ] }
```

## TODO
- JsonRaw

## LICENCE
MIT