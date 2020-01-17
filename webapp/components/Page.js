"use strict";
// The Page Hoc used to wrap all our Page components.
// It serves 3 main purposes :
// 1. Handles global styling
// 2. Handles global layout
// 3. Construct and provide the Mobx stores
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const mobx_react_1 = require("mobx-react");
const stores_1 = require("../stores");
function ComposedComponent(Component) {
    return class extends React.Component {
        static getInitialProps(ctx) {
            return __awaiter(this, void 0, void 0, function* () {
                let userState = null;
                const isServer = !!ctx.req;
                //   if (isServer === true) {
                //     const User = Stores("__userStore__");
                //     userState = User.getUserFromCookie(ctx.req);
                //   }
                const appStore = stores_1.default("__appStore__");
                yield appStore.fetchTodos();
                const appState = appStore.toJSON();
                return {
                    isServer,
                    userState,
                    appState
                };
            });
        }
        constructor(props) {
            super(props);
            this.state = {
                stores: {
                    //   user: Stores("__userStore__", props.userState),
                    app: stores_1.default("__appStore__", props.appState)
                }
            };
        }
        render() {
            // alert("stores:" + JSON.stringify(this.state.stores))
            return (React.createElement(mobx_react_1.Provider, Object.assign({}, this.state.stores),
                React.createElement(Component, { user: this.props, app: this.state.stores.app })));
        }
    };
}
exports.ComposedComponent = ComposedComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlBhZ2UudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxREFBcUQ7QUFDckQsOEJBQThCO0FBQzlCLDRCQUE0QjtBQUM1QiwyQkFBMkI7QUFDM0IsMkNBQTJDOzs7Ozs7Ozs7O0FBRTNDLCtCQUErQjtBQUUvQiwyQ0FBc0M7QUFFdEMsc0NBQStCO0FBRy9CLDJCQUFrQyxTQUFTO0lBQ3pDLE1BQU0sQ0FBQyxLQUFNLFNBQVEsS0FBSyxDQUFDLFNBQW1CO1FBQzVDLE1BQU0sQ0FBTyxlQUFlLENBQUMsR0FBRzs7Z0JBQzlCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQztnQkFDckIsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7Z0JBRTNCLDZCQUE2QjtnQkFDN0IsNENBQTRDO2dCQUM1QyxtREFBbUQ7Z0JBQ25ELE1BQU07Z0JBRU4sTUFBTSxRQUFRLEdBQWEsZ0JBQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDbEQsTUFBTSxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQzVCLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDbkMsTUFBTSxDQUFDO29CQUNMLFFBQVE7b0JBQ1IsU0FBUztvQkFDVCxRQUFRO2lCQUNULENBQUM7WUFDSixDQUFDO1NBQUE7UUFFRCxZQUFZLEtBQUs7WUFDZixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDYixJQUFJLENBQUMsS0FBSyxHQUFHO2dCQUNYLE1BQU0sRUFBRTtvQkFDTixvREFBb0Q7b0JBQ3BELEdBQUcsRUFBRSxnQkFBTSxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDO2lCQUM1QzthQUNGLENBQUM7UUFDSixDQUFDO1FBRUQsTUFBTTtZQUNGLHVEQUF1RDtZQUN6RCxNQUFNLENBQUMsQ0FDTCxvQkFBQyxxQkFBUSxvQkFBSyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU07Z0JBQzdCLG9CQUFDLFNBQVMsSUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFJLENBQ2xELENBQ1osQ0FBQztRQUNKLENBQUM7S0FDRixDQUFDO0FBQ0osQ0FBQztBQXhDRCw4Q0F3Q0MiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGUgUGFnZSBIb2MgdXNlZCB0byB3cmFwIGFsbCBvdXIgUGFnZSBjb21wb25lbnRzLlxuLy8gSXQgc2VydmVzIDMgbWFpbiBwdXJwb3NlcyA6XG4vLyAxLiBIYW5kbGVzIGdsb2JhbCBzdHlsaW5nXG4vLyAyLiBIYW5kbGVzIGdsb2JhbCBsYXlvdXRcbi8vIDMuIENvbnN0cnVjdCBhbmQgcHJvdmlkZSB0aGUgTW9ieCBzdG9yZXNcblxuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgSGVhZCBmcm9tIFwibmV4dC9oZWFkXCI7XG5pbXBvcnQgeyBQcm92aWRlciB9IGZyb20gXCJtb2J4LXJlYWN0XCI7XG5cbmltcG9ydCBTdG9yZXMgZnJvbSBcIi4uL3N0b3Jlc1wiO1xuaW1wb3J0IHsgQXBwU3RvcmUgfSBmcm9tIFwiLi4vc3RvcmVzL2FwcFN0b3JlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBDb21wb3NlZENvbXBvbmVudChDb21wb25lbnQpIHtcbiAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XG4gICAgc3RhdGljIGFzeW5jIGdldEluaXRpYWxQcm9wcyhjdHgpIHtcbiAgICAgIGxldCB1c2VyU3RhdGUgPSBudWxsO1xuICAgICAgY29uc3QgaXNTZXJ2ZXIgPSAhIWN0eC5yZXE7XG5cbiAgICAgIC8vICAgaWYgKGlzU2VydmVyID09PSB0cnVlKSB7XG4gICAgICAvLyAgICAgY29uc3QgVXNlciA9IFN0b3JlcyhcIl9fdXNlclN0b3JlX19cIik7XG4gICAgICAvLyAgICAgdXNlclN0YXRlID0gVXNlci5nZXRVc2VyRnJvbUNvb2tpZShjdHgucmVxKTtcbiAgICAgIC8vICAgfVxuXG4gICAgICBjb25zdCBhcHBTdG9yZTogQXBwU3RvcmUgPSBTdG9yZXMoXCJfX2FwcFN0b3JlX19cIik7XG4gICAgICBhd2FpdCBhcHBTdG9yZS5mZXRjaFRvZG9zKCk7XG4gICAgICBjb25zdCBhcHBTdGF0ZSA9IGFwcFN0b3JlLnRvSlNPTigpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNTZXJ2ZXIsXG4gICAgICAgIHVzZXJTdGF0ZSxcbiAgICAgICAgYXBwU3RhdGVcbiAgICAgIH07XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgIHN0b3Jlczoge1xuICAgICAgICAgIC8vICAgdXNlcjogU3RvcmVzKFwiX191c2VyU3RvcmVfX1wiLCBwcm9wcy51c2VyU3RhdGUpLFxuICAgICAgICAgIGFwcDogU3RvcmVzKFwiX19hcHBTdG9yZV9fXCIsIHByb3BzLmFwcFN0YXRlKVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgLy8gYWxlcnQoXCJzdG9yZXM6XCIgKyBKU09OLnN0cmluZ2lmeSh0aGlzLnN0YXRlLnN0b3JlcykpXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8UHJvdmlkZXIgey4uLnRoaXMuc3RhdGUuc3RvcmVzfT5cbiAgICAgICAgICA8Q29tcG9uZW50IHVzZXI9e3RoaXMucHJvcHN9IGFwcD17dGhpcy5zdGF0ZS5zdG9yZXMuYXBwfSAvPlxuICAgICAgICA8L1Byb3ZpZGVyPlxuICAgICAgKTtcbiAgICB9XG4gIH07XG59XG4iXX0=