import { PropertyMetaBuilder, RootMetaStore } from '../core';

/**
 * Декоратор для примитивного маппинга поля между экземпляром и сырыми данными
 * @param {string} name - кастомное имя поля, которое будет в сырых данных
 * @param {(value: T, instance: any) => any} serialize - функция-сериализатор, получает значение поля и экземпляр, вовзвращает значение.
 * Если значения нет - сериализатор не будет вызван и поле не попадет в результирующий объект.
 * Если сериализатор вернул null/undefined - значение так же не попадет в результирующий объект.
 * @param {(rawValue: any, rawData?: any) => T} deserialize - функция-десериализатор
 * @returns {(target: object, propertyKey: string) => void} - декоратор
 * @constructor
 */
export function JsonName<T>(
    name?: string,
    serialize?: (value: T, instance: any) => any,
    deserialize?: (rawValue: any, rawData?: any) => T
): (target: object, propertyKey: string) => void {
    return (target: object, propertyKey: string): void => {
        const propertyMetadata = PropertyMetaBuilder.make(propertyKey, name).serializer(serialize).deserializer(deserialize).raw;
        RootMetaStore.setupPropertyMetadata(target, propertyMetadata);
    };
}
