import { Decorator } from '../../types';

export function JsonNameReadonly<T>(
    name?: string,
    deserialize?: (serverObj: any) => T
): Decorator {
    return null;
}
