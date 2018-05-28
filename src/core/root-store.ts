import { ClassMetaStore } from './class-meta-store';
import { PropertyMetadata } from './types';
import { getParentClass, getNameOfClass } from './utils';

export class RootMetaStore {
    static store: Map<any, ClassMetaStore> = new Map();

    static setupPropertyMetadata(targetClass: any, propertyMetadata: PropertyMetadata): void {
        if (!this.store.has(targetClass)) {
            this.store.set(targetClass, new ClassMetaStore());
        }
        const classFieldsMetaStore = this.store.get(targetClass);
        classFieldsMetaStore.addPropertyMetadata(propertyMetadata);

        this.updateClassMetaByParent(targetClass);
    }

    static updateClassMetaByParent(targetClass: any): void {
        const parentClass = getParentClass(targetClass);
        if (getNameOfClass(parentClass) === 'Object') {
            return;
        }

        const parentStore = this.store.get(getParentClass(targetClass));
        if (!parentStore) {
            return;
        }
        const targetStore = this.store.get(targetClass);
        targetStore.updateWithParentStore(parentStore);
    }

    static getClassMetaStore(targetClass: any): ClassMetaStore {
        return this.store.get(targetClass);
    }
}
