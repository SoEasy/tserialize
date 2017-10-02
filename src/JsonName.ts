import { JsonNameMetadataKey, ParentKey } from './metadata-key';
import { MetaStore } from 'meta-store';
import { deserialize } from './deserialize';
import { serialize } from './serialize';

export type Decorator = (target: object, propertyKey: string) => void;

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
    name?: string
): Decorator {
    return (target: object, propertyKey: string): void => {
        const proto = (Reflect as any).getMetadata('design:type', target, propertyKey);
        if (!(Reflect as any).hasMetadata(JsonNameMetadataKey, target)) {
            (Reflect as any).defineMetadata(JsonNameMetadataKey, new MetaStore(), target);
        }
        const metaStore: MetaStore = (Reflect as any).getMetadata(JsonNameMetadataKey, target);
        const targetKey = name ? name : propertyKey;
        const deserializer = proto.fromServer ? proto.fromServer : (value): any => deserialize(value, proto);

        metaStore.addProperty(
            propertyKey,
            targetKey,
            true,
            null,
            deserializer
        );
    };
}

export function JsonMeta(): Decorator {
    return JsonStruct.call(null, ParentKey);
}

export function JsonRaw(): Decorator {
    throw new Error('Not implemented');
}

export function JsonArray(proto: any, name?: string): Decorator {
    return (target: object, propertyKey: string): void => {
        // const proto = (Reflect as any).getMetadata('design:type', target, propertyKey);
        if (!(Reflect as any).hasMetadata(JsonNameMetadataKey, target)) {
            (Reflect as any).defineMetadata(JsonNameMetadataKey, new MetaStore(), target);
        }
        const metaStore: MetaStore = (Reflect as any).getMetadata(JsonNameMetadataKey, target);
        const targetKey = name ? name : propertyKey;

        const serializer = (value): any => {
            if (!value || !(value instanceof Array)) {
                return null;
            }
            return value.map(
                item => {
                    if (item instanceof proto) {
                        return item.toServer ? item.toServer() : serialize(item);
                    }
                }
            ).filter(i => !!i);
        };

        const deserializer = (value): any => {
            if (!value || !(value instanceof Array)) {
                return null;
            }
            return value.map(
                item => proto.fromServer ? proto.fromServer(item) : deserialize(item, proto)
            );
        };

        metaStore.addProperty(
            propertyKey,
            targetKey,
            false,
            serializer,
            deserializer
        );
    };
}
