import { JsonName } from './JsonName';
import { serialize } from './../serialize';
import { deserialize } from './../deserialize';

/**
 * Декоратор для сериализации-десериализации массивов экземпляров.
 * @param proto - конструктор класса, экземпляры которой лежат в массиве
 * @param {string} name - кастомное имя поля в сырых данных
 * @returns {(target: object, propertyKey: string) => void} - декоратор
 * @constructor
 */
export function JsonArray(proto: any, name?: string): (target: object, propertyKey: string) => void {
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

    return JsonName.call(null, name, serializer, deserializer);
}
