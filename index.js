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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonNameMetadataKey = 'JsonName';
exports.ParentKey = '@JsonNameParentKey';


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var metadata_key_1 = __webpack_require__(0);
/**
 * @description Хэлпер для разбора данных, пришедших по JSONRPC от сервера в нашу модель
 * @param data - данные от сервера
 * @param cls - класс, в экземпляр которого надо превратить данные
 * @returns {T} - экземпляр класса cls, заполненный данными
 */
function deserialize(data, cls) {
    var retVal = new cls();
    var target = Object.getPrototypeOf(retVal);
    var metaStore = Reflect.getMetadata(metadata_key_1.JsonNameMetadataKey, target);
    for (var _i = 0, _a = metaStore.getPropertyKeys(); _i < _a.length; _i++) {
        var propertyKey = _a[_i];
        var serializeProps = metaStore.getPropertyMeta(propertyKey);
        if (serializeProps) {
            var deserialize_1 = serializeProps.deserialize;
            var jsonName = serializeProps.targetKey;
            var jsonValue = jsonName !== metadata_key_1.ParentKey ? data[jsonName] : data;
            if (typeof jsonValue !== 'undefined') {
                retVal[serializeProps.propertyKey] = deserialize_1 ? deserialize_1(jsonValue) : jsonValue;
            }
        }
    }
    return retVal;
}
exports.deserialize = deserialize;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var metadata_key_1 = __webpack_require__(0);
var helpers_1 = __webpack_require__(6);
/**
 * @description Хэлпер для сериализации классов, имеющих поля с навешанным декоратором JsonName. Сериализует только те
 *     поля, у которых есть декоратор и задано начальное значение.
 * @param model - экземпляр класса, который надо превратить в данные для отправки серверу по JSONRPC
 * @returns {{}} - обычный объект JS
 */
function serialize(model) {
    var result = {};
    var target = Object.getPrototypeOf(model);
    var metaStore = Reflect.getMetadata(metadata_key_1.JsonNameMetadataKey, target);
    for (var propertyKey in model) {
        var metadata = metaStore.getPropertyMeta(propertyKey);
        var serializedValue = helpers_1.serializeValue(metadata, model[propertyKey], model);
        helpers_1.assignSerializedValueToResult(metadata, serializedValue, result);
    }
    return result;
}
exports.serialize = serialize;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var metadata_key_1 = __webpack_require__(0);
var meta_store_1 = __webpack_require__(5);
var deserialize_1 = __webpack_require__(1);
/**
 * @description Декоратор для полей модели, указывающий как называется поле в JSONRPC-ответе/запросе и как его
 *     сериализовать/десериализовать. Поле в классе обязательно должно иметь начальное значение, хоть null.
 *     Неинициированные поля не будут обработаны декоратором.
 * @param name - название поля для JSONRPC-запроса/ответа.
 * @param serialize - функция, сериализующая значение поля для отправки на сервер или что-то с ним делающая.
 * @param deserialize - функция, разбирающая значение от сервера
 */
function JsonName(name, serialize, deserialize) {
    return function (target, propertyKey) {
        if (!Reflect.hasMetadata(metadata_key_1.JsonNameMetadataKey, target)) {
            Reflect.defineMetadata(metadata_key_1.JsonNameMetadataKey, new meta_store_1.MetaStore(), target);
        }
        var metaStore = Reflect.getMetadata(metadata_key_1.JsonNameMetadataKey, target);
        var targetKey = name ? name : propertyKey;
        metaStore.addProperty(propertyKey, targetKey, false, serialize, deserialize);
    };
}
exports.JsonName = JsonName;
/**
 * @description Декоратор для поля, которое ни при каких обстоятельствах не поедет в сериализованный объект
 * @param name - название поля, из которого при десериализации взять данные
 * @param deserialize - функция-десериализатор
 */
function JsonNameReadonly(name, deserialize) {
    return JsonName.call(null, name, function () { return null; }, deserialize);
}
exports.JsonNameReadonly = JsonNameReadonly;
function JsonStruct(proto, name) {
    return function (target, propertyKey) {
        if (!Reflect.hasMetadata(metadata_key_1.JsonNameMetadataKey, target)) {
            Reflect.defineMetadata(metadata_key_1.JsonNameMetadataKey, new meta_store_1.MetaStore(), target);
        }
        var metaStore = Reflect.getMetadata(metadata_key_1.JsonNameMetadataKey, target);
        var targetKey = name ? name : propertyKey;
        var deserializer = proto.fromServer ? proto.fromServer : function (value) { return deserialize_1.deserialize(value, proto); };
        metaStore.addProperty(propertyKey, targetKey, true, null, deserializer);
    };
}
exports.JsonStruct = JsonStruct;
function JsonMeta(proto) {
    return JsonStruct.call(null, proto, metadata_key_1.ParentKey);
}
exports.JsonMeta = JsonMeta;
function JsonRaw() {
    throw new Error('Not implemented');
}
exports.JsonRaw = JsonRaw;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var JsonName_1 = __webpack_require__(3);
exports.JsonName = JsonName_1.JsonName;
exports.JsonNameReadonly = JsonName_1.JsonNameReadonly;
exports.JsonStruct = JsonName_1.JsonStruct;
exports.JsonMeta = JsonName_1.JsonMeta;
var serialize_1 = __webpack_require__(2);
exports.serialize = serialize_1.serialize;
var deserialize_1 = __webpack_require__(1);
exports.deserialize = deserialize_1.deserialize;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MetaStore = (function () {
    function MetaStore() {
        this.propertiesMetaStore = {};
        this.keyPropertyInversion = {};
        this.propertyKeys = [];
    }
    MetaStore.prototype.addProperty = function (propertyKey, targetKey, struct, serialize, deserialize) {
        if (struct === void 0) { struct = false; }
        if (this.propertiesMetaStore[propertyKey]) {
            console.warn("Property \"" + propertyKey + "\" already have metadata for serialization");
        }
        this.propertiesMetaStore[propertyKey] = {
            propertyKey: propertyKey,
            targetKey: targetKey,
            struct: struct,
            serialize: serialize,
            deserialize: deserialize
        };
        this.propertyKeys.push(propertyKey);
        if (this.keyPropertyInversion[targetKey]) {
            console.warn("Target key \"" + targetKey + "\" already taken");
        }
        this.keyPropertyInversion[targetKey] = propertyKey;
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


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var metadata_key_1 = __webpack_require__(0);
var serialize_1 = __webpack_require__(2);
function serializeValue(metadata, value, instance) {
    if (!metadata) {
        return;
    }
    if (metadata.struct) {
        var serializer = value ? value.toServer : null;
        return serializer ? serializer.call(value) : (value ? serialize_1.serialize(value) : null);
    }
    else {
        var serializer = metadata.serialize;
        return serializer ? serializer(value, instance) : value;
    }
}
exports.serializeValue = serializeValue;
function assignSerializedValueToResult(metadata, serializedValue, result) {
    if (![null, undefined].includes(serializedValue)) {
        var jsonName = metadata.targetKey;
        if (jsonName !== metadata_key_1.ParentKey) {
            result[jsonName] = serializedValue;
        }
        else {
            Object.assign(result, serializedValue);
        }
    }
}
exports.assignSerializedValueToResult = assignSerializedValueToResult;


/***/ })
/******/ ]);
});