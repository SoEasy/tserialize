import { Decorator } from '../../types';

export function JsonName<T>(
    name?: string,
    serialize?: (obj: T, instance: any) => any,
    deserialize?: (serverObj: any) => T
): Decorator {
    return null;
}
