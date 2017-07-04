import { JsonNameMetadataKey } from './metadata-key';

/**
 * @description Хэлпер для разбора данных, пришедших по JSONRPC от сервера в нашу модель
 * @param data - данные от сервера
 * @param cls - класс, в экземпляр которого надо превратить данные
 * @returns {T} - экземпляр класса cls, заполненный данными
 */
export function deserialize<T>(data: any, cls: { new (...args: Array<any>): T }): T {
    const retVal = new cls();
    const target = Object.getPrototypeOf(retVal);

    for (const propName in retVal) {
        if (!Object.prototype.hasOwnProperty.call(retVal, propName)) continue;
        const serializeProps = (Reflect as any).getMetadata(JsonNameMetadataKey, target, propName);
        if (serializeProps) {
            const deserialize = serializeProps.deserialize;
            const jsonName = serializeProps.name;
            const jsonValue = data[jsonName];
            if (typeof jsonValue !== 'undefined') {
                retVal[propName] = deserialize ? deserialize(jsonValue) : jsonValue;
            }
        }
    }

    return retVal;
}
