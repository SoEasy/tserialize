import { JsonNameMetadataKey, ParentKey } from './metadata-key';

/**
 * @description Хэлпер для сериализации классов, имеющих поля с навешанным декоратором JsonName. Сериализует только те
 *     поля, у которых есть декоратор и задано начальное значение.
 * @param model - экземпляр класса, который надо превратить в данные для отправки серверу по JSONRPC
 * @returns {{}} - обычный объект JS
 */
export function serialize(model: { [key: string]: any }): object {
    const result = {};
    const target = Object.getPrototypeOf(model);
    for (const propName in model) {
        const serializeProps = (Reflect as any).getMetadata(JsonNameMetadataKey, target, propName);
        if (serializeProps) {
            const serialize = serializeProps.serialize;
            const jsonName = serializeProps.name;
            const jsonValue = model[propName];
            const serializedValue = serialize ? serialize(jsonValue, model) : jsonValue;
            if (![null, undefined].includes(serializedValue)) {
                if (jsonName !== ParentKey) {
                    result[jsonName] = serializedValue;
                } else {
                    Object.assign(result, serializedValue);
                }
            }
        }
    }
    return result;
}
