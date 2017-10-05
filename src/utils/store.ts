import { JsonNameMetadataKey } from './consts';

export interface PropertyMetadata {
    propertyKey: string;
    rawKey: string;
    serialize?: (value: any, instance: any) => any;
    deserialize?: (rawValue: any, rawData?: any) => any;
    isStruct: boolean;
    isLate: boolean;
}

export class MetaStore {
    /**
     * @description Для имени поля в классе хранит его мета-информацию
     */
    private propertiesMetaStore: Record<string, PropertyMetadata> = {};

    /**
     * @description Хранит зависимость "сырое поле" <-> "поле в объекте"
     */
    private keyPropertyInversion: Record<string, string> = {};

    /**
     * @description Простое хранилище всех декорированных полей, нужно для восстановления объекта
     */
    private propertyKeys: Array<string> = [];

    /**
     * @description Поле для хранения промежуточного значения ключа, с которым работает builder
     */
    private currentPropertyKey: string = null;

    private get currentMetadata(): PropertyMetadata {
        return this.propertiesMetaStore[this.currentPropertyKey];
    }

    static getMetaStore(target: any): MetaStore {
        if (!(Reflect as any).hasMetadata(JsonNameMetadataKey, target)) {
            (Reflect as any).defineMetadata(JsonNameMetadataKey, new MetaStore(), target);
        }
        return (Reflect as any).getMetadata(JsonNameMetadataKey, target);
    }

    make(propertyKey: string): MetaStore {
        this.currentPropertyKey = propertyKey;
        if (this.currentMetadata) {
            console.warn(`Property "${propertyKey}" already have metadata for serialization`);
        }

        this.propertiesMetaStore[propertyKey] = this.currentMetadata || {
            propertyKey,
            rawKey: propertyKey,
            isStruct: false,
            isLate: false
        };
        this.propertyKeys.push(propertyKey);
        this.keyPropertyInversion[propertyKey] = propertyKey;
        return this;
    }

    name(rawKey: string): MetaStore {
        if (!rawKey) {
            return this;
        }
        this.currentMetadata.rawKey = rawKey;
        delete this.keyPropertyInversion[this.currentPropertyKey];
        this.keyPropertyInversion[rawKey] = this.currentPropertyKey;
        return this;
    }

    struct(): MetaStore {
        this.currentMetadata.isStruct = true;
        return this;
    }

    late(): MetaStore {
        this.currentMetadata.isLate = true;
        return this;
    }

    serializator<T = any>(serializator: (value: T, instance: any) => any): MetaStore {
        if (!serializator) { return this; }
        this.currentMetadata.serialize = serializator;
        return this;
    }

    deserializator<T>(deserializator: (rawValue: any, rawData?: any) => T): MetaStore {
        if (!deserializator) { return this; }
        this.currentMetadata.deserialize = deserializator;
        return this;
    }

    addStructProperty(propertyName: string, target: any): void {
        console.log('add struct property', propertyName, target, target.fromServer);
    }

    getPropertyMeta(propertyKey: string): PropertyMetadata {
        return this.propertiesMetaStore[propertyKey];
    }

    getPropertyKeys(): Array<string> {
        return this.propertyKeys;
    }

    getTargetKeyMeta(targetKey: string): PropertyMetadata {
        const propertyKey = this.keyPropertyInversion[targetKey];
        return propertyKey ? this.propertiesMetaStore[propertyKey] : null;
    }
}
