"use strict";

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _defineProperty = require("babel-runtime/core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = (0, _getOwnPropertyDescriptor2.default)(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : (0, _typeof3.default)(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && (0, _defineProperty2.default)(target, key, r), r;
};
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = _promise2.default))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var mobx_1 = require("mobx");
var uuid_1 = require("uuid");
var axios_1 = require("axios");
var API_BASE = "https://mobx-next-todos.firebaseio.com/todos/";

var Todo = function Todo(payload) {
    var _this = this;

    (0, _classCallCheck3.default)(this, Todo);

    this.changeTitle = function (title) {
        _this.title = title;
        _this.persistTodo();
    };
    this.toggle = function () {
        _this.completed = !_this.completed;
        _this.persistTodo();
    };
    this.destroy = function () {
        return __awaiter(_this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee() {
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            this.loading = true;
                            _context.prev = 1;
                            _context.next = 4;
                            return axios_1.default.delete("" + API_BASE + this.id + ".json");

                        case 4:
                            this.store.todos.remove(this);
                            _context.next = 10;
                            break;

                        case 7:
                            _context.prev = 7;
                            _context.t0 = _context["catch"](1);

                            console.error(_context.t0.message);

                        case 10:
                            this.loading = false;

                        case 11:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this, [[1, 7]]);
        }));
    };
    this.setTitle = function (title) {
        return _this.title = title;
    };
    this.persistTodo = function () {
        return __awaiter(_this, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
            return _regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            this.loading = true;
                            _context2.prev = 1;
                            _context2.next = 4;
                            return axios_1.default.put("" + API_BASE + this.id + ".json", this.toJSON());

                        case 4:
                            _context2.next = 9;
                            break;

                        case 6:
                            _context2.prev = 6;
                            _context2.t0 = _context2["catch"](1);

                            console.error(_context2.t0.message);

                        case 9:
                            this.loading = false;

                        case 10:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, this, [[1, 6]]);
        }));
    };
    this.toJSON = function () {
        return {
            id: _this.id,
            title: _this.title,
            completed: _this.completed,
            createdAt: _this.createdAt,
            photoURL: _this.photoURL,
            displayName: _this.displayName,
            uid: _this.uid
        };
    };
    this.store = payload.store;
    this.id = payload.id;
    this.uid = payload.uid;
    this.photoURL = payload.photoURL;
    this.displayName = payload.displayName;
    this.createdAt = payload.createdAt;
    mobx_1.extendObservable(this, {
        title: payload.title,
        completed: payload.completed,
        loading: false
    });
    if (payload.persist === true) {
        this.persistTodo();
    }
};

var AppStore = function AppStore(initialState) {
    var _this2 = this;

    (0, _classCallCheck3.default)(this, AppStore);

    this.appName = "Yo";
    this.fetchTodos = function () {
        return __awaiter(_this2, void 0, void 0, /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
            var _ref, data, id, todo;

            return _regenerator2.default.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.prev = 0;
                            _context3.next = 3;
                            return axios_1.default.get(API_BASE + ".json?sortVyValue=createdAt");

                        case 3:
                            _ref = _context3.sent;
                            data = _ref.data;

                            this.todos = [];
                            for (id in data) {
                                todo = data[id];

                                this.todos.push(new Todo(todo));
                            }
                            _context3.next = 12;
                            break;

                        case 9:
                            _context3.prev = 9;
                            _context3.t0 = _context3["catch"](0);

                            console.error(_context3.t0.message);

                        case 12:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this, [[0, 9]]);
        }));
    };
    this.addTodo = mobx_1.action(function (todo, persist) {
        var payload = (0, _assign2.default)({}, todo, {
            store: _this2,
            id: todo.id || uuid_1.default.v4(),
            completed: false,
            persist: persist,
            createdAt: todo.createdAt || Date.now() * -1 //Allows DESC sorting when fetching the todos from Firebase
        });
        _this2.todos.push(new Todo(payload));
    });
    this.toJSON = function () {
        return _this2.todos.map(function (todo) {
            return todo.toJSON();
        });
    };
    mobx_1.extendObservable(this, {
        todos: []
    });
    if (initialState) {
        initialState.forEach(function (todo) {
            return _this2.addTodo((0, _assign2.default)({}, todo, { store: _this2 }), false);
        });
    }
};

__decorate([mobx_1.observable], AppStore.prototype, "appName", void 0);
exports.AppStore = AppStore;