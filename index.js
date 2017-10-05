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
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var store_1 = __webpack_require__(13);
exports.MetaStore = store_1.MetaStore;
var consts_1 = __webpack_require__(5);
exports.JsonNameMetadataKey = consts_1.JsonNameMetadataKey;
exports.ParentKey = consts_1.ParentKey;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var deserialize_1 = __webpack_require__(10);
exports.deserialize = deserialize_1.deserialize;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(0);
function JsonName(name, serialize, deserialize) {
    return function (target, propertyKey) {
        var metaStore = utils_1.MetaStore.getMetaStore(target);
        var rawKey = name ? name : propertyKey;
        metaStore.make(propertyKey).name(rawKey).serializator(serialize).deserializator(deserialize);
    };
}
exports.JsonName = JsonName;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(0);
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
        if (jsonName !== utils_1.ParentKey) {
            result[jsonName] = serializedValue;
        }
        else {
            Object.assign(result, serializedValue);
        }
    }
}
/**
 * @description Хэлпер для сериализации классов, имеющих поля с навешанным декоратором JsonName. Сериализует только те
 *     поля, у которых есть декоратор и задано начальное значение.
 * @param model - экземпляр класса, который надо превратить в данные для отправки серверу по JSONRPC
 * @returns {{}} - обычный объект JS
 */
