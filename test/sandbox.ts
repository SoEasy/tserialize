/** *** TYPES *** **/

export type TSerializeFunc<T> = (value: T, instance: any) => any;
export type TDeserializeFunc<T> = (rawValue: any, rawData?: any) => T;

/** *** UTILS *** **/

function getNameOfClass(target: any): string {
    return target.constructor.name;
}

function getParentClass(target: any): any {
    return Object.getPrototypeOf(target);
}

/** *** STORE *** **/

export interface PropertyMetadata {
    /**
     * Ключ поля в нативном объекте
     */
    propertyKey: string;

    /**
     * Ключ в сериализованном виде
     */
    rawKey: string;

    /**
     * Функция-сериализатор, превращает нативный экземпляр в сериализованный POJO
     */
    serialize?: TSerializeFunc<any>;

    /**
     * Функция-десериализатор, превращает POJO в экземпляр данного класса
     */
    deserialize?: TDeserializeFunc<any>;

    /**
     * Приватный флаг о том, что в поле хранится структура(другой экземпляр нативного класса)
     */
    isStruct: boolean;

    /**
     * Приватный флаг о том, что поле надо десериализовать после десериализации всех остальных полей, отложенно
     */
    isLate: boolean;
}

class PropertyMetaBuilder {
    private data: PropertyMetadata = {
        propertyKey: null,
        rawKey: null,
        isStruct: false,
        isLate: false
    };

    static make(propertyKey: string, name: string): PropertyMetaBuilder {
        const retVal = new PropertyMetaBuilder();
        retVal.data.propertyKey = propertyKey;
        retVal.data.rawKey = name || propertyKey;
        return retVal;
    }

    struct(): PropertyMetaBuilder {
        this.data.isStruct = true;
        return this;
    }

    late(): PropertyMetaBuilder {
        this.data.isLate = true;
        return this;
    }

    serializer(serializeFunc?: TSerializeFunc<any>): PropertyMetaBuilder {
        if (!serializeFunc) { return this; }
        this.data.serialize = serializeFunc;
        return this;
    }

    deserializer(deserializeFunc?: TDeserializeFunc<any>): PropertyMetaBuilder {
        if (!deserializeFunc) { return this; }
        this.data.deserialize = deserializeFunc;
        return this;
    }

    get raw(): PropertyMetadata {
        return this.data;
    }
}

class ClassMetaStore {
    /**
     * Хранилище метаданных для полей класса
     */
    propertiesMetaStore: Record<string, PropertyMetadata> = {};

    /**
     * @description Хранилище зависимостей "имя сырого поля" <-> "имя поля в объекте"
     */
    private propertyKeyInversion: Record<string, string> = {};

    addPropertyMetadata(propertyMetadata: PropertyMetadata): void {
        this.propertiesMetaStore[propertyMetadata.propertyKey] = propertyMetadata;
        this.propertyKeyInversion[propertyMetadata.rawKey] = propertyMetadata.propertyKey;
    }

    /**
     * Получить метаданные поля по ключу нативного экземпляра. Нужно для сериализации
     */
    getMetadataByPropertyKey(propertyKey: string): PropertyMetadata {
        return this.propertiesMetaStore[propertyKey];
    }

    /**
     * Получить метаданные поля по ключу сырых данных. Нужно для десериализации
     */
    getMetadataByRawKey(rawKey: string): PropertyMetadata {
        return this.propertiesMetaStore[this.propertyKeyInversion[rawKey]];
    }

    updateWithParentStore(parentStore: ClassMetaStore): void {
        console.log('Ща буит апдейт', parentStore);
    }
}

class RootMetaStore {
    static store: Map<any, ClassMetaStore> = new Map();

    static setupPropertyMetadata(targetClass: any, propertyMetadata: PropertyMetadata): void {
        if (!this.store.has(targetClass)) {
            this.store.set(targetClass, new ClassMetaStore());
        }
        const classFieldsMetaStore = this.store.get(targetClass);
        classFieldsMetaStore[propertyMetadata.propertyKey] = propertyMetadata;
    }

    static updateClassMetaByParent(targetClass: any): void {
        const parentClass = getParentClass(targetClass);
        if (getNameOfClass(parentClass) === 'Object') {
            return;
        }

        const parentStore = this.store.get(getParentClass(targetClass));
        const targetStore = this.store.get(targetClass);
        targetStore.updateWithParentStore(parentStore);
    }
}

export function JsonName<T>(
    name?: string,
    serialize?: (value: T, instance: any) => any,
    deserialize?: (rawValue: any, rawData?: any) => T
): (target: object, propertyKey: string) => void {
    return (target: object, propertyKey: string): void => {
        const propertyMetadata = PropertyMetaBuilder.make(propertyKey, name).serializer(serialize).deserializer(deserialize).raw;
        RootMetaStore.setupPropertyMetadata(target, propertyMetadata);

        RootMetaStore.updateClassMetaByParent(target);
    };
}

class Base {
    @JsonName('foo') prop1: string;
}

class Child extends Base {
    // @JsonName('baz') prop1: string;
    @JsonName('bar') prop2: string;
}

class AnotherChild extends Base {
    @JsonName('zz') prop1: string;
    @JsonName('thr') prop3: string;
}

class FourChild extends Child {
    @JsonName() prop4: string;
}

describe('For debug', () => {
    const c = new Child();
    const a = new AnotherChild();
    const f = new FourChild();
    console.log('ok', c, a, f);
    console.log(RootMetaStore.store);
});
