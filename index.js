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


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var metadata_key_1 = __webpack_require__(0);
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
        name = name ? name : propertyKey;
        // (Reflect as any) - typo-хак, пока конфликтуют reflect-metadata и ES6 Reflect
        Reflect.defineMetadata(metadata_key_1.JsonNameMetadataKey, { name: name, serialize: serialize, deserialize: deserialize }, target, propertyKey);
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


/***/ }),
/* 2 */
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
    for (var propName in retVal) {
        if (!Object.prototype.hasOwnProperty.call(retVal, propName))
            continue;
        var serializeProps = Reflect.getMetadata(metadata_key_1.JsonNameMetadataKey, target, propName);
        if (serializeProps) {
            var deserialize_1 = serializeProps.deserialize;
            var jsonName = serializeProps.name;
            var jsonValue = data[jsonName];
            if (typeof jsonValue !== 'undefined') {
                retVal[propName] = deserialize_1 ? deserialize_1(jsonValue) : jsonValue;
            }
        }
    }
    return retVal;
}
exports.deserialize = deserialize;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var metadata_key_1 = __webpack_require__(0);
/**
 * @description Хэлпер для сериализации классов, имеющих поля с навешанным декоратором JsonName. Сериализует только те
 *     поля, у которых есть декоратор и задано начальное значение.
 * @param model - экземпляр класса, который надо превратить в данные для отправки серверу по JSONRPC
 * @returns {{}} - обычный объект JS
 */
function serialize(model) {
    var result = {};
    var target = Object.getPrototypeOf(model);
    for (var propName in model) {
        if (!Object.prototype.hasOwnProperty.call(model, propName))
            continue;
        var serializeProps = Reflect.getMetadata(metadata_key_1.JsonNameMetadataKey, target, propName);
        if (serializeProps) {
            var serialize_1 = serializeProps.serialize;
            var jsonName = serializeProps.name;
            var jsonValue = model[propName];
            var serializedValue = serialize_1 ? serialize_1(jsonValue, model) : jsonValue;
            if (![null, undefined].includes(serializedValue)) {
                result[jsonName] = serializedValue;
            }
        }
    }
    return result;
}
exports.serialize = serialize;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var JsonName_1 = __webpack_require__(1);
exports.JsonName = JsonName_1.JsonName;
exports.JsonNameReadonly = JsonName_1.JsonNameReadonly;
var serialize_1 = __webpack_require__(3);
exports.serialize = serialize_1.serialize;
var deserialize_1 = __webpack_require__(2);
exports.deserialize = deserialize_1.deserialize;


/***/ })
/******/ ]);
});