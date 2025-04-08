import { TDeserializeConfig } from './../core/types';
import { ClassMetaStore, ParentKey, RootMetaStore } from './../core';

/**
 * Хэлпер для десериализации сырых данных в экземпляр данного класса
 * @param data - сырые данные
 * @param {{new(...args: any[]): T}} cls - конструктор класса, в экземпляр которого надо превратить данные
 * @returns {T} - экземпляр
 */
export function deserialize<T>(data: any, cls: { new (...args: Array<any>): T }, config: TDeserializeConfig = { makeInstance: true }): T {
    const { makeInstance } = config;
    const retVal = makeInstance ? new cls() : {};
    const targetClass = cls.prototype;
    let metaStore: ClassMetaStore = RootMetaStore.getClassMetaStore(targetClass);
    const lateFields: Array<string> = [];

    if (!metaStore) {
        const possibleParent = Object.getPrototypeOf(targetClass);
        if (possibleParent && possibleParent.constructor.name !== 'Object') {
            // TODO make while loop until reach Object prototype or exists metaStore
            metaStore = RootMetaStore.getClassMetaStore(possibleParent);
        }
    }

    const modelKeys = metaStore.propertyKeys;
    for (const propertyKey of modelKeys) {
        const serializeProps = metaStore.getMetadataByPropertyKey(propertyKey);
        if (serializeProps.isLate) {
            lateFields.push(propertyKey);
            continue;
        }
        if (serializeProps) {
            const deserialize = serializeProps.deserialize;
            const jsonName = serializeProps.rawKey;
            const jsonValue = jsonName !== ParentKey ? data[jsonName] : data;
            if (typeof jsonValue !== 'undefined') {
                retVal[serializeProps.propertyKey] = deserialize ? deserialize(jsonValue, data, config) : jsonValue;
            }
        }
    }

    // TODO remove duplicate
    for (const propertyKey of lateFields) {
        const serializeProps = metaStore.getMetadataByPropertyKey(propertyKey);
        if (serializeProps) {
            const deserialize = serializeProps.deserialize;
            const jsonName = serializeProps.rawKey;
            const jsonValue = jsonName !== ParentKey ? data[jsonName] : data;
            if (typeof jsonValue !== 'undefined') {
                retVal[serializeProps.propertyKey] = deserialize ? deserialize(jsonValue, retVal, config) : jsonValue;
            }
        }
    }

    return retVal as T;
}
