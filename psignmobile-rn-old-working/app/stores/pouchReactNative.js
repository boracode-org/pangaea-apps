"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// PouchDB SQLite ReactNative Adapter...
const pouchdb_adapter_websql_core_1 = require("pouchdb-adapter-websql-core");
const valid_1 = require("./valid");
function openDB(name, version, description, size) {
    // Traditional WebSQL API
    return openDatabase(name, version, description, size);
}
function WebSQLPouch(opts, callback) {
    var _opts = Object.assign({
        websql: openDB
    }, opts);
    pouchdb_adapter_websql_core_1.default.call(this, _opts, callback);
}
WebSQLPouch.valid = valid_1.default;
WebSQLPouch.use_prefix = true;
function default_1(PouchDB) {
    PouchDB.adapter('websql', WebSQLPouch, true);
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG91Y2hSZWFjdE5hdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBvdWNoUmVhY3ROYXRpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3Q0FBd0M7QUFDeEMsNkVBQTBEO0FBRTFELG1DQUE0QjtBQUU1QixTQUFTLE1BQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxJQUFJO0lBQzlDLHlCQUF5QjtJQUN6QixPQUFPLFlBQVksQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN4RCxDQUFDO0FBRUQsU0FBUyxXQUFXLENBQUMsSUFBSSxFQUFFLFFBQVE7SUFDakMsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUN4QixNQUFNLEVBQUUsTUFBTTtLQUNmLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFFVCxxQ0FBZSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzlDLENBQUM7QUFFRCxXQUFXLENBQUMsS0FBSyxHQUFHLGVBQUssQ0FBQztBQUUxQixXQUFXLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztBQUU5QixtQkFBeUIsT0FBTztJQUM5QixPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDL0MsQ0FBQztBQUZELDRCQUVDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gUG91Y2hEQiBTUUxpdGUgUmVhY3ROYXRpdmUgQWRhcHRlci4uLlxuaW1wb3J0IFdlYlNxbFBvdWNoQ29yZSBmcm9tICdwb3VjaGRiLWFkYXB0ZXItd2Vic3FsLWNvcmUnO1xuXG5pbXBvcnQgdmFsaWQgZnJvbSAnLi92YWxpZCc7XG5cbmZ1bmN0aW9uIG9wZW5EQihuYW1lLCB2ZXJzaW9uLCBkZXNjcmlwdGlvbiwgc2l6ZSkge1xuICAvLyBUcmFkaXRpb25hbCBXZWJTUUwgQVBJXG4gIHJldHVybiBvcGVuRGF0YWJhc2UobmFtZSwgdmVyc2lvbiwgZGVzY3JpcHRpb24sIHNpemUpO1xufVxuXG5mdW5jdGlvbiBXZWJTUUxQb3VjaChvcHRzLCBjYWxsYmFjaykge1xuICB2YXIgX29wdHMgPSBPYmplY3QuYXNzaWduKHtcbiAgICB3ZWJzcWw6IG9wZW5EQlxuICB9LCBvcHRzKTtcblxuICBXZWJTcWxQb3VjaENvcmUuY2FsbCh0aGlzLCBfb3B0cywgY2FsbGJhY2spO1xufVxuXG5XZWJTUUxQb3VjaC52YWxpZCA9IHZhbGlkO1xuXG5XZWJTUUxQb3VjaC51c2VfcHJlZml4ID0gdHJ1ZTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKFBvdWNoREIpIHtcbiAgUG91Y2hEQi5hZGFwdGVyKCd3ZWJzcWwnLCBXZWJTUUxQb3VjaCwgdHJ1ZSk7XG59Il19