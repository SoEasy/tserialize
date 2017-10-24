import { JsonName } from './JsonName';

export function JsonNameReadonly<T>(
    name?: string,
    deserialize?: (rawValue: any, rawData?: any) => T
): (target: object, propertyKey: string) => void {
    return JsonName.call(null, name, () => null, deserialize);
}
