import { JsonNameMetadataKey, ParentKey, MetaStore } from 'utils';

/**
 * @description Хэлпер для разбора данных, пришедших по JSONRPC от сервера в нашу модель
 * @param data - данные от сервера
 * @param cls - класс, в экземпляр которого надо превратить данные
 * @returns {T} - экземпляр класса cls, заполненный данными
 */
export function deserialize<T>(data: any, cls: { new (...args: Array<any>): T }): T {
    const retVal = new cls();
    const target = Object.getPrototypeOf(retVal);
    const metaStore: MetaStore = (Reflect as any).getMetadata(JsonNameMetadataKey, target);

    for (const propertyKey of metaStore.getPropertyKeys()) {
        const serializeProps = metaStore.getPropertyMeta(propertyKey);
        if (serializeProps) {
            const deserialize = serializeProps.deserialize;
            const jsonName = serializeProps.rawKey;
            const jsonValue = jsonName !== ParentKey ? data[jsonName] : data;
            if (typeof jsonValue !== 'undefined') {
                retVal[serializeProps.propertyKey] = deserialize ? deserialize(jsonValue) : jsonValue;
            }
        }
    }

    return retVal;
}
