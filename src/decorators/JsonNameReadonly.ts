import { JsonName } from './JsonName';

/**
 * Декоратор для десериализации поля с сервера, но не на сервер
 * @param {string} name - кастомное имя поля, которое будет в сырых данных
 * @param {(rawValue: any, rawData?: any) => T} deserialize - функция-десериализатор
 * @returns {(target: object, propertyKey: string) => void} - декоратор
 * @constructor
 */
export function JsonNameReadonly<T>(
    name?: string,
    deserialize?: (rawValue: any, rawData?: any) => T
): (target: object, propertyKey: string) => void {
    return JsonName.call(null, name, () => null, deserialize);
}
