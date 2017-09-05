# 1.0.4
- Добавлена возможность десериализации "плоских" моделей в композитные
- Добавлена возможность сериализации композитных моделей в "плоские"
- В экспорт библиотеки добавлена константа `ParentKey` для передачи в качестве имени декоратору моделей в композиции
- В экспорт библиотеки добавлен сериализатор `noChangeSerializer`, не делающий никаких преобразований над объектом, а просто сериализующий его

## Пример
```
import { deserialize, JsonName, noChangeSerializer, ParentKey, serialize } from 'tserialize';

class MetaModel {
    @JsonName()
    os: string = null;

    @JsonName()
    isWeb: boolean = false;

    static fromServer(data: object): MetaModel {
        return deserialize(data, MetaModel);
    }

    toServer(): object {
        return serialize(this);
    }
}

class ServerModel {
    @JsonName()
    id: number = null;

    @JsonName(ParentKey, noChangeSerializer, MetaModel.fromServer)
    meta: MetaModel = null;

    static fromServer(data: object): ServerModel {
        return deserialize(data, ServerModel);
    }

    toServer(): object {
        return serialize(this);
    }
}

// ...

const data = { id: 1, os: 'MacOS', isWeb: true };
const instance = ServerModel.fromServer(data);
// { id: 1, meta: { os: 'MacOS', isWeb: true } }
const newData = instance.toServer();
// { id: 1, os: 'MacOS', isWeb: true }
```

# 1.0.5
- Удалил hasOwnProperty в десериализаторе - он не важен, но мешает жить при других декораторах на свойстве

# 1.1.0
- Теперь не обязательно обернутые в декоратор
- Новые декораторы

# 1.1.1
- Поправлен баг с сериализацией Struct, когда значение null