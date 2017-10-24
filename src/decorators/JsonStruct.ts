import { MetaStore } from 'utils';
import { deserialize } from 'deserialize';

export function JsonStruct(name?: string): (target: object, propertyKey: string) => void {
    return (target: object, propertyKey: string): void => {
        const proto = (Reflect as any).getMetadata('design:type', target, propertyKey);
        const metaStore: MetaStore = MetaStore.getMetaStore(target);

        const rawKey = name ? name : propertyKey;
        const deserializer = proto.fromServer ? proto.fromServer : (value): any => deserialize(value, proto);

        metaStore.make(propertyKey).name(rawKey).deserializator(deserializer).struct();
    };
}
