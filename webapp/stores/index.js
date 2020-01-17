"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Helper file to construct a new Store on each server render
// Or to construct and return a singleton on browser renders
// Thanks to @impronunciable for pinpointing this requirement here :
// https://github.com/zeit/next.js/wiki/Redux-example
const appStore_1 = require("./appStore");
const stores = {
    //   __userStore__: initialState => new User(initialState),
    __appStore__: initialState => new appStore_1.AppStore(initialState)
};
exports.default = (store, initialState) => {
    const storeConstruct = stores[store];
    if (typeof window !== "undefined") {
        if (!window[store]) {
            window[store] = storeConstruct(initialState);
        }
        return window[store];
    }
    else {
        return storeConstruct(initialState);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2REFBNkQ7QUFDN0QsNERBQTREO0FBQzVELG9FQUFvRTtBQUNwRSxxREFBcUQ7QUFDckQseUNBQW9DO0FBRXBDLE1BQU0sTUFBTSxHQUFHO0lBQ2IsMkRBQTJEO0lBQzNELFlBQVksRUFBRSxZQUFZLENBQUMsRUFBRSxDQUFDLElBQUksbUJBQVEsQ0FBQyxZQUFZLENBQUM7Q0FDekQsQ0FBQztBQUVGLGtCQUFlLENBQUMsS0FBSyxFQUFFLFlBQWEsRUFBRSxFQUFFO0lBQ3RDLE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyQyxFQUFFLENBQUMsQ0FBQyxPQUFPLE1BQU0sS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQixNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQy9DLENBQUM7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLE1BQU0sQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDdEMsQ0FBQztBQUNILENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEhlbHBlciBmaWxlIHRvIGNvbnN0cnVjdCBhIG5ldyBTdG9yZSBvbiBlYWNoIHNlcnZlciByZW5kZXJcbi8vIE9yIHRvIGNvbnN0cnVjdCBhbmQgcmV0dXJuIGEgc2luZ2xldG9uIG9uIGJyb3dzZXIgcmVuZGVyc1xuLy8gVGhhbmtzIHRvIEBpbXByb251bmNpYWJsZSBmb3IgcGlucG9pbnRpbmcgdGhpcyByZXF1aXJlbWVudCBoZXJlIDpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96ZWl0L25leHQuanMvd2lraS9SZWR1eC1leGFtcGxlXG5pbXBvcnQge0FwcFN0b3JlfSBmcm9tIFwiLi9hcHBTdG9yZVwiO1xuXG5jb25zdCBzdG9yZXMgPSB7XG4gIC8vICAgX191c2VyU3RvcmVfXzogaW5pdGlhbFN0YXRlID0+IG5ldyBVc2VyKGluaXRpYWxTdGF0ZSksXG4gIF9fYXBwU3RvcmVfXzogaW5pdGlhbFN0YXRlID0+IG5ldyBBcHBTdG9yZShpbml0aWFsU3RhdGUpXG59O1xuXG5leHBvcnQgZGVmYXVsdCAoc3RvcmUsIGluaXRpYWxTdGF0ZT8pID0+IHtcbiAgY29uc3Qgc3RvcmVDb25zdHJ1Y3QgPSBzdG9yZXNbc3RvcmVdO1xuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGlmICghd2luZG93W3N0b3JlXSkge1xuICAgICAgd2luZG93W3N0b3JlXSA9IHN0b3JlQ29uc3RydWN0KGluaXRpYWxTdGF0ZSk7XG4gICAgfVxuICAgIHJldHVybiB3aW5kb3dbc3RvcmVdO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdG9yZUNvbnN0cnVjdChpbml0aWFsU3RhdGUpO1xuICB9XG59O1xuIl19