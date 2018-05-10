import { PropertyMetadata } from './types';
import { clone } from './utils';

export class ClassMetaStore {
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

    get propertyKeys(): Array<string> {
        return Object.keys(this.propertiesMetaStore);
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
        const newPropertiesMetaStore = clone(parentStore.propertiesMetaStore);
        const newPropertyKeyInversion = clone(parentStore.propertyKeyInversion);

        const ownPropertiesKeys = Object.keys(this.propertiesMetaStore);

        for (const ownPropertyKey of ownPropertiesKeys) {
            // TODO make get function
            const ownPropertyMetadata: PropertyMetadata = this.propertiesMetaStore[ownPropertyKey];

            // Если поле не унаследовано - просто закинем в хранилище и добавим инверсию
            if (!newPropertiesMetaStore[ownPropertyKey]) {
                newPropertiesMetaStore[ownPropertyKey] = this.propertiesMetaStore[ownPropertyKey];
                newPropertyKeyInversion[ownPropertyMetadata.rawKey] = ownPropertyMetadata.propertyKey;
                continue;
            }

            // TODO make get function
            const overridePropertyMetadata: PropertyMetadata = newPropertiesMetaStore[ownPropertyKey];
            delete newPropertyKeyInversion[overridePropertyMetadata.rawKey];
            // В общем, все кроме propertyKey и rawKey по умолчанию отсутствуют, и Object.assign нормально их накинет.
            // Соответственно если поле в родителе было late или struct, а у потомка будет просто JsonName - сменятся имена,
            // если навешаны серилизаторы-десериализаторы - они тоже.
            Object.assign(overridePropertyMetadata, ownPropertyMetadata);
            newPropertyKeyInversion[overridePropertyMetadata.rawKey] = overridePropertyMetadata.propertyKey;
        }
        this.propertiesMetaStore = newPropertiesMetaStore;
        this.propertyKeyInversion = newPropertyKeyInversion;
    }
}
