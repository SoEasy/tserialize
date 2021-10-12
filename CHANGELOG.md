# 1.5.5
- Добавлена проверка на null в десериализаторе JsonStruct

# 1.5.4
- Изменено поведение десериализации JsonStruct, чтобы fromServer при наличии работал в контексте корректного класса

# 1.5.3
- Добавлен конфиг для deserialize вида { makeInstance: boolean }. Если его передать с { makeInstance: false } - на выходе будет не экземпляр, а объект

#1.5.2
- Корректная сериализация экземпляров, унаследованных от чистых классов(без декораторов)
- Корректная сериализация экземпляров просто-классов/объектов в пустой объект

# 1.5.0
- Полный отказ от reflect-metadata, библиотека не имеет зависимостей
- Закреплена сигнатура JsonStruct и JsonMeta

# 1.4.0
- Полный рефакторинг внутреннего хранилища данных, тесты проходит, но надо тестировать использование библиотеки в стороннем пакете
- Использование reflect-metadata помечено как deprecated, в следующей версии будет выпилено
- При наследовании дочерние классы не портят метаданные родительских классов 

# 1.3.5
- Исправлено неожиданное поведение при сериализации унаследованных моделей, когда пытались сериализоваться поля из
соседних от унаследованного класса

# 1.3.4
- Убрал случайную зависимость

# 1.3.3
- Убрал тип импортный тип Decorator

# 1.3.2
- Изменена сигнатура десериализатора JsonNameLate

# 1.3.1
- Добавлен декоратор JsonNameLate, который работает как JsonName, но десериализацию проводит в два этапа
- сперва создается объект из всех полей кроме JsonNameLate,
а потом добавляются JsonNameLate, десериализатор которого принимает уже не сырые данные,
а объект

# 1.3.0
- Просто рефакторинг внутренней реализации

# 1.2.2
- Added decorator JsonArray(Proto)

# 1.2.0
- `JsonStruct` и `JsonMeta` больше не требуют proto

# 1.1.2
- Написаны тесты
- Поправлен баг, когда сериализатор даже не начинал работать без значения поля(его не было в итераторе `for..in model`)

# 1.1.1
- Поправлен баг с сериализацией Struct, когда значение null

# 1.1.0
- начальное значение для поля под декоратором больше не обязательно
- Небольшое нарушение обратной совместимости - удалены из экспорта ключ родителя `ParentKey` и сериализатор `noChangeSerializer`. Потому что не нужны теперь.
- Добавлены новые декораторы: `JsonStruct`(для вложенных моделей) и `JsonMeta`(для плоско-композитных моделей).

# 1.0.5
- Удалил hasOwnProperty в десериализаторе - он не важен, но мешает жить при других декораторах на свойстве

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
