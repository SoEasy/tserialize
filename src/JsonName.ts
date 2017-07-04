import { JsonNameMetadataKey } from './metadata-key';

/**
 * @description Декоратор для полей модели, указывающий как называется поле в JSONRPC-ответе/запросе и как его
 *     сериализовать/десериализовать. Поле в классе обязательно должно иметь начальное значение, хоть null.
 *     Неинициированные поля не будут обработаны декоратором.
 * @param name - название поля для JSONRPC-запроса/ответа. В нотации snake_case.
 * @param serialize - функция, сериализующая значение поля для отправки на сервер или что-то с ним делающая.
 * @param deserialize - функция, разбирающая значение от сервера
 */
export function JsonName<T>(
    name?: string,
    serialize?: (obj: T) => any,
    deserialize?: (serverObj: any, cls: { new (...args: Array<any>): T }) => T
): (target: object, propertyKey: string) => void {
    return (target: object, propertyKey: string): void => {
        name = name ? name : propertyKey;
        // (Reflect as any) - typo-хак, пока конфликтуют reflect-metadata и ES6 Reflect
        (Reflect as any).defineMetadata(JsonNameMetadataKey, { name, serialize, deserialize }, target, propertyKey);
    };
}
