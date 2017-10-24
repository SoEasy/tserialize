import { ParentKey } from 'utils';
import { JsonStruct } from './JsonStruct';

export function JsonMeta(): (target: object, propertyKey: string) => void {
    return JsonStruct.call(null, ParentKey);
}
