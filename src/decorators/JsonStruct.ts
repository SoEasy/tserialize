import { PropertyMetaBuilder, RootMetaStore } from './../core';
import { deserialize } from './../deserialize';

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

        const deserializeFunc = proto.fromServer ? proto.fromServer : (value): any => deserialize(value, proto);

        const propertyMetadata = PropertyMetaBuilder.make(propertyKey, rawName).deserializer(deserializeFunc).struct().raw;
        RootMetaStore.setupPropertyMetadata(target, propertyMetadata);
    };
}
