import { TSerializeConfig } from 'core/types';
import { PropertyMetaBuilder, RootMetaStore } from './../core';
import { deserialize } from './../deserialize';
import { serialize } from './../serialize';

/**
 * Декоратор для сериализаци-дерериализации аггрегированных моделей.
 * Для сериализации использует toServer метод экземпляра.Если его нет - просто serialize.
 * Для десериализации использует статический метод fromServer. Если его нет - просто deserialize.
 * @param TargetClass - конструктор аггрегированной модели
 * @param {string} rawName - кастомное имя поля в сырых данных
 * @returns {(target: object, propertyKey: string) => void} - декоратор
 * @constructor
*/
export function JsonStruct(TargetClass: any, rawName?: string): (target: object, propertyKey: string) => void {
    return (target: object, propertyKey: string): void => {
        const proto = TargetClass;

        const deserializeFunc = proto.fromServer
            // tslint:disable-next-line
            ? function (value) { return proto.fromServer(value); }
            : (value, _, config): any => value !== null ? deserialize(value, proto, config) : null;

        const serializerFunc = (value: any, _: any, config?: TSerializeConfig) => {
            if (!value) {
                return null;
            }

            if (value.toServer) {
                return value.toServer.call(value, config);
            }

            let model = value;

            if (!(model instanceof proto) && config && config.autoCreateModelForRawData) {
                model = new proto();
                Object.assign(model, value);
            }

            return serialize(model, config)
        }

        const propertyMetadata = PropertyMetaBuilder.make(propertyKey, rawName).deserializer(deserializeFunc).serializer(serializerFunc).struct().raw;
        RootMetaStore.setupPropertyMetadata(target, propertyMetadata);
    };
}
