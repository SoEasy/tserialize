import { PropertyMetadata, TDeserializeFunc, TSerializeFunc } from './types';

export class PropertyMetaBuilder {
    private data: PropertyMetadata = {
        propertyKey: null,
        rawKey: null
    };

    static make(propertyKey: string, name: string): PropertyMetaBuilder {
        const retVal = new PropertyMetaBuilder();
        retVal.data.propertyKey = propertyKey;
        retVal.data.rawKey = name || propertyKey;
        return retVal;
    }

    struct(): PropertyMetaBuilder {
        this.data.isStruct = true;
        return this;
    }

    late(): PropertyMetaBuilder {
        this.data.isLate = true;
        return this;
    }

    serializer(serializeFunc?: TSerializeFunc<any>): PropertyMetaBuilder {
        if (!serializeFunc) { return this; }
        this.data.serialize = serializeFunc;
        return this;
    }

    deserializer(deserializeFunc?: TDeserializeFunc<any>): PropertyMetaBuilder {
        if (!deserializeFunc) { return this; }
        this.data.deserialize = deserializeFunc;
        return this;
    }

    get raw(): PropertyMetadata {
        return this.data;
    }
}