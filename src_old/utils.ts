import { serialize } from './serialize/serialize';

export function noChangeSerializer(value: any): any { return serialize(value); }
