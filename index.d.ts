// Generated by dts-bundle v0.7.2

/**
    * @description Декоратор для полей модели, указывающий как называется поле в JSONRPC-ответе/запросе и как его
    *     сериализовать/десериализовать. Поле в классе обязательно должно иметь начальное значение, хоть null.
    *     Неинициированные поля не будут обработаны декоратором.
    * @param name - название поля для JSONRPC-запроса/ответа.
    * @param serialize - функция, сериализующая значение поля для отправки на сервер или что-то с ним делающая.
    * @param deserialize - функция, разбирающая значение от сервера
    */
export function JsonName<T>(name?: string, serialize?: (obj: T, instance: any) => any, deserialize?: (serverObj: any, cls: {
        new (...args: Array<any>): T;
}) => T): (target: object, propertyKey: string) => void;
/**
    * @description Декоратор для поля, которое ни при каких обстоятельствах не поедет в сериализованный объект
    * @param name - название поля, из которого при десериализации взять данные
    * @param deserialize - функция-десериализатор
    */
export function JsonNameReadonly<T>(name?: string, deserialize?: (serverObj: any, cls: {
        new (...args: Array<any>): T;
}) => T): (target: object, propertyKey: string) => void;

/**
  * @description Хэлпер для сериализации классов, имеющих поля с навешанным декоратором JsonName. Сериализует только те
  *     поля, у которых есть декоратор и задано начальное значение.
  * @param model - экземпляр класса, который надо превратить в данные для отправки серверу по JSONRPC
  * @returns {{}} - обычный объект JS
  */
export function serialize(model: {
    [key: string]: any;
}): object;

/**
  * @description Хэлпер для разбора данных, пришедших по JSONRPC от сервера в нашу модель
  * @param data - данные от сервера
  * @param cls - класс, в экземпляр которого надо превратить данные
  * @returns {T} - экземпляр класса cls, заполненный данными
  */
export function deserialize<T>(data: any, cls: {
    new (...args: Array<any>): T;
}): T;

