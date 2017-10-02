import { JsonNameMetadataKey } from '../metadata-key';
import { MetaStore } from '../meta-store';
import { assignSerializedValueToResult, serializeValue } from './helpers';

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

    const modelKeys = metaStore.getPropertyKeys();
    for (const propertyKey of modelKeys) {
        const metadata = metaStore.getPropertyMeta(propertyKey);
        const serializedValue = serializeValue(metadata, model[propertyKey], model);
        assignSerializedValueToResult(metadata, serializedValue, result);
    }
    return result;
}
