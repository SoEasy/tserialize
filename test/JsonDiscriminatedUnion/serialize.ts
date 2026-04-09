import { JsonName, JsonDiscriminatedUnion, serialize } from '../../src';

class Discriminator1 {
  @JsonName()
  kind: string;

  @JsonName('discriminator_1')
  discriminator1: string;
}

class Discriminator2 {
  @JsonName()
  kind: string;

  @JsonName('discriminator_2')
  discriminator2: string;
}

class Model {
  constructor(unionField: Discriminator1 | Discriminator2) {
    this.unionField = unionField;
  }

  @JsonDiscriminatedUnion([
    { value: 'type1', model: Discriminator1 },
    { value: 'type2', model: Discriminator2 }
  ], 'kind')
  unionField: Discriminator1 | Discriminator2;
}

describe('JsonDescriminatedUnion serialize case', () => {
  test('should serialize with use correct model', () => {
    const instance1 = serialize(new Model({
      kind: 'type1',
      discriminator1: 'test1'
    }), { autoCreateModelForRawData: true });

    const instance2 = serialize(new Model({
      kind: 'type2',
      discriminator2: 'test2'
    }), { autoCreateModelForRawData: true });

    expect(instance1).toEqual({
      unionField: {
        kind: 'type1',
        discriminator_1: 'test1'
      }
    });

    expect(instance2).toEqual({
      unionField: {
        kind: 'type2',
        discriminator_2: 'test2'
      }
    });
  });

  test('should deserialize with custom name', () => {

    class CustomNameModel {
      constructor(unionField: Discriminator1 | Discriminator2) {
        this.unionField = unionField;
      }

      @JsonDiscriminatedUnion([
        { value: 'type1', model: Discriminator1 },
        { value: 'type2', model: Discriminator2 }
      ], 'kind', undefined, 'union_field')
      unionField: Discriminator1 | Discriminator2;
    }

    const instance = serialize(new CustomNameModel({
      kind: 'type2',
      discriminator2: 'test2'
    }), { autoCreateModelForRawData: true });

    expect(instance).toEqual({
      union_field: {
        kind: 'type2',
        discriminator_2: 'test2'
      }
    });
  });

  test('should deserialize with custom discriminator key', () => {

    class Discriminator1 {
      @JsonName('disc_kind')
      discKind: string;

      @JsonName('discriminator_1')
      discriminator1: string;
    }

    class Discriminator2 {
      @JsonName('disc_kind')
      discKind: string;

      @JsonName('discriminator_2')
      discriminator2: string;
    }

    class Model {
      constructor(unionField: Discriminator1 | Discriminator2) {
        this.unionField = unionField;
      }

      @JsonDiscriminatedUnion([
        { value: 'type1', model: Discriminator1 },
        { value: 'type2', model: Discriminator2 }
      ], 'disc_kind', 'discKind', 'union_field')
      unionField: Discriminator1 | Discriminator2;
    }

    const instance = serialize(new Model({
      discKind: 'type2',
      discriminator2: 'test2'
    }), { autoCreateModelForRawData: true });

    expect(instance).toEqual({
      union_field: {
        disc_kind: 'type2',
        discriminator_2: 'test2'
      }
    });
  });
});
