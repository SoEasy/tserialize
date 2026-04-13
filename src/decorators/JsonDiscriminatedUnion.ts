import { TDeserializeConfig, TSerializeConfig } from './../core/types';
import { PropertyMetaBuilder, RootMetaStore } from './../core';
import { deserialize } from './../deserialize';
import { serialize } from './../serialize';

export type TStatic = {
  fromServer?: (data: any) => any
}

export type TInstance= {
  [key: string]: any;
}

export type TDiscriminatorModel = {
  new(): TInstance;
} & TStatic;

export type TDiscriminator = {
  value: any;
  model: TDiscriminatorModel;
};

/**
 * Декоратор для сериализации/десериализации полей, которые являются объединением по дискриминатору. Позволяет указать массив возможных вариантов с их моделями и ключ дискриминатора, по которому будет происходить выбор модели.
 * @param discriminators — массив вариантов для объединения, каждый вариант содержит значение дискриминатора и модель, которая соответствует этому значению
 * @param discriminatorKey — ключ в данных, по которому будет происходить выбор модели
 * @param rawName — кастомное имя поля, которое будет в сырых данных
 */
export function JsonDiscriminatedUnion(discriminators: Array<TDiscriminator>, discriminatorKey: string, serializeDiscriminatorKey?: string, rawName?: string) {
  return (target: object, propertyKey: string): void => {

    const deserializeFunc = (value: any, _: any, config?: TDeserializeConfig) => {
      if (value === null) {
        return null;
      }

      const discriminatorValue = value[discriminatorKey];
      const discriminator = discriminators.find(d => d.value === discriminatorValue);

      if (!discriminator) {
        throw new Error(`Unknown discriminator value: ${discriminatorValue}`);
      }

      const ModelClass = discriminator.model;

      if (ModelClass.fromServer) {
        return ModelClass.fromServer(value);
      }

      return value !== null ? deserialize(value, ModelClass, config) : null;
    }

    const serializerFunc = (value: any, _: any, config?: TSerializeConfig) => {
      if (!value) {
        return null;
      }

      if (value.toServer) {
        return value.toServer.call(value, config);
      }

      const discriminatorValue = value[serializeDiscriminatorKey || discriminatorKey];
      const discriminator = discriminators.find(d => d.value === discriminatorValue);

      if (!discriminator) {
        throw new Error(`Unknown discriminator value: ${discriminatorValue}`);
      }
      let model = value;

      if (!(model instanceof discriminator.model) && config && config.autoCreateModelForRawData) {
        model = new discriminator.model();
        Object.assign(model, value);
      }

      return serialize(model, config)
    }

    const propertyMetadata = PropertyMetaBuilder.make(propertyKey, rawName).deserializer(deserializeFunc).serializer(serializerFunc).struct().raw;
    RootMetaStore.setupPropertyMetadata(target, propertyMetadata);
  };
}
