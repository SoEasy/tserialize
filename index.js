(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("index", [], factory);
	else if(typeof exports === 'object')
		exports["index"] = factory();
	else
		root["index"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var root_store_1 = __webpack_require__(9);
exports.RootMetaStore = root_store_1.RootMetaStore;
var consts_1 = __webpack_require__(7);
exports.ParentKey = consts_1.ParentKey;
var class_meta_store_1 = __webpack_require__(4);
exports.ClassMetaStore = class_meta_store_1.ClassMetaStore;
var property_meta_builder_1 = __webpack_require__(8);
exports.PropertyMetaBuilder = property_meta_builder_1.PropertyMetaBuilder;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var deserialize_1 = __webpack_require__(15);
exports.deserialize = deserialize_1.deserialize;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
/**
 * Декоратор для примитивного маппинга поля между экземпляром и сырыми данными
 * @param {string} name - кастомное имя поля, которое будет в сырых данных
 * @param {(value: T, instance: any) => any} serialize - функция-сериализатор, получает значение поля и экземпляр, вовзвращает значение.
 * Если значения нет - сериализатор не будет вызван и поле не попадет в результирующий объект.
 * Если сериализатор вернул null/undefined - значение так же не попадет в результирующий объект.
 * @param {(rawValue: any, rawData?: any) => T} deserialize - функция-десериализатор
 * @returns {(target: object, propertyKey: string) => void} - декоратор
 * @constructor
 */
function JsonName(name, serialize, deserialize) {
    return function (target, propertyKey) {
        var propertyMetadata = core_1.PropertyMetaBuilder.make(propertyKey, name).serializer(serialize).deserializer(deserialize).raw;
        core_1.RootMetaStore.setupPropertyMetadata(target, propertyMetadata);
    };
}
exports.JsonName = JsonName;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
function serializeValue(metadata, value, instance) {
    if (!metadata) {
        return;
    }
    if (metadata.isStruct) {
        var serializer = value ? value.toServer : null;
        return serializer ? serializer.call(value) : (value ? serialize(value) : null);
    }
    else {
        var serializer = metadata.serialize;
        return serializer ? serializer(value, instance) : value;
    }
}
function assignSerializedValueToResult(metadata, serializedValue, result) {
    if (![null, undefined].includes(serializedValue)) {
        var jsonName = metadata.rawKey;
        if (jsonName !== core_1.ParentKey) {
            result[jsonName] = serializedValue;
        }
        else {
            Object.assign(result, serializedValue);
        }
    }
}
/**
 * @description Хэлпер для сериализации классов, имеющих поля с навешанным декоратором JsonName. Сериализует только те
 *     поля, у которых есть декоратор и есть значение.
 * @param model - экземпляр класса, который надо превратить в данные для отправки серверу по JSONRPC
 * @returns {{}} - обычный объект JS
 */
function serialize(model) {
    var result = {};
    var targetClass = Object.getPrototypeOf(model);
    var metaStore = core_1.RootMetaStore.getClassMetaStore(targetClass);
    // Всякое бывает, мб кто-то сериализует объект без декораторов
    if (!metaStore) {
        return {};
    }
    var modelKeys = metaStore.propertyKeys;
    for (var _i = 0, modelKeys_1 = modelKeys; _i < modelKeys_1.length; _i++) {
        var propertyKey = modelKeys_1[_i];
        var metadata = metaStore.getMetadataByPropertyKey(propertyKey);
        var serializedValue = serializeValue(metadata, model[propertyKey], model);
        assignSerializedValueToResult(metadata, serializedValue, result);
    }
    return result;
}
exports.serialize = serialize;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(5);
var ClassMetaStore = /** @class */ (function () {
    function ClassMetaStore() {
        /**
         * Хранилище метаданных для полей класса
         */
        this.propertiesMetaStore = {};
        /**
         * @description Хранилище зависимостей "имя сырого поля" <-> "имя поля в объекте"
         */
        this.propertyKeyInversion = {};
    }
    ClassMetaStore.prototype.addPropertyMetadata = function (propertyMetadata) {
        this.propertiesMetaStore[propertyMetadata.propertyKey] = propertyMetadata;
        this.propertyKeyInversion[propertyMetadata.rawKey] = propertyMetadata.propertyKey;
    };
    Object.defineProperty(ClassMetaStore.prototype, "propertyKeys", {
        get: function () {
            return Object.keys(this.propertiesMetaStore);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Получить метаданные поля по ключу нативного экземпляра. Нужно для сериализации
     */
    ClassMetaStore.prototype.getMetadataByPropertyKey = function (propertyKey) {
        return this.propertiesMetaStore[propertyKey];
    };
    /**
     * Получить метаданные поля по ключу сырых данных. Нужно для десериализации
     */
    ClassMetaStore.prototype.getMetadataByRawKey = function (rawKey) {
        return this.propertiesMetaStore[this.propertyKeyInversion[rawKey]];
    };
    ClassMetaStore.prototype.updateWithParentStore = function (parentStore) {
        var newPropertiesMetaStore = utils_1.clone(parentStore.propertiesMetaStore);
        var newPropertyKeyInversion = utils_1.clone(parentStore.propertyKeyInversion);
        var ownPropertiesKeys = Object.keys(this.propertiesMetaStore);
        for (var _i = 0, ownPropertiesKeys_1 = ownPropertiesKeys; _i < ownPropertiesKeys_1.length; _i++) {
            var ownPropertyKey = ownPropertiesKeys_1[_i];
            var ownPropertyMetadata = this.getMetadataByPropertyKey(ownPropertyKey);
            // Если поле не унаследовано - просто закинем в хранилище и добавим инверсию
            if (!newPropertiesMetaStore[ownPropertyKey]) {
                newPropertiesMetaStore[ownPropertyKey] = this.propertiesMetaStore[ownPropertyKey];
                newPropertyKeyInversion[ownPropertyMetadata.rawKey] = ownPropertyMetadata.propertyKey;
                continue;
            }
            var overridePropertyMetadata = newPropertiesMetaStore[ownPropertyKey];
            delete newPropertyKeyInversion[overridePropertyMetadata.rawKey];
            // В общем, все кроме propertyKey и rawKey по умолчанию отсутствуют, и Object.assign нормально их накинет.
            // Соответственно если поле в родителе было late или struct, а у потомка будет просто JsonName - сменятся имена,
            // если навешаны серилизаторы-десериализаторы - они тоже.
            Object.assign(overridePropertyMetadata, ownPropertyMetadata);
            newPropertyKeyInversion[overridePropertyMetadata.rawKey] = overridePropertyMetadata.propertyKey;
        }
        this.propertiesMetaStore = newPropertiesMetaStore;
        this.propertyKeyInversion = newPropertyKeyInversion;
    };
    return ClassMetaStore;
}());
exports.ClassMetaStore = ClassMetaStore;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getNameOfClass(target) {
    return target.constructor.name;
}
exports.getNameOfClass = getNameOfClass;
function getParentClass(target) {
    return Object.getPrototypeOf(target);
}
exports.getParentClass = getParentClass;
function clone(from) {
    if (from === null || typeof from !== 'object')
        return from;
    if (from.constructor !== Object && from.constructor !== Array)
        return from;
    if (from.constructor === Date || from.constructor === RegExp || from.constructor === Function ||
        from.constructor === String || from.constructor === Number || from.constructor === Boolean) {
        return new from.constructor(from);
    }
    var to = new from.constructor();
    for (var name_1 in from) {
        to[name_1] = typeof to[name_1] === 'undefined' ? clone(from[name_1]) : to[name_1];
    }
    return to;
}
exports.clone = clone;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var JsonArray_1 = __webpack_require__(10);
exports.JsonArray = JsonArray_1.JsonArray;
var JsonMeta_1 = __webpack_require__(11);
exports.JsonMeta = JsonMeta_1.JsonMeta;
var JsonName_1 = __webpack_require__(2);
exports.JsonName = JsonName_1.JsonName;
var JsonNameReadonly_1 = __webpack_require__(13);
exports.JsonNameReadonly = JsonNameReadonly_1.JsonNameReadonly;
var JsonStruct_1 = __webpack_require__(14);
exports.JsonStruct = JsonStruct_1.JsonStruct;
var JsonNameLate_1 = __webpack_require__(12);
exports.JsonNameLate = JsonNameLate_1.JsonNameLate;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentKey = '@JsonNameParentKey';


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PropertyMetaBuilder = /** @class */ (function () {
    function PropertyMetaBuilder() {
        this.data = {
            propertyKey: null,
            rawKey: null
        };
    }
    PropertyMetaBuilder.make = function (propertyKey, name) {
        var retVal = new PropertyMetaBuilder();
        retVal.data.propertyKey = propertyKey;
        retVal.data.rawKey = name || propertyKey;
        return retVal;
    };
    PropertyMetaBuilder.prototype.struct = function () {
        this.data.isStruct = true;
        return this;
    };
    PropertyMetaBuilder.prototype.late = function () {
        this.data.isLate = true;
        return this;
    };
    PropertyMetaBuilder.prototype.serializer = function (serializeFunc) {
        if (!serializeFunc) {
            return this;
        }
        this.data.serialize = serializeFunc;
        return this;
    };
    PropertyMetaBuilder.prototype.deserializer = function (deserializeFunc) {
        if (!deserializeFunc) {
            return this;
        }
        this.data.deserialize = deserializeFunc;
        return this;
    };
    Object.defineProperty(PropertyMetaBuilder.prototype, "raw", {
        get: function () {
            return this.data;
        },
        enumerable: true,
        configurable: true
    });
    return PropertyMetaBuilder;
}());
exports.PropertyMetaBuilder = PropertyMetaBuilder;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var class_meta_store_1 = __webpack_require__(4);
var utils_1 = __webpack_require__(5);
var RootMetaStore = /** @class */ (function () {
    function RootMetaStore() {
    }
    RootMetaStore.setupPropertyMetadata = function (targetClass, propertyMetadata) {
        if (!this.store.has(targetClass)) {
            this.store.set(targetClass, new class_meta_store_1.ClassMetaStore());
        }
        var classFieldsMetaStore = this.store.get(targetClass);
        classFieldsMetaStore.addPropertyMetadata(propertyMetadata);
        this.updateClassMetaByParent(targetClass);
    };
    RootMetaStore.updateClassMetaByParent = function (targetClass) {
        var parentClass = utils_1.getParentClass(targetClass);
        if (utils_1.getNameOfClass(parentClass) === 'Object') {
            return;
        }
        var parentStore = this.store.get(utils_1.getParentClass(targetClass));
        if (!parentStore) {
            return;
        }
        var targetStore = this.store.get(targetClass);
        targetStore.updateWithParentStore(parentStore);
    };
    RootMetaStore.getClassMetaStore = function (targetClass) {
        return this.store.get(targetClass);
    };
    RootMetaStore.store = new Map();
    return RootMetaStore;
}());
exports.RootMetaStore = RootMetaStore;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var JsonName_1 = __webpack_require__(2);
var serialize_1 = __webpack_require__(17);
var deserialize_1 = __webpack_require__(1);
/**
 * Декоратор для сериализации-десериализации массивов экземпляров.
 * @param proto - конструктор класса, экземпляры которой лежат в массиве
 * @param {string} name - кастомное имя поля в сырых данных
 * @returns {(target: object, propertyKey: string) => void} - декоратор
 * @constructor
 */
function JsonArray(proto, name) {
    var serializer = function (value) {
        if (!value || !(value instanceof Array)) {
            return null;
        }
        return value.map(function (item) {
            if (item instanceof proto) {
                return item.toServer ? item.toServer() : serialize_1.serialize(item);
            }
        }).filter(function (i) { return !!i; });
    };
    var deserializer = function (value) {
        if (!value || !(value instanceof Array)) {
            return null;
        }
        return value.map(function (item) { return proto.fromServer ? proto.fromServer(item) : deserialize_1.deserialize(item, proto); });
    };
    return JsonName_1.JsonName.call(null, name, serializer, deserializer);
}
exports.JsonArray = JsonArray;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var deserialize_1 = __webpack_require__(1);
/**
 * Декоратор без аргументов для объявления структуры, чтобы мапить плоские данные в аггрегированные объекты
 * @returns {(target: object, propertyKey: string) => void} - декоратор
 * @constructor
 */
function JsonMeta(TargetClass) {
    return function (target, propertyKey) {
        var proto = TargetClass;
        var deserializeFunc = proto.fromServer ? proto.fromServer : function (value) { return deserialize_1.deserialize(value, proto); };
        var propertyMetadata = core_1.PropertyMetaBuilder.make(propertyKey, core_1.ParentKey).deserializer(deserializeFunc).struct().raw;
        core_1.RootMetaStore.setupPropertyMetadata(target, propertyMetadata);
    };
}
exports.JsonMeta = JsonMeta;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
/**
 * Декоратор для маппинга, десериализация которого работает после всех остальных полей. Сиг
 * @param {string} name - кастомное имя поля, которое будет в сырых данных
 * @param {(value: T, instance: any) => any} serialize - функция-сериализатор, получает значение поля и экземпляр, вовзвращает значение.
 * Если значения нет - сериализатор не будет вызван и поле не попадет в результирующий объект.
 * Если сериализатор вернул null/undefined - значение так же не попадет в результирующий объект.
 * @param {(rawValue: any, rawData?: any) => T} deserialize - функция-десериализатор.
 * Работает когда все остальные поля объекта уже десериализованы
 * @returns {(target: object, propertyKey: string) => void} - декоратор
 * @constructor
 */
function JsonNameLate(name, serialize, deserialize) {
    return function (target, propertyKey) {
        var propertyMetadata = core_1.PropertyMetaBuilder.make(propertyKey, name).serializer(serialize).deserializer(deserialize).late().raw;
        core_1.RootMetaStore.setupPropertyMetadata(target, propertyMetadata);
    };
}
exports.JsonNameLate = JsonNameLate;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var JsonName_1 = __webpack_require__(2);
/**
 * Декоратор для десериализации поля с сервера, но не на сервер
 * @param {string} name - кастомное имя поля, которое будет в сырых данных
 * @param {(rawValue: any, rawData?: any) => T} deserialize - функция-десериализатор
 * @returns {(target: object, propertyKey: string) => void} - декоратор
 * @constructor
 */
function JsonNameReadonly(name, deserialize) {
    return JsonName_1.JsonName.call(null, name, function () { return null; }, deserialize);
}
exports.JsonNameReadonly = JsonNameReadonly;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var deserialize_1 = __webpack_require__(1);
/**
 * Декоратор для сериализаци-дерериализации аггрегированных моделей.
 * Для сериализации использует toServer метод экземпляра.Если его нет - просто serialize.
 * Для десериализации использует статический метод fromServer. Если его нет - просто deserialize.
 * @param TargetClass - конструктор аггрегированной модели
 * @param {string} rawName - кастомное имя поля в сырых данных
 * @returns {(target: object, propertyKey: string) => void} - декоратор
 * @constructor
 */
function JsonStruct(TargetClass, rawName) {
    return function (target, propertyKey) {
        var proto = TargetClass;
        var deserializeFunc = proto.fromServer
            // tslint:disable-next-line
            ? function (value) { return proto.fromServer(value); }
            : function (value) { return deserialize_1.deserialize(value, proto); };
        var propertyMetadata = core_1.PropertyMetaBuilder.make(propertyKey, rawName).deserializer(deserializeFunc).struct().raw;
        core_1.RootMetaStore.setupPropertyMetadata(target, propertyMetadata);
    };
}
exports.JsonStruct = JsonStruct;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
/**
 * Хэлпер для десериализации сырых данных в экземпляр данного класса
 * @param data - сырые данные
 * @param {{new(...args: any[]): T}} cls - конструктор класса, в экземпляр которого надо превратить данные
 * @returns {T} - экземпляр
 */
function deserialize(data, cls, config) {
    if (config === void 0) { config = { makeInstance: true }; }
    var makeInstance = config.makeInstance;
    var retVal = makeInstance ? new cls() : {};
    var targetClass = cls.prototype;
    var metaStore = core_1.RootMetaStore.getClassMetaStore(targetClass);
    var lateFields = [];
    var modelKeys = metaStore.propertyKeys;
    for (var _i = 0, modelKeys_1 = modelKeys; _i < modelKeys_1.length; _i++) {
        var propertyKey = modelKeys_1[_i];
        var serializeProps = metaStore.getMetadataByPropertyKey(propertyKey);
        if (serializeProps.isLate) {
            lateFields.push(propertyKey);
            continue;
        }
        if (serializeProps) {
            var deserialize_1 = serializeProps.deserialize;
            var jsonName = serializeProps.rawKey;
            var jsonValue = jsonName !== core_1.ParentKey ? data[jsonName] : data;
            if (typeof jsonValue !== 'undefined') {
                retVal[serializeProps.propertyKey] = deserialize_1 ? deserialize_1(jsonValue, data) : jsonValue;
            }
        }
    }
    // TODO remove duplicate
    for (var _a = 0, lateFields_1 = lateFields; _a < lateFields_1.length; _a++) {
        var propertyKey = lateFields_1[_a];
        var serializeProps = metaStore.getMetadataByPropertyKey(propertyKey);
        if (serializeProps) {
            var deserialize_2 = serializeProps.deserialize;
            var jsonName = serializeProps.rawKey;
            var jsonValue = jsonName !== core_1.ParentKey ? data[jsonName] : data;
            if (typeof jsonValue !== 'undefined') {
                retVal[serializeProps.propertyKey] = deserialize_2 ? deserialize_2(jsonValue, retVal) : jsonValue;
            }
        }
    }
    return retVal;
}
exports.deserialize = deserialize;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var decorators_1 = __webpack_require__(6);
exports.JsonArray = decorators_1.JsonArray;
exports.JsonName = decorators_1.JsonName;
exports.JsonNameLate = decorators_1.JsonNameLate;
exports.JsonNameReadonly = decorators_1.JsonNameReadonly;
exports.JsonStruct = decorators_1.JsonStruct;
exports.JsonMeta = decorators_1.JsonMeta;
var serialize_1 = __webpack_require__(3);
exports.serialize = serialize_1.serialize;
var deserialize_1 = __webpack_require__(1);
exports.deserialize = deserialize_1.deserialize;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var serialize_1 = __webpack_require__(3);
exports.serialize = serialize_1.serialize;


/***/ })
/******/ ]);
});