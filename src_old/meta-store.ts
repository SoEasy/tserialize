export interface PropertyMetadata {
    propertyKey: string;
    targetKey: string;
    serialize?: (value: any, instance: any) => any;
    deserialize?: (serverObj: any) => any;
    struct: boolean;
}

export class MetaStore {
    private propertiesMetaStore: Record<string, PropertyMetadata> = {};
    private keyPropertyInversion: Record<string, string> = {};
    private propertyKeys: Array<string> = [];

    addProperty<T>(
        propertyKey: string,
        targetKey: string,
        struct: boolean = false,
        serialize?: (obj: T, instance: any) => any,
        deserialize?: (serverObj: any) => T
    ): void {
        if (this.propertiesMetaStore[propertyKey]) {
            console.warn(`Property "${propertyKey}" already have metadata for serialization`);
        }

        this.propertiesMetaStore[propertyKey] = {
            propertyKey,
            targetKey,
            struct,
            serialize,
            deserialize
        };

        this.propertyKeys.push(propertyKey);

        if (this.keyPropertyInversion[targetKey]) {
            console.warn(`Target key "${targetKey}" already taken`);
        }
        this.keyPropertyInversion[targetKey] = propertyKey;
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
