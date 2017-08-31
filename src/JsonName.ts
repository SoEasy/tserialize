import { JsonNameMetadataKey, ParentKey } from './metadata-key';
import { MetaStore } from 'meta-store';

export type Decorator = (target: object, propertyKey: string) => void

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
): Decorator {
    return (target: object, propertyKey: string): void => {
        if (!(Reflect as any).hasMetadata(JsonNameMetadataKey, target)) {
            (Reflect as any).defineMetadata(JsonNameMetadataKey, new MetaStore(), target);
        }
        const metaStore: MetaStore = (Reflect as any).getMetadata(JsonNameMetadataKey, target);
        const targetKey = name ? name : propertyKey;
        metaStore.addProperty<T>(
            propertyKey,
            targetKey,
            false,
            serialize,
            deserialize
        );
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
): Decorator {
    return JsonName.call(null, name, () => null, deserialize);
}

export function JsonStruct(
    proto: any,
    name?: string
): Decorator {
    return (target: object, propertyKey: string): void => {
        if (!proto.fromServer) {
            console.warn(`JsonStruct field ${propertyKey} class not contains static method "fromServer"`);
        }
        if (!(Reflect as any).hasMetadata(JsonNameMetadataKey, target)) {
            (Reflect as any).defineMetadata(JsonNameMetadataKey, new MetaStore(), target);
        }
        const metaStore: MetaStore = (Reflect as any).getMetadata(JsonNameMetadataKey, target);
        const targetKey = name ? name : propertyKey;
        let deserializer;
        if (proto.fromServer) {
            deserializer = proto.fromServer;
        } else {
            deserializer = (value): any => value;
            console.warn(`Static method "fromServer" is not defined for nested class ${proto.name}`);
        }
        metaStore.addProperty(
            propertyKey,
            targetKey,
            true,
            null,
            deserializer
        );
    };
}

export function JsonMeta(proto: any): Decorator {
    return JsonStruct.call(null, proto, ParentKey);
}

export function JsonRaw(): Decorator {
    throw new Error('Not implemented');
}
