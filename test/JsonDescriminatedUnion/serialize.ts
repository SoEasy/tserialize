import { JsonName, JsonDescriminatedUnion, serialize } from '../../src';

class Descriminator1 {
  @JsonName()
  kind: string;

  @JsonName('descriminator_1')
  descriminator1: string;
}

class Descriminator2 {
  @JsonName()
  kind: string;

  @JsonName('descriminator_2')
  descriminator2: string;
}

class Model {
  constructor(unionField: Descriminator1 | Descriminator2) {
    this.unionField = unionField;
  }

  @JsonDescriminatedUnion([
    { value: 'type1', model: Descriminator1 },
    { value: 'type2', model: Descriminator2 }
  ], 'kind')
  unionField: Descriminator1 | Descriminator2;
}

describe('JsonDescriminatedUnion serialize case', () => {
  test('should serialize with use correct model', () => {
    const instance1 = serialize(new Model({
      kind: 'type1',
      descriminator1: 'test1'
    }), { autoCreateModelForRawData: true });

    const instance2 = serialize(new Model({
      kind: 'type2',
      descriminator2: 'test2'
    }), { autoCreateModelForRawData: true });

    expect(instance1).toEqual({
      unionField: {
        kind: 'type1',
        descriminator_1: 'test1'
      }
    });

    expect(instance2).toEqual({
      unionField: {
        kind: 'type2',
        descriminator_2: 'test2'
      }
    });
  });

  test('should deserialize with custom name', () => {

    class CustomNameModel {
      constructor(unionField: Descriminator1 | Descriminator2) {
        this.unionField = unionField;
      }

      @JsonDescriminatedUnion([
        { value: 'type1', model: Descriminator1 },
        { value: 'type2', model: Descriminator2 }
      ], 'kind', 'union_field')
      unionField: Descriminator1 | Descriminator2;
    }

    const instance = serialize(new CustomNameModel({
      kind: 'type2',
      descriminator2: 'test2'
    }), { autoCreateModelForRawData: true });

    expect(instance).toEqual({
      union_field: {
        kind: 'type2',
        descriminator_2: 'test2'
      }
    });
  });
});
