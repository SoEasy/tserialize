import { JsonName, serialize } from './../../src';

class NullCase {
  @JsonName()
  firstField: string;

  @JsonName('secondField', _ => null)
  secondField: boolean = true;

  @JsonName()
  thirdField: string | null = null;
}

describe('Nullable case serialization', () => {
  const instance = new NullCase();
  const serialized = serialize(instance, { allowNullValues: true });

  test('Shouldn`t has undefined properties, but has null', () => {
    expect(serialized).not.toHaveProperty('firstField');
    expect(serialized).toHaveProperty('secondField');
    expect(serialized).toHaveProperty('thirdField');
  });
});
