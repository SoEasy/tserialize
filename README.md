# Утилиты сериализации/десериализации для TypeScript и ES6
[![Build Status](https://travis-ci.org/SoEasy/tserialize.svg?branch=master)](https://travis-ci.org/SoEasy/tserialize)

## Установка
>npm install --save tserialize

Установка с гитхаба
>npm install https://github.com/SoEasy/tserialize/tarball/master

### Change overview
Версия поднялась до 1.4.0
- Переписано внутреннее хранилище метаданных
- Bсправлены баги при наследовании моделей
- Начался процесс отказа от reflect-metadata

## Основная информация
Библиотека для борьбы с бэкэндом и любыми другими источниками данных, которые не желают(или не могут) называть поля в объектах так, как нам удобно.

Второе назначение - использования принципа инкапсуляции над сырыми данными - удобно превращать сырые данные в экземпляр нужного класса и работать с ним.

Например есть источник данных:
```
data = {
    field_one: 1,
    field_two: 2,
    ...
    field_ten: 10
}
```
И класс
```
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
Задача - инициализировать экземпляр класса `ProgressionClass` с данными `data`. Несколько возможных вариантов:
- Передать их аргументами в конструктор
- Создать фабричный метод, который будет принимать данные и создавать из них экземпляр
- Создать метод, который применяет к экземпляру переданные данные

Каждый из этих способов треубует написания императивного кода.

Библиотека предлагает декларативный стиль для описания преобразований данных и функции для работы с ними.
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
- Функции
 - [Десериализация сырых данных](#deserialize)
 - [Сериализация экземпляра](#serialize)
- Декораторы
 - [Базовый декоратор JsonName](#jsonname)
 - [Декоратор для чтения JsonNameReadonly](#jsonnamereadonly)
 - [Декоратор для вложенных классов JsonStruct](#jsonstruct)
 - [Декоратор для метаданных JsonMeta](#jsonmeta)
 - [Декоратор для массивов JsonArray](#jsonarray)

### deserialize
Функция из пакета `tserialize`, нужна для превращения сырых данных в экземпляр класса

##### Импорт
```
import { deserialize } from 'tserialize';
```

##### Сигнатура
```
function deserialize<T>(rawData: any, TargetClass: { new (...args: Array<any>): T }): T
```

##### Пример использования
```
class Foo {}

const fooInstance = deserialize<Foo>(rawData, Foo);
```

##### Рекомендации
Рекомендуется вызов функции `deserialize` оборачивать в static-метод вашего класса и называть его `fromServer`.
```
class Foo {
    static fromServer(data: object): Foo {
        return deserialize<Foo>(data, Foo);
    }
}
```
- Во-первых, это красиво - "Эй, класс, дай мне свой экземпляр на основе этих данных"
- Во-вторых, это зарезервированное имя static-метода и библиотека будет пытаться его использовать при работе с декораторами [JsonStruct](#jsonstruct) и [JsonMeta](#jsonmeta).
- В третьих, в метод `fromServer` можно поместить еще какую-нибудь логику инициализации.


### serialize
Функция из пакета для превращения экземпляра класса в сырые данные, например для передачи на сервер.

##### Импорт
```
import { serialize } from 'teserialize';
```

##### Сигнатура
```
function serialize(model: { [key: string]: any }): object
```

##### Пример использования
```
class Foo {}

const fooInstance = new Foo();
const dataToServer = serialize(fooInstance);
```

##### Рекомендации
Рекомендуется вызов функции `serialize` оборачивать в метод вашего класса и называть его `toServer`.
```
class Foo {
    toServer(): object {
        return serialize(this);
    }
}
```
- Во-первых, это красиво - "Эй, экземпляр, превратись в вид для отправки на сервер"
- Во-вторых, это зарезервированное имя и библиотека будет пытаться его использовать с декораторами [JsonStruct](#jsonstruct) и [JsonMeta](#jsonmeta).
- В третьих, в метод `toServer` можно поместить еще какую-нибудь логику для обработки данных.


### JsonName
Помечает поле как подлежащее сериализации.
Самый базовый декоратор библиотеки. Все остальные реализованы с его помощью.

##### Сигнатура
```
JsonName<T>(
            name?: string,
            serialize?: (obj: T, instance: any) => any,
            deserialize?: (serverObj: any) => T)
        )
```
- name - название ключа, под которым в чистых данных лежит нужное значение. Если отсутствует - будет использовано название поля.
- serialize - функция, преобразующая значение поля при работе [serialize](#serialize). Если значение поля `null/undefined`, или функция-сериализатор вернет `null/undefined` - поле не попадет в сериализованный объект
- deserialize - функция, "очищающая" входные данные, работает при [deserialize](#desrialize)

##### Пример
```
class Foo {
    @JsonName()
    firstName: string;

    @JsonName('last_name, value => value.toUpperCase())
    lastName: string;

    @JsonName('sex', value => value ? 'M' : 'F', value: string => value === 'M' : true : false)
    sex: boolean;

    @JsonName()
    alwaysNull: string = null; // Поле не будет изменяться далее и не попадет в результат сериализации

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
f.alwaysNull2 = 'hello'; // Сериализатор возвращает null, не попадет в результат
const serialized = f.toServer(); // { firstName: 'Name', last_name: 'LAST', sex: 'M' }
```

### JsonNameReadonly
Подобен JsonName с обнуляющим сериализатором. Используется тогда, когда нужно только получить данные и не нужно сериализовать их для отправки.

*При сериализации поле под этим декоратором никогда не попадет в результат*
##### Сигнатура
```
JsonNameReadonly<T>(
            name?: string,
            deserialize?: (serverObj: any) => T)
        )
```
- name - название ключа, под которым в чистых данных лежит нужное значение
- deserialize - функция, "очищающая" входные данные, работает при [deserialize](#desrialize)

### JsonStruct
Декоратор для сериализации вложенных объектов, в которых так же поля декорированы для сериализации.

Если во вложенном классе есть метод fromServer - он будет использован для десериализации. Если нет - вызовется обычный deserialize

Если во вложенном классе есть метод toServer - он будет использован для сериализации. Если нет - вызовется обычный serialize

##### Сигнатура
```
function JsonStruct(
    proto: any
    name?: string
)
```
- proto - конструктор класса вложенной структуры
- name - название ключа для данных

##### Пример
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
Подобен JsonStruct, но данные берет не из ключа, а из исходного объекта. Нужен для преобразования плоских-композитных моделей.
Например, объект чистых данных содержит овер9000 ключей, которые по логике относятся к разным сущностям.
И вы, как хороший разработчик, хотите осуществить декомпозицию на мелкие самостоятельные сущности.

##### Сигнатура
```
function JsonMeta(proto: any)
```
- proto - конструктор класса, в который будет выделяться плоская структура

##### Пример
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
Декоратор для сериализации/десериализации массивов сериализуемых экземпляров.
Использует внутренние реализации toServer/static fromServer если они есть, а если нет - нативные serialize/deserialize

##### Сигнатура
```
function JsonArray(proto, name)
```
proto - класс, экземпляры которого будут храниться в массиве

##### Пример
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