"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Helper file to construct a new Store on each server render
// Or to construct and return a singleton on browser renders
// Thanks to @impronunciable for pinpointing this requirement here :
// https://github.com/zeit/next.js/wiki/Redux-example
var appStore_1 = require("./appStore");
var stores = {
    //   __userStore__: initialState => new User(initialState),
    __appStore__: function __appStore__(initialState) {
        return new appStore_1.AppStore(initialState);
    }
};
exports.default = function (store, initialState) {
    var storeConstruct = stores[store];
    if (typeof window !== "undefined") {
        if (!window[store]) {
            window[store] = storeConstruct(initialState);
        }
        return window[store];
    } else {
        return storeConstruct(initialState);
    }
};