import { ParentKey } from '../metadata-key';
import { PropertyMetadata } from '../meta-store';
import { serialize } from './serialize';

export function serializeValue(metadata: PropertyMetadata, value: any, instance: any): any {
    if (!metadata) {
        return;
    }

    const jsonName = metadata.targetKey;
    const isNestedProp = jsonName === ParentKey;

    if (metadata.struct) {
        const serializer = value ? value.toServer : null;
        return serializer ? serializer.call(value) : (value ? serialize(value) : null);
    } else {
        const serializer = metadata.serialize;
        return serializer ? serializer(value, instance) : (isNestedProp ? serialize(value) : value);
    }
}

export function assignSerializedValueToResult(metadata: PropertyMetadata, serializedValue: any, result: any): void {
    if (![null, undefined].includes(serializedValue)) {
        const jsonName = metadata.targetKey;
        if (jsonName !== ParentKey) {
            result[jsonName] = serializedValue;
        } else {
            Object.assign(result, serializedValue);
        }
    }
}
