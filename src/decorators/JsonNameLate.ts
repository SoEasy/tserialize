import { Decorator, MetaStore } from 'utils';

export function JsonNameLate<T>(
    name?: string,
    serialize?: (value: T, instance: any) => any,
    deserialize?: (rawValue: any, rawData?: any) => T
): Decorator {
    return (target: object, propertyKey: string): void => {
        const metaStore: MetaStore = MetaStore.getMetaStore(target);
        const rawKey = name ? name : propertyKey;
        metaStore.make(propertyKey).name(rawKey).serializator(serialize).deserializator(deserialize).late();
    };
}
