"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mobx_1 = require("mobx");
const uuid_1 = require("uuid");
const axios_1 = require("axios");
const API_BASE = "https://mobx-next-todos.firebaseio.com/todos/";
class Todo {
    constructor(payload) {
        this.changeTitle = title => {
            this.title = title;
            this.persistTodo();
        };
        this.toggle = () => {
            this.completed = !this.completed;
            this.persistTodo();
        };
        this.destroy = () => __awaiter(this, void 0, void 0, function* () {
            this.loading = true;
            try {
                yield axios_1.default.delete(`${API_BASE}${this.id}.json`);
                this.store.todos.remove(this);
            }
            catch (e) {
                console.error(e.message);
            }
            this.loading = false;
        });
        this.setTitle = title => (this.title = title);
        this.persistTodo = () => __awaiter(this, void 0, void 0, function* () {
            this.loading = true;
            try {
                yield axios_1.default.put(`${API_BASE}${this.id}.json`, this.toJSON());
            }
            catch (e) {
                console.error(e.message);
            }
            this.loading = false;
        });
        this.toJSON = () => {
            return {
                id: this.id,
                title: this.title,
                completed: this.completed,
                createdAt: this.createdAt,
                photoURL: this.photoURL,
                displayName: this.displayName,
                uid: this.uid
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
    }
}
class AppStore {
    constructor(initialState) {
        this.appName = "Yo";
        this.fetchTodos = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield axios_1.default.get(`${API_BASE}.json?sortVyValue=createdAt`);
                this.todos = [];
                for (let id in data) {
                    const todo = data[id];
                    this.todos.push(new Todo(todo));
                }
            }
            catch (e) {
                console.error(e.message);
            }
        });
        this.addTodo = mobx_1.action((todo, persist) => {
            const payload = Object.assign({}, todo, {
                store: this,
                id: todo.id || uuid_1.default.v4(),
                completed: false,
                persist,
                createdAt: todo.createdAt || Date.now() * -1 //Allows DESC sorting when fetching the todos from Firebase
            });
            this.todos.push(new Todo(payload));
        });
        this.toJSON = () => this.todos.map(todo => todo.toJSON());
        mobx_1.extendObservable(this, {
            todos: []
        });
        if (initialState) {
            initialState.forEach(todo => this.addTodo(Object.assign({}, todo, { store: this }), false));
        }
    }
}
__decorate([
    mobx_1.observable
], AppStore.prototype, "appName", void 0);
exports.AppStore = AppStore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwU3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcHBTdG9yZS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLCtCQUE0RDtBQUM1RCwrQkFBd0I7QUFDeEIsaUNBQTBCO0FBRTFCLE1BQU0sUUFBUSxHQUFHLCtDQUErQyxDQUFDO0FBRWpFO0lBVUUsWUFBWSxPQUFPO1FBaUJuQixnQkFBVyxHQUFHLEtBQUssQ0FBQyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ25CLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyQixDQUFDLENBQUM7UUFFRixXQUFNLEdBQUcsR0FBRyxFQUFFO1lBQ1osSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDakMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3JCLENBQUMsQ0FBQztRQUVGLFlBQU8sR0FBRyxHQUFTLEVBQUU7WUFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFDcEIsSUFBSSxDQUFDO2dCQUNILE1BQU0sZUFBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLFFBQVEsR0FBRyxJQUFJLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDakQsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hDLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNYLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzNCLENBQUM7WUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUN2QixDQUFDLENBQUEsQ0FBQztRQUVGLGFBQVEsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMs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QUFFO2dCQUN0QyxLQUFLLEVBQUUsSUFBSTtnQkFDWCxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsSUFBSSxjQUFJLENBQUMsRUFBRSxFQUFFO2dCQUN4QixTQUFTLEVBQUUsS0FBSztnQkFDaEIsT0FBTztnQkFDUCxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsMkRBQTJEO2FBQ3pHLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7UUFFSCxXQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQWhDbkQsdUJBQWdCLENBQUMsSUFBSSxFQUFFO1lBQ3JCLEtBQUssRUFBRSxFQUFFO1NBQ1YsQ0FBQyxDQUFDO1FBQ0gsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNqQixZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzlGLENBQUM7SUFDSCxDQUFDO0NBMkJGO0FBcENhO0lBQVgsaUJBQVU7eUNBQWdCO0FBRDdCLDRCQXFDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFjdGlvbiwgZXh0ZW5kT2JzZXJ2YWJsZSwgb2JzZXJ2YWJsZSB9IGZyb20gXCJtb2J4XCI7XG5pbXBvcnQgVXVpZCBmcm9tIFwidXVpZFwiO1xuaW1wb3J0IEF4aW9zIGZyb20gXCJheGlvc1wiO1xuXG5jb25zdCBBUElfQkFTRSA9IFwiaHR0cHM6Ly9tb2J4LW5leHQtdG9kb3MuZmlyZWJhc2Vpby5jb20vdG9kb3MvXCI7XG5cbmNsYXNzIFRvZG8ge1xuICBsb2FkaW5nOiBib29sZWFuO1xuICBjb21wbGV0ZWQ6IGJvb2xlYW47XG4gIHRpdGxlOiBhbnk7XG4gIHVpZDogYW55O1xuICBkaXNwbGF5TmFtZTogYW55O1xuICBwaG90b1VSTDogYW55O1xuICBjcmVhdGVkQXQ6IGFueTtcbiAgaWQ6IGFueTtcbiAgc3RvcmU6IGFueTtcbiAgY29uc3RydWN0b3IocGF5bG9hZCkge1xuICAgIHRoaXMuc3RvcmUgPSBwYXlsb2FkLnN0b3JlO1xuICAgIHRoaXMuaWQgPSBwYXlsb2FkLmlkO1xuICAgIHRoaXMudWlkID0gcGF5bG9hZC51aWQ7XG4gICAgdGhpcy5waG90b1VSTCA9IHBheWxvYWQucGhvdG9VUkw7XG4gICAgdGhpcy5kaXNwbGF5TmFtZSA9IHBheWxvYWQuZGlzcGxheU5hbWU7XG4gICAgdGhpcy5jcmVhdGVkQXQgPSBwYXlsb2FkLmNyZWF0ZWRBdDtcbiAgICBleHRlbmRPYnNlcnZhYmxlKHRoaXMsIHtcbiAgICAgIHRpdGxlOiBwYXlsb2FkLnRpdGxlLFxuICAgICAgY29tcGxldGVkOiBwYXlsb2FkLmNvbXBsZXRlZCxcbiAgICAgIGxvYWRpbmc6IGZhbHNlXG4gICAgfSk7XG4gICAgaWYgKHBheWxvYWQucGVyc2lzdCA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy5wZXJzaXN0VG9kbygpO1xuICAgIH1cbiAgfVxuXG4gIGNoYW5nZVRpdGxlID0gdGl0bGUgPT4ge1xuICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcbiAgICB0aGlzLnBlcnNpc3RUb2RvKCk7XG4gIH07XG5cbiAgdG9nZ2xlID0gKCkgPT4ge1xuICAgIHRoaXMuY29tcGxldGVkID0gIXRoaXMuY29tcGxldGVkO1xuICAgIHRoaXMucGVyc2lzdFRvZG8oKTtcbiAgfTtcblxuICBkZXN0cm95ID0gYXN5bmMgKCkgPT4ge1xuICAgIHRoaXMubG9hZGluZyA9IHRydWU7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IEF4aW9zLmRlbGV0ZShgJHtBUElfQkFTRX0ke3RoaXMuaWR9Lmpzb25gKTtcbiAgICAgIHRoaXMuc3RvcmUudG9kb3MucmVtb3ZlKHRoaXMpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZS5tZXNzYWdlKTtcbiAgICB9XG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gIH07XG5cbiAgc2V0VGl0bGUgPSB0aXRsZSA9PiAodGhpcy50aXRsZSA9IHRpdGxlKTtcblxuICBwZXJzaXN0VG9kbyA9IGFzeW5jICgpID0+IHtcbiAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBBeGlvcy5wdXQoYCR7QVBJX0JBU0V9JHt0aGlzLmlkfS5qc29uYCwgdGhpcy50b0pTT04oKSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihlLm1lc3NhZ2UpO1xuICAgIH1cbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgfTtcblxuICB0b0pTT04gPSAoKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgdGl0bGU6IHRoaXMudGl0bGUsXG4gICAgICBjb21wbGV0ZWQ6IHRoaXMuY29tcGxldGVkLFxuICAgICAgY3JlYXRlZEF0OiB0aGlzLmNyZWF0ZWRBdCxcbiAgICAgIHBob3RvVVJMOiB0aGlzLnBob3RvVVJMLFxuICAgICAgZGlzcGxheU5hbWU6IHRoaXMuZGlzcGxheU5hbWUsXG4gICAgICB1aWQ6IHRoaXMudWlkXG4gICAgfTtcbiAgfTtcbn1cblxuZXhwb3J0IGNsYXNzIEFwcFN0b3JlIHtcbiAgQG9ic2VydmFibGUgYXBwTmFtZSA9IFwiWW9cIjtcbiAgdG9kb3M6IGFueVtdO1xuICBjb25zdHJ1Y3Rvcihpbml0aWFsU3RhdGUpIHtcbiAgICBleHRlbmRPYnNlcnZhYmxlKHRoaXMsIHtcbiAgICAgIHRvZG9zOiBbXVxuICAgIH0pO1xuICAgIGlmIChpbml0aWFsU3RhdGUpIHtcbiAgICAgIGluaXRpYWxTdGF0ZS5mb3JFYWNoKHRvZG8gPT4gdGhpcy5hZGRUb2RvKE9iamVjdC5hc3NpZ24oe30sIHRvZG8sIHsgc3RvcmU6IHRoaXMgfSksIGZhbHNlKSk7XG4gICAgfVxuICB9XG5cbiAgZmV0Y2hUb2RvcyA9IGFzeW5jICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCBBeGlvcy5nZXQoYCR7QVBJX0JBU0V9Lmpzb24/c29ydFZ5VmFsdWU9Y3JlYXRlZEF0YCk7XG4gICAgICB0aGlzLnRvZG9zID0gW107XG4gICAgICBmb3IgKGxldCBpZCBpbiBkYXRhKSB7XG4gICAgICAgIGNvbnN0IHRvZG8gPSBkYXRhW2lkXTtcbiAgICAgICAgdGhpcy50b2Rvcy5wdXNoKG5ldyBUb2RvKHRvZG8pKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGUubWVzc2FnZSk7XG4gICAgfVxuICB9O1xuXG4gIGFkZFRvZG8gPSBhY3Rpb24oKHRvZG8sIHBlcnNpc3QpID0+IHtcbiAgICBjb25zdCBwYXlsb2FkID0gT2JqZWN0LmFzc2lnbih7fSwgdG9kbywge1xuICAgICAgc3RvcmU6IHRoaXMsXG4gICAgICBpZDogdG9kby5pZCB8fCBVdWlkLnY0KCksXG4gICAgICBjb21wbGV0ZWQ6IGZhbHNlLFxuICAgICAgcGVyc2lzdCxcbiAgICAgIGNyZWF0ZWRBdDogdG9kby5jcmVhdGVkQXQgfHwgRGF0ZS5ub3coKSAqIC0xIC8vQWxsb3dzIERFU0Mgc29ydGluZyB3aGVuIGZldGNoaW5nIHRoZSB0b2RvcyBmcm9tIEZpcmViYXNlXG4gICAgfSk7XG4gICAgdGhpcy50b2Rvcy5wdXNoKG5ldyBUb2RvKHBheWxvYWQpKTtcbiAgfSk7XG5cbiAgdG9KU09OID0gKCkgPT4gdGhpcy50b2Rvcy5tYXAodG9kbyA9PiB0b2RvLnRvSlNPTigpKTtcbn1cbiJdfQ==