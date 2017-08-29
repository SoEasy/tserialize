import { JsonNameMetadataKey } from './metadata-key';
import { MetaStore } from 'meta-store';

/**
 * @description Декоратор для полей модели, указывающий как называется поле в JSONRPC-ответе/запросе и как его
 *     сериализовать/десериализовать. Поле в классе обязательно должно иметь начальное значение, хоть null.
 *     Неинициированные поля не будут обработаны декоратором.
 * @param name - название поля для JSONRPC-запроса/ответа.
 * @param serialize - функция, сериализующая значение поля для отправки на сервер или что-то с ним делающая.
 * @param deserialize - функция, разбирающая значение от сервера
 */
export function JsonName<T>(
    name?: string,
    serialize?: (obj: T, instance: any) => any,
    deserialize?: (serverObj: any) => T
): (target: object, propertyKey: string) => void {
    return (target: object, propertyKey: string): void => {
        if (!(Reflect as any).hasMetadata(JsonNameMetadataKey, target)) {
            (Reflect as any).defineMetadata(JsonNameMetadataKey, new MetaStore(), target);
        }
        const metaStore: MetaStore = (Reflect as any).getMetadata(JsonNameMetadataKey, target);
        const targetKey = name ? name : propertyKey;
        metaStore.addProperty<T>(
            propertyKey,
            targetKey,
            target,
            serialize,
            deserialize
        );
        // (Reflect as any) - typo-хак, пока конфликтуют reflect-metadata и ES6 Reflect
        // (Reflect as any).defineMetadata(JsonNameMetadataKey, { name, serialize, deserialize }, target, propertyKey);
    };
}

/**
 * @description Декоратор для поля, которое ни при каких обстоятельствах не поедет в сериализованный объект
 * @param name - название поля, из которого при десериализации взять данные
 * @param deserialize - функция-десериализатор
 */
export function JsonNameReadonly<T>(
    name?: string,
    deserialize?: (serverObj: any) => T
): (target: object, propertyKey: string) => void {
    return JsonName.call(null, name, () => null, deserialize);
}
