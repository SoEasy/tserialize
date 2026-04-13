import { JsonName, JsonDiscriminatedUnion, deserialize } from '../../src';

class Descriminator1 {
  @JsonName()
  kind: string;

  @JsonName('descriminator_1')
  descriminator1: number;
}

class Descriminator2 {
  @JsonName()
  kind: string;

  @JsonName('descriminator_2')
  descriminator2: number;
}

class Model {
  @JsonDiscriminatedUnion([
    { value: 'type1', model: Descriminator1 },
    { value: 'type2', model: Descriminator2 }
  ], 'kind')
  unionField: Descriminator1 | Descriminator2;
}

describe('JsonDescriminatedUnion deserialize case', () => {
  const instance = deserialize({
    unionField: {
      kind: 'type2',
      descriminator_2: 2
    },
  }, Model);

  console.log(instance)

  test('should deserialize with use correct model', () => {
    const instance1 = deserialize({
      unionField: {
        kind: 'type1',
        descriminator_1: 1
      },
    }, Model);

    const instance2 = deserialize({
      unionField: {
        kind: 'type2',
        descriminator_2: 2
      },
    }, Model);
    expect(instance1).toEqual({
      unionField: {
        kind: 'type1',
        descriminator1: 1
      }
    });

    expect(instance2).toEqual({
      unionField: {
        kind: 'type2',
        descriminator2: 2
      }
    });
  });

  test('should deserialize with custom name', () => {

    class CustomNameModel {
      @JsonDiscriminatedUnion([
        { value: 'type1', model: Descriminator1 },
        { value: 'type2', model: Descriminator2 }
      ], 'kind', undefined, 'union_field')
      unionField: Descriminator1 | Descriminator2;
    }

    const instance = deserialize({
      union_field: {
        kind: 'type2',
        descriminator_2: 2
      },
    }, CustomNameModel);

    expect(instance).toEqual({
      unionField: {
        kind: 'type2',
        descriminator2: 2
      }
    });
  });
});
