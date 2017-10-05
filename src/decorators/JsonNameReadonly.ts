import { Decorator } from 'utils';
import { JsonName } from './JsonName';

export function JsonNameReadonly<T>(
    name?: string,
    deserialize?: (rawValue: any, rawData?: any) => T
): Decorator {
    return JsonName.call(null, name, () => null, deserialize);
}
