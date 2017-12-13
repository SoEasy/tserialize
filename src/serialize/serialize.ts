import { MetaStore, PropertyMetadata, ParentKey } from './../utils';

function serializeValue(metadata: PropertyMetadata, value: any, instance: any): any {
    if (!metadata) {
        return;
    }

    if (metadata.isStruct) {
        const serializer = value ? value.toServer : null;
        return serializer ? serializer.call(value) : (value ? serialize(value) : null);
    } else {
        const serializer = metadata.serialize;
        return serializer ? serializer(value, instance) : value;
    }
}

function assignSerializedValueToResult(metadata: PropertyMetadata, serializedValue: any, result: any): void {
    if (![null, undefined].includes(serializedValue)) {
        const jsonName = metadata.rawKey;
        if (jsonName !== ParentKey) {
            result[jsonName] = serializedValue;
        } else {
            Object.assign(result, serializedValue);
        }
    }
}

/**
 * @description Хэлпер для сериализации классов, имеющих поля с навешанным декоратором JsonName. Сериализует только те
 *     поля, у которых есть декоратор и задано начальное значение.
 * @param model - экземпляр класса, который надо превратить в данные для отправки серверу по JSONRPC
 * @returns {{}} - обычный объект JS
 */
export function serialize(model: { [key: string]: any }): object {
    const result = {};
    const target = Object.getPrototypeOf(model);

    const metaStore: MetaStore = MetaStore.getMetaStore(target);

    const modelKeys = metaStore.getPropertyKeys();
    for (const propertyKey of modelKeys) {
        if (!metaStore.hasOwnProperty(target, propertyKey)) {
            continue;
        }
        const metadata = metaStore.getPropertyMeta(propertyKey);
        const serializedValue = serializeValue(metadata, model[propertyKey], model);
        assignSerializedValueToResult(metadata, serializedValue, result);
    }
    return result;
}
