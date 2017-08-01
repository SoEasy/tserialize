import { serialize } from './serialize';

export function noChangeSerializer(value: any): any { return serialize(value); }
