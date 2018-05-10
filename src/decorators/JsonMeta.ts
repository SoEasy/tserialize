import {ParentKey, PropertyMetaBuilder, RootMetaStore} from '../core';
import { deserialize } from '../deserialize';

/**
 * Декоратор без аргументов для объявления структуры, чтобы мапить плоские данные в аггрегированные объекты
 * @returns {(target: object, propertyKey: string) => void} - декоратор
 * @constructor
 */
export function JsonMeta(TargetClass?: any): (target: object, propertyKey: string) => void {
    return (target: object, propertyKey: string): void => {
        const isDeprecatedUsage = !TargetClass || typeof TargetClass === 'string';

        if (isDeprecatedUsage) {
            const targetClassName = (Reflect as any).getMetadata('design:type', target, propertyKey).name;
            console.error(
                `JsonMeta signature has changed, use(copy it) "JsonMeta(${targetClassName})"`
            );
        }

        const proto = isDeprecatedUsage ? (Reflect as any).getMetadata('design:type', target, propertyKey) : TargetClass;

        const deserializeFunc = proto.fromServer ? proto.fromServer : (value): any => deserialize(value, proto);

        const propertyMetadata = PropertyMetaBuilder.make(propertyKey, ParentKey).deserializer(deserializeFunc).struct().raw;
        RootMetaStore.setupPropertyMetadata(target, propertyMetadata);
    };
}
