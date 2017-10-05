import { Decorator } from 'utils';
import { JsonName } from './JsonName';
import { serialize } from './../serialize';
import { deserialize } from './../deserialize';

export function JsonArray(proto: any, name?: string): Decorator {
    const serializer = (value): any => {
        if (!value || !(value instanceof Array)) {
            return null;
        }
        return value.map(
            item => {
                if (item instanceof proto) {
                    return item.toServer ? item.toServer() : serialize(item);
                }
            }
        ).filter(i => !!i);
    };

    const deserializer = (value): any => {
        if (!value || !(value instanceof Array)) {
            return null;
        }
        return value.map(
            item => proto.fromServer ? proto.fromServer(item) : deserialize(item, proto)
        );
    };

    return JsonName.call(null, name, serializer, deserializer);
}
