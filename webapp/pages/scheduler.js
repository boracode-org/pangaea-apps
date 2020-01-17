"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_web_1 = require("react-native-web");
const Page_1 = require("../components/Page");
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const Scheduler_1 = require("../components/Scheduler/Scheduler");
let Default = class Default extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            devices: null,
            currentDevice: null
        };
        this.addYo = mobx_1.action(() => {
            this.props.app.appName += "YOOO TO MA";
        });
    }
    render() {
        const { devices, currentDevice } = this.state;
        return (React.createElement(react_native_web_1.View, null,
            React.createElement(Scheduler_1.Scheduler, null)));
    }
};
Default = __decorate([
    mobx_react_1.observer
], Default);
exports.default = mobx_react_1.observer(Page_1.ComposedComponent(Default));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2NoZWR1bGVyLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLCtCQUErQjtBQUUvQix1REFBa0U7QUFDbEUsNkNBQXVEO0FBSXZELCtCQUE4QjtBQUU5QiwyQ0FBOEM7QUFHOUMsaUVBQThEO0FBRzlELElBQU0sT0FBTyxHQUFiLGFBQWMsU0FBUSxLQUFLLENBQUMsU0FBaUM7SUFEN0Q7O1FBRUUsVUFBSyxHQUFHO1lBQ04sT0FBTyxFQUFDLElBQUk7WUFDWixhQUFhLEVBQUUsSUFBSTtTQUNwQixDQUFDO1FBQ0YsVUFBSyxHQUFHLGFBQU0sQ0FBQyxHQUFHLEVBQUU7WUFDbEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxJQUFJLFlBQVksQ0FBQztRQUN6QyxDQUFDLENBQUMsQ0FBQztJQVVMLENBQUM7SUFSUSxNQUFNO1FBQ1gsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQzlDLE1BQU0sQ0FBQyxDQUNMLG9CQUFDLHVCQUFJO1lBQ0gsb0JBQUMscUJBQVMsT0FBRyxDQUNSLENBQ1IsQ0FBQztJQUNKLENBQUM7Q0FDRixDQUFBO0FBakJLLE9BQU87SUFEWixxQkFBUTtHQUNILE9BQU8sQ0FpQlo7QUFFRCxrQkFBZSxxQkFBUSxDQUFDLHdCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBNeUNvbXBvbmVudCBmcm9tIFwiLi4vY29tcG9uZW50cy9NeUNvbXBvbmVudFwiO1xuaW1wb3J0IHsgVmlldywgVGV4dCwgQnV0dG9uLCBTY3JvbGxWaWV3IH0gZnJvbSBcInJlYWN0LW5hdGl2ZS13ZWJcIjtcbmltcG9ydCB7IENvbXBvc2VkQ29tcG9uZW50IH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvUGFnZVwiO1xuaW1wb3J0IHsgVGFibGUsIFRhYmxlV3JhcHBlciwgUm93LCBSb3dzLCBDb2wsIENvbHMsIENlbGwgfSBmcm9tIFwicmVhY3QtbmF0aXZlLXRhYmxlLWNvbXBvbmVudFwiO1xuXG5pbXBvcnQgeyBBcHBTdG9yZSB9IGZyb20gXCIuLi9zdG9yZXMvYXBwU3RvcmVcIjtcbmltcG9ydCB7IGFjdGlvbiB9IGZyb20gXCJtb2J4XCI7XG5cbmltcG9ydCB7IGluamVjdCwgb2JzZXJ2ZXIgfSBmcm9tIFwibW9ieC1yZWFjdFwiO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tIFwicHJvcC10eXBlc1wiO1xuaW1wb3J0ICogYXMgUmVhY3RET00gZnJvbSBcInJlYWN0LWRvbVwiO1xuaW1wb3J0IHsgU2NoZWR1bGVyIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvU2NoZWR1bGVyL1NjaGVkdWxlclwiO1xuXG5Ab2JzZXJ2ZXJcbmNsYXNzIERlZmF1bHQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8eyBhcHA6IEFwcFN0b3JlIH0sIGFueT4ge1xuICBzdGF0ZSA9IHtcbiAgICBkZXZpY2VzOm51bGwsXG4gICAgY3VycmVudERldmljZTogbnVsbFxuICB9O1xuICBhZGRZbyA9IGFjdGlvbigoKSA9PiB7XG4gICAgdGhpcy5wcm9wcy5hcHAuYXBwTmFtZSArPSBcIllPT08gVE8gTUFcIjtcbiAgfSk7XG5cbiAgcHVibGljIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGRldmljZXMsIGN1cnJlbnREZXZpY2UgfSA9IHRoaXMuc3RhdGU7XG4gICAgcmV0dXJuIChcbiAgICAgIDxWaWV3PlxuICAgICAgICA8U2NoZWR1bGVyIC8+XG4gICAgICA8L1ZpZXc+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBvYnNlcnZlcihDb21wb3NlZENvbXBvbmVudChEZWZhdWx0KSk7XG4iXX0=