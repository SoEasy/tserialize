import { JsonNameMetadataKey, ParentKey } from './metadata-key';
import { MetaStore } from './meta-store';

/**
 * @description Хэлпер для сериализации классов, имеющих поля с навешанным декоратором JsonName. Сериализует только те
 *     поля, у которых есть декоратор и задано начальное значение.
 * @param model - экземпляр класса, который надо превратить в данные для отправки серверу по JSONRPC
 * @returns {{}} - обычный объект JS
 */
export function serialize(model: { [key: string]: any }): object {
    const result = {};
    const target = Object.getPrototypeOf(model);
    const metaStore: MetaStore = (Reflect as any).getMetadata(JsonNameMetadataKey, target);

    for (const propertyKey in model) {
        const serializeProps = metaStore.getPropertyMeta(propertyKey);
        if (serializeProps) {
            const jsonName = serializeProps.targetKey;
            const isNestedProp = jsonName === ParentKey;
            const jsonValue = model[propertyKey];
            let serializedValue = null;

            if (serializeProps.struct) {
                const serializer = jsonValue ? jsonValue.toServer : null;
                serializedValue = serializer ? serializer.call(jsonValue) : (jsonValue ? serialize(jsonValue) : null);
            } else {
                const serializer = serializeProps.serialize;
                serializedValue = serializer
                    ? serializer(jsonValue, model)
                    : (isNestedProp ? serialize(jsonValue) : jsonValue);
            }

            if (![null, undefined].includes(serializedValue)) {
                if (!isNestedProp) {
                    result[jsonName] = serializedValue;
                } else {
                    Object.assign(result, serializedValue);
                }
            }
        }
    }
    return result;
}
