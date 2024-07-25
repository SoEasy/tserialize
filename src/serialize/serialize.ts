import { TSerializeConfig } from './../core/types';
import { ClassMetaStore, ParentKey, PropertyMetadata, RootMetaStore } from './../core';

function serializeValue(metadata: PropertyMetadata, value: any, instance: any, config: TSerializeConfig): any {
    if (!metadata) {
        return;
    }

    if (metadata.isStruct) {
        const serializer = metadata.serialize;
        if (serializer) {
            return serializer(value, instance, config)
        }

        return value ? serialize(value, config) : null;
    } else {
        const serializer = metadata.serialize;
        return serializer ? serializer(value, instance, config) : value;
    }
}

function assignSerializedValueToResult(metadata: PropertyMetadata, serializedValue: any, result: any, config: TSerializeConfig): void {
    const nonSerializableValues = config.allowNullValues ? [undefined] : [undefined, null];
    if (!nonSerializableValues.includes(serializedValue)) {
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
 *     поля, у которых есть декоратор и есть значение.
 * @param model - экземпляр класса, который надо превратить в данные для отправки серверу по JSONRPC
 * @returns {{}} - обычный объект JS
 */
export function serialize(model: { [key: string]: any }, config: TSerializeConfig = { allowNullValues: false, autoCreateModelForRawData: false }): object {
    const result = {};
    const targetClass = Object.getPrototypeOf(model);

    let metaStore: ClassMetaStore = RootMetaStore.getClassMetaStore(targetClass);
    // Всякое бывает, мб кто-то сериализует объект без декораторов
    if (!metaStore) {
        const possibleParent = Object.getPrototypeOf(targetClass);

        if (possibleParent && possibleParent.constructor.name !== 'Object') {
            // TODO make while loop until reach Object prototype or exists metaStore
            metaStore = RootMetaStore.getClassMetaStore(possibleParent);
            if (!metaStore) {
                return {};
            }
        } else {
            return {};
        }
    }

    const modelKeys = metaStore.propertyKeys;
    for (const propertyKey of modelKeys) {
        const metadata = metaStore.getMetadataByPropertyKey(propertyKey);
        const serializedValue = serializeValue(metadata, model[propertyKey], model, config);
        assignSerializedValueToResult(metadata, serializedValue, result, config);
    }
    return result;
}