function serialize(model) {
    var result = {};
    var target = Object.getPrototypeOf(model);
    var metaStore = utils_1.MetaStore.getMetaStore(target);
    var modelKeys = metaStore.getPropertyKeys();
    for (var _i = 0, modelKeys_1 = modelKeys; _i < modelKeys_1.length; _i++) {
        var propertyKey = modelKeys_1[_i];
        var metadata = metaStore.getPropertyMeta(propertyKey);
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
var utils_1 = __webpack_require__(0);
var deserialize_1 = __webpack_require__(1);
function JsonStruct(name) {
    return function (target, propertyKey) {
        var proto = Reflect.getMetadata('design:type', target, propertyKey);
        var metaStore = utils_1.MetaStore.getMetaStore(target);
        var rawKey = name ? name : propertyKey;
        var deserializer = proto.fromServer ? proto.fromServer : function (value) { return deserialize_1.deserialize(value, proto); };
        metaStore.make(propertyKey).name(rawKey).deserializator(deserializer).struct();
    };
}
exports.JsonStruct = JsonStruct;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonNameMetadataKey = 'JsonName';
exports.ParentKey = '@JsonNameParentKey';


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var JsonArray_1 = __webpack_require__(7);
exports.JsonArray = JsonArray_1.JsonArray;
var JsonMeta_1 = __webpack_require__(8);
exports.JsonMeta = JsonMeta_1.JsonMeta;
var JsonName_1 = __webpack_require__(2);
exports.JsonName = JsonName_1.JsonName;
var JsonNameReadonly_1 = __webpack_require__(9);
exports.JsonNameReadonly = JsonNameReadonly_1.JsonNameReadonly;
var JsonStruct_1 = __webpack_require__(4);
exports.JsonStruct = JsonStruct_1.JsonStruct;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var JsonName_1 = __webpack_require__(2);
var serialize_1 = __webpack_require__(12);
var deserialize_1 = __webpack_require__(1);
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(0);
var JsonStruct_1 = __webpack_require__(4);
function JsonMeta() {
    return JsonStruct_1.JsonStruct.call(null, utils_1.ParentKey);
}
exports.JsonMeta = JsonMeta;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var JsonName_1 = __webpack_require__(2);
function JsonNameReadonly(name, deserialize) {
    return JsonName_1.JsonName.call(null, name, function () { return null; }, deserialize);
}
exports.JsonNameReadonly = JsonNameReadonly;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(0);
/**
 * @description Хэлпер для разбора данных, пришедших по JSONRPC от сервера в нашу модель
 * @param data - данные от сервера
 * @param cls - класс, в экземпляр которого надо превратить данные
 * @returns {T} - экземпляр класса cls, заполненный данными
 */
function deserialize(data, cls) {
    var retVal = new cls();
    var target = Object.getPrototypeOf(retVal);
    var metaStore = Reflect.getMetadata(utils_1.JsonNameMetadataKey, target);
    for (var _i = 0, _a = metaStore.getPropertyKeys(); _i < _a.length; _i++) {
        var propertyKey = _a[_i];
        var serializeProps = metaStore.getPropertyMeta(propertyKey);
        if (serializeProps) {
            var deserialize_1 = serializeProps.deserialize;
            var jsonName = serializeProps.rawKey;
            var jsonValue = jsonName !== utils_1.ParentKey ? data[jsonName] : data;
            if (typeof jsonValue !== 'undefined') {
                retVal[serializeProps.propertyKey] = deserialize_1 ? deserialize_1(jsonValue, data) : jsonValue;
            }
        }
    }
    return retVal;
}
exports.deserialize = deserialize;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var decorators_1 = __webpack_require__(6);
exports.JsonArray = decorators_1.JsonArray;
exports.JsonName = decorators_1.JsonName;
exports.JsonNameReadonly = decorators_1.JsonNameReadonly;
exports.JsonStruct = decorators_1.JsonStruct;
exports.JsonMeta = decorators_1.JsonMeta;
var serialize_1 = __webpack_require__(3);
exports.serialize = serialize_1.serialize;
var deserialize_1 = __webpack_require__(1);
exports.deserialize = deserialize_1.deserialize;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var serialize_1 = __webpack_require__(3);
exports.serialize = serialize_1.serialize;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var consts_1 = __webpack_require__(5);
var MetaStore = (function () {
    function MetaStore() {
        /**
         * @description Для имени поля в классе хранит его мета-информацию
         */
        this.propertiesMetaStore = {};
        /**
         * @description Хранит зависимость "сырое поле" <-> "поле в объекте"
         */
        this.keyPropertyInversion = {};
        /**
         * @description Простое хранилище всех декорированных полей, нужно для восстановления объекта
         */
        this.propertyKeys = [];
        /**
         * @description Поле для хранения промежуточного значения ключа, с которым работает builder
         */
        this.currentPropertyKey = null;
    }
    Object.defineProperty(MetaStore.prototype, "currentMetadata", {
        get: function () {
            return this.propertiesMetaStore[this.currentPropertyKey];
        },
        enumerable: true,
        configurable: true
    });
    MetaStore.getMetaStore = function (target) {
        if (!Reflect.hasMetadata(consts_1.JsonNameMetadataKey, target)) {
            Reflect.defineMetadata(consts_1.JsonNameMetadataKey, new MetaStore(), target);
        }
        return Reflect.getMetadata(consts_1.JsonNameMetadataKey, target);
    };
    MetaStore.prototype.make = function (propertyKey) {
        this.currentPropertyKey = propertyKey;
        if (this.currentMetadata) {
            console.warn("Property \"" + propertyKey + "\" already have metadata for serialization");
        }
        this.propertiesMetaStore[propertyKey] = this.currentMetadata || {
            propertyKey: propertyKey,
            rawKey: propertyKey,
            isStruct: false,
            isLate: false
        };
        this.propertyKeys.push(propertyKey);
        this.keyPropertyInversion[propertyKey] = propertyKey;
        return this;
    };
    MetaStore.prototype.name = function (rawKey) {
        this.currentMetadata.rawKey = rawKey;
        delete this.keyPropertyInversion[this.currentPropertyKey];
        this.keyPropertyInversion[rawKey] = this.currentPropertyKey;
        return this;
    };
    MetaStore.prototype.struct = function () {
        this.currentMetadata.isStruct = true;
        return this;
    };
    MetaStore.prototype.late = function () {
        this.currentMetadata.isLate = true;
        return this;
    };
    MetaStore.prototype.serializator = function (serializator) {
        if (!serializator) {
            return this;
        }
        this.currentMetadata.serialize = serializator;
        return this;
    };
    MetaStore.prototype.deserializator = function (deserializator) {
        if (!deserializator) {
            return this;
        }
        this.currentMetadata.deserialize = deserializator;
        return this;
    };
    MetaStore.prototype.addStructProperty = function (propertyName, target) {
        console.log('add struct property', propertyName, target, target.fromServer);
    };
    MetaStore.prototype.getPropertyMeta = function (propertyKey) {
        return this.propertiesMetaStore[propertyKey];
    };
    MetaStore.prototype.getPropertyKeys = function () {
        return this.propertyKeys;
    };
    MetaStore.prototype.getTargetKeyMeta = function (targetKey) {
        var propertyKey = this.keyPropertyInversion[targetKey];
        return propertyKey ? this.propertiesMetaStore[propertyKey] : null;
    };
    return MetaStore;
}());
exports.MetaStore = MetaStore;


/***/ })
/******/ ]);
});