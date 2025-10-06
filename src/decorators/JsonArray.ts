import { JsonName } from './JsonName';
import { serialize } from './../serialize';
import { deserialize } from './../deserialize';
import { TDeserializeFunc, TSerializeConfig } from 'core/types';

/**
 * Декоратор для сериализации-десериализации массивов экземпляров.
 * @param proto - конструктор класса, экземпляры которой лежат в массиве
 * @param {string} name - кастомное имя поля в сырых данных
 * @returns {(target: object, propertyKey: string) => void} - декоратор
 * @constructor
 */
export function JsonArray(proto: any, name?: string): (target: object, propertyKey: string) => void {
    const serializer = (value: any, _: any, config?: TSerializeConfig): any => {
        if (!value || !(value instanceof Array)) {
            return null;
        }
        return value.map(
            item => {
                let model = item;
                if (item && !(item instanceof proto) && config && config.autoCreateModelForRawData && typeof item === 'object') {
                    const itemInstance = new proto();
                    Object.assign(itemInstance, item);
                    model = itemInstance;
                }

                if (model instanceof proto) {
                    return model.toServer ? model.toServer(config) : serialize(model, config);
                }
            }
        ).filter(i => !!i);
    };

    const deserializer: TDeserializeFunc<any> = (value, _, config): any => {
        if (!value || !(value instanceof Array)) {
            return null;
        }
        return value.map(
            item => proto.fromServer ? proto.fromServer(item) : deserialize(item, proto, config)
        );
    };

    return JsonName.call(null, name, serializer, deserializer);
}
