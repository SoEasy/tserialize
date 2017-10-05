import { Decorator, ParentKey } from 'utils';
import { JsonStruct } from './JsonStruct';

export function JsonMeta(): Decorator {
    return JsonStruct.call(null, ParentKey);
}
