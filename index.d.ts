// Generated by dts-bundle v0.7.2

/**
  * @description Хэлпер для сериализации классов, имеющих поля с навешанным декоратором JsonName. Сериализует только те
  *     поля, у которых есть декоратор и есть значение.
  * @param model - экземпляр класса, который надо превратить в данные для отправки серверу по JSONRPC
  * @returns {{}} - обычный объект JS
  */
export function serialize(model: {
    [key: string]: any;
}): object;

/**
  * Декоратор для сериализации-десериализации массивов экземпляров.
  * @param proto - конструктор класса, экземпляры которой лежат в массиве
  * @param {string} name - кастомное имя поля в сырых данных
  * @returns {(target: object, propertyKey: string) => void} - декоратор
  * @constructor
  */
export function JsonArray(proto: any, name?: string): (target: object, propertyKey: string) => void;

/**
  * Декоратор без аргументов для объявления структуры, чтобы мапить плоские данные в аггрегированные объекты
  * @returns {(target: object, propertyKey: string) => void} - декоратор
  * @constructor
  */
export function JsonMeta(TargetClass: any): (target: object, propertyKey: string) => void;

/**
  * Декоратор для примитивного маппинга поля между экземпляром и сырыми данными
  * @param {string} name - кастомное имя поля, которое будет в сырых данных
  * @param {(value: T, instance: any) => any} serialize - функция-сериализатор, получает значение поля и экземпляр, вовзвращает значение.
  * Если значения нет - сериализатор не будет вызван и поле не попадет в результирующий объект.
  * Если сериализатор вернул null/undefined - значение так же не попадет в результирующий объект.
  * @param {(rawValue: any, rawData?: any) => T} deserialize - функция-десериализатор
  * @returns {(target: object, propertyKey: string) => void} - декоратор
  * @constructor
  */
export function JsonName<T>(name?: string, serialize?: (value: T, instance: any) => any, deserialize?: (rawValue: any, rawData?: any) => T): (target: object, propertyKey: string) => void;

/**
  * Декоратор для десериализации поля с сервера, но не на сервер
  * @param {string} name - кастомное имя поля, которое будет в сырых данных
  * @param {(rawValue: any, rawData?: any) => T} deserialize - функция-десериализатор
  * @returns {(target: object, propertyKey: string) => void} - декоратор
  * @constructor
  */
export function JsonNameReadonly<T>(name?: string, deserialize?: (rawValue: any, rawData?: any) => T): (target: object, propertyKey: string) => void;

/**
  * Декоратор для сериализаци-дерериализации аггрегированных моделей.
  * Для сериализации использует toServer метод экземпляра.Если его нет - просто serialize.
  * Для десериализации использует статический метод fromServer. Если его нет - просто deserialize.
  * @param TargetClass - конструктор аггрегированной модели
  * @param {string} rawName - кастомное имя поля в сырых данных
  * @returns {(target: object, propertyKey: string) => void} - декоратор
  * @constructor
  */
export function JsonStruct(TargetClass: any, rawName?: string): (target: object, propertyKey: string) => void;

/**
  * Декоратор для маппинга, десериализация которого работает после всех остальных полей. Сиг
  * @param {string} name - кастомное имя поля, которое будет в сырых данных
  * @param {(value: T, instance: any) => any} serialize - функция-сериализатор, получает значение поля и экземпляр, вовзвращает значение.
  * Если значения нет - сериализатор не будет вызван и поле не попадет в результирующий объект.
  * Если сериализатор вернул null/undefined - значение так же не попадет в результирующий объект.
  * @param {(rawValue: any, rawData?: any) => T} deserialize - функция-десериализатор.
  * Работает когда все остальные поля объекта уже десериализованы
  * @returns {(target: object, propertyKey: string) => void} - декоратор
  * @constructor
  */
export function JsonNameLate<T>(name?: string, serialize?: (value: T, instance: any) => any, deserialize?: (rawValue: any, rawData?: any) => T): (target: object, propertyKey: string) => void;

export interface DeserializeConfig {
    makeInstance: boolean;
}
/**
  * Хэлпер для десериализации сырых данных в экземпляр данного класса
  * @param data - сырые данные
  * @param {{new(...args: any[]): T}} cls - конструктор класса, в экземпляр которого надо превратить данные
  * @returns {T} - экземпляр
  */
export function deserialize<T>(data: any, cls: {
    new (...args: Array<any>): T;
}, config?: DeserializeConfig): T;

