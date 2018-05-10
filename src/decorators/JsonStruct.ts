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
export function JsonStruct(TargetClass?: any, rawName?: string): (target: object, propertyKey: string) => void {
    return (target: object, propertyKey: string): void => {
        const isDeprecatedUsage = !TargetClass || typeof TargetClass === 'string';

        if (isDeprecatedUsage) {
            const targetClassName = (Reflect as any).getMetadata('design:type', target, propertyKey).name;
            console.error(
                `JsonStruct signature has changed, use(copy it) "JsonStruct(${targetClassName}${TargetClass ? `, '${TargetClass}'` : ''})"`
            );
        }

        const proto = isDeprecatedUsage ? (Reflect as any).getMetadata('design:type', target, propertyKey) : TargetClass;
        const name = isDeprecatedUsage ? TargetClass : rawName;

        const deserializeFunc = proto.fromServer ? proto.fromServer : (value): any => deserialize(value, proto);

        const propertyMetadata = PropertyMetaBuilder.make(propertyKey, name).deserializer(deserializeFunc).struct().raw;
        RootMetaStore.setupPropertyMetadata(target, propertyMetadata);
    };
}
