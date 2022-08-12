import { JsonName, deserialize } from '../../src/index';

class Base {
  @JsonName()
  field1: number;
}

class ChildOne extends Base {
  @JsonName('c1')
  childOneField: string;
}

class ChildTwo extends Base {
  childTwoField: boolean = true;
}

class RawBase {
  f: string;
}

class RawExtended extends RawBase {
  v: string;
}

describe('Deserialize extended class', () => {
  test('deserialize class with metadata', () => {
    const c1 = deserialize({ field1: 'field1', c1: 'c1' }, ChildOne);

    expect(c1).toEqual({ field1: 'field1', childOneField: 'c1' });
  });

  test('deserialize extended class without metadata', () => {
    const c2 = deserialize({ field1: 'field1' }, ChildTwo);
    expect(c2).toEqual({ field1: 'field1', childTwoField: true });
  });

  test('deserialize raw class without metadata should fail', () => {
    const mustThrow = () => {
      const _ = deserialize({}, RawBase);
    };
    expect(mustThrow).toThrow();
  });

  test('deserialize raw extended class without metadata should fail', () => {
    const mustThrow = () => {
      const _ = deserialize({}, RawExtended);
    };
    expect(mustThrow).toThrow();
  });
});
