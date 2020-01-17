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
const React = require("react");
const react_native_web_1 = require("react-native-web");
const Page_1 = require("../components/Page");
const mobx_react_1 = require("mobx-react");
const mobx_1 = require("mobx");
const Database_1 = require("../components/Database");
let Login = class Login extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            username: null,
            password: null
        };
        this.addYo = mobx_1.action(() => {
            this.props.app.appName += "YOOO TO MA";
        });
        this.login = () => __awaiter(this, void 0, void 0, function* () {
            var { username, password } = this.state;
            // alert(JSON.stringify({username,password}));
            try {
                yield Database_1.Database.login(username, password);
                alert("Successfully logged you in...");
                window.location = "/scheduler";
            }
            catch (e) {
                alert("Failed to log you in: " + e.message);
            }
        });
    }
    render() {
        var { username, password } = this.state;
        return (React.createElement(react_native_web_1.View, { style: { flex: 1, justifyContent: "center", alignItems: "center", alignContent: "center" } },
            React.createElement(react_native_web_1.View, { style: {
                    backgroundColor: "#FAFAFA",
                    width: 400,
                    height: 300,
                    padding: 10,
                    marginTop: 100
                } },
                React.createElement(react_native_web_1.Text, { style: {
                        backgroundColor: "white",
                        color: "black",
                        width: "100%",
                        fontSize: 30,
                        marginBottom: 20
                    } }, "Login"),
                React.createElement(react_native_web_1.TextInput, { placeholder: "Username", value: username, style: {
                        margin: 5,
                        fontSize: 20,
                        padding: 5,
                        border: "1px solid lightblue",
                        borderRadius: 5
                    }, onChange: e => this.setState({ username: e.nativeEvent.text }) }),
                React.createElement(react_native_web_1.TextInput, { placeholder: "Password", value: password, secureTextEntry: true, style: {
                        margin: 5,
                        fontSize: 20,
                        padding: 5,
                        border: "1px solid lightblue",
                        borderRadius: 5
                    }, onChange: e => this.setState({ password: e.nativeEvent.text }) }),
                React.createElement(react_native_web_1.View, { style: { width: 100, padding: 5 } },
                    React.createElement(react_native_web_1.Button, { title: "Login", onPress: this.login })))));
    }
};
Login = __decorate([
    mobx_react_1.observer
], Login);
exports.default = mobx_react_1.observer(Page_1.ComposedComponent(Login));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsb2dpbi50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLCtCQUErQjtBQUUvQix1REFBaUU7QUFDakUsNkNBQXVEO0FBQ3ZELDJDQUFzQztBQUV0QywrQkFBOEI7QUFDOUIscURBQWtEO0FBR2xELElBQU0sS0FBSyxHQUFYLFdBQVksU0FBUSxLQUFLLENBQUMsU0FBaUM7SUFEM0Q7O1FBRUUsVUFBSyxHQUFHO1lBQ04sUUFBUSxFQUFFLElBQUk7WUFDZCxRQUFRLEVBQUUsSUFBSTtTQUNmLENBQUM7UUFDRixVQUFLLEdBQUcsYUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNsQixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLElBQUksWUFBWSxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxDQUFDO1FBRUgsVUFBSyxHQUFHLEdBQVMsRUFBRTtZQUNqQixJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDeEMsOENBQThDO1lBQzlDLElBQUksQ0FBQztnQkFDSCxNQUFNLG1CQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDekMsS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUM7Z0JBQ3ZDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDO1lBQ2pDLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNYLEtBQUssQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDOUMsQ0FBQztRQUNILENBQUMsQ0FBQSxDQUFDO0lBNkRKLENBQUM7SUEzREMsTUFBTTtRQUNKLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUV4QyxNQUFNLENBQUMsQ0FDTCxvQkFBQyx1QkFBSSxJQUNILEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUU7WUFFMUYsb0JBQUMsdUJBQUksSUFDSCxLQUFLLEVBQUU7b0JBQ0wsZUFBZSxFQUFFLFNBQVM7b0JBQzFCLEtBQUssRUFBRSxHQUFHO29CQUNWLE1BQU0sRUFBRSxHQUFHO29CQUNYLE9BQU8sRUFBRSxFQUFFO29CQUNYLFNBQVMsRUFBRSxHQUFHO2lCQUNmO2dCQUVELG9CQUFDLHVCQUFJLElBQ0gsS0FBSyxFQUFFO3dCQUNMLGVBQWUsRUFBRSxPQUFPO3dCQUN4QixLQUFLLEVBQUUsT0FBTzt3QkFDZCxLQUFLLEVBQUUsTUFBTTt3QkFDYixRQUFRLEVBQUUsRUFBRTt3QkFDWixZQUFZLEVBQUUsRUFBRTtxQkFDakIsWUFHSTtnQkFDUCxvQkFBQyw0QkFBUyxJQUNSLFdBQVcsRUFBQyxVQUFVLEVBQ3RCLEtBQUssRUFBRSxRQUFRLEVBQ2YsS0FBSyxFQUFFO3dCQUNMLE1BQU0sRUFBRSxDQUFDO3dCQUNULFFBQVEsRUFBRSxFQUFFO3dCQUNaLE9BQU8sRUFBRSxDQUFDO3dCQUNWLE1BQU0sRUFBRSxxQkFBcUI7d0JBQzdCLFlBQVksRUFBRSxDQUFDO3FCQUNoQixFQUNELFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUM5RDtnQkFDRixvQkFBQyw0QkFBUyxJQUNSLFdBQVcsRUFBQyxVQUFVLEVBQ3RCLEtBQUssRUFBRSxRQUFRLEVBQ2YsZUFBZSxFQUFFLElBQUksRUFDckIsS0FBSyxFQUFFO3dCQUNMLE1BQU0sRUFBRSxDQUFDO3dCQUNULFFBQVEsRUFBRSxFQUFFO3dCQUNaLE9BQU8sRUFBRSxDQUFDO3dCQUNWLE1BQU0sRUFBRSxxQkFBcUI7d0JBQzdCLFlBQVksRUFBRSxDQUFDO3FCQUNoQixFQUNELFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUM5RDtnQkFDRixvQkFBQyx1QkFBSSxJQUFDLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRTtvQkFDckMsb0JBQUMseUJBQU0sSUFBQyxLQUFLLEVBQUMsT0FBTyxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxHQUFJLENBQ3hDLENBQ0YsQ0FDRixDQUNSLENBQUM7SUFDSixDQUFDO0NBQ0YsQ0FBQTtBQWhGSyxLQUFLO0lBRFYscUJBQVE7R0FDSCxLQUFLLENBZ0ZWO0FBQ0Qsa0JBQWUscUJBQVEsQ0FBQyx3QkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgTXlDb21wb25lbnQgZnJvbSBcIi4uL2NvbXBvbmVudHMvTXlDb21wb25lbnRcIjtcbmltcG9ydCB7IFZpZXcsIFRleHQsIEJ1dHRvbiwgVGV4dElucHV0IH0gZnJvbSBcInJlYWN0LW5hdGl2ZS13ZWJcIjtcbmltcG9ydCB7IENvbXBvc2VkQ29tcG9uZW50IH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvUGFnZVwiO1xuaW1wb3J0IHsgb2JzZXJ2ZXIgfSBmcm9tIFwibW9ieC1yZWFjdFwiO1xuaW1wb3J0IHsgQXBwU3RvcmUgfSBmcm9tIFwiLi4vc3RvcmVzL2FwcFN0b3JlXCI7XG5pbXBvcnQgeyBhY3Rpb24gfSBmcm9tIFwibW9ieFwiO1xuaW1wb3J0IHsgRGF0YWJhc2UgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9EYXRhYmFzZVwiO1xuXG5Ab2JzZXJ2ZXJcbmNsYXNzIExvZ2luIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PHsgYXBwOiBBcHBTdG9yZSB9LCBhbnk+IHtcbiAgc3RhdGUgPSB7XG4gICAgdXNlcm5hbWU6IG51bGwsXG4gICAgcGFzc3dvcmQ6IG51bGxcbiAgfTtcbiAgYWRkWW8gPSBhY3Rpb24oKCkgPT4ge1xuICAgIHRoaXMucHJvcHMuYXBwLmFwcE5hbWUgKz0gXCJZT09PIFRPIE1BXCI7XG4gIH0pO1xuXG4gIGxvZ2luID0gYXN5bmMgKCkgPT4ge1xuICAgIHZhciB7IHVzZXJuYW1lLCBwYXNzd29yZCB9ID0gdGhpcy5zdGF0ZTtcbiAgICAvLyBhbGVydChKU09OLnN0cmluZ2lmeSh7dXNlcm5hbWUscGFzc3dvcmR9KSk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IERhdGFiYXNlLmxvZ2luKHVzZXJuYW1lLCBwYXNzd29yZCk7XG4gICAgICBhbGVydChcIlN1Y2Nlc3NmdWxseSBsb2dnZWQgeW91IGluLi4uXCIpO1xuICAgICAgd2luZG93LmxvY2F0aW9uID0gXCIvc2NoZWR1bGVyXCI7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgYWxlcnQoXCJGYWlsZWQgdG8gbG9nIHlvdSBpbjogXCIgKyBlLm1lc3NhZ2UpO1xuICAgIH1cbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgdmFyIHsgdXNlcm5hbWUsIHBhc3N3b3JkIH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxWaWV3XG4gICAgICAgIHN0eWxlPXt7IGZsZXg6IDEsIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLCBhbGlnbkNvbnRlbnQ6IFwiY2VudGVyXCIgfX1cbiAgICAgID5cbiAgICAgICAgPFZpZXdcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcIiNGQUZBRkFcIixcbiAgICAgICAgICAgIHdpZHRoOiA0MDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDMwMCxcbiAgICAgICAgICAgIHBhZGRpbmc6IDEwLFxuICAgICAgICAgICAgbWFyZ2luVG9wOiAxMDBcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPFRleHRcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogXCJ3aGl0ZVwiLFxuICAgICAgICAgICAgICBjb2xvcjogXCJibGFja1wiLFxuICAgICAgICAgICAgICB3aWR0aDogXCIxMDAlXCIsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAzMCxcbiAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAyMFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICBMb2dpblxuICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgICA8VGV4dElucHV0XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlVzZXJuYW1lXCJcbiAgICAgICAgICAgIHZhbHVlPXt1c2VybmFtZX1cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIG1hcmdpbjogNSxcbiAgICAgICAgICAgICAgZm9udFNpemU6IDIwLFxuICAgICAgICAgICAgICBwYWRkaW5nOiA1LFxuICAgICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIGxpZ2h0Ymx1ZVwiLFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDVcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvbkNoYW5nZT17ZSA9PiB0aGlzLnNldFN0YXRlKHsgdXNlcm5hbWU6IGUubmF0aXZlRXZlbnQudGV4dCB9KX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxUZXh0SW5wdXRcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiUGFzc3dvcmRcIlxuICAgICAgICAgICAgdmFsdWU9e3Bhc3N3b3JkfVxuICAgICAgICAgICAgc2VjdXJlVGV4dEVudHJ5PXt0cnVlfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgbWFyZ2luOiA1LFxuICAgICAgICAgICAgICBmb250U2l6ZTogMjAsXG4gICAgICAgICAgICAgIHBhZGRpbmc6IDUsXG4gICAgICAgICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgbGlnaHRibHVlXCIsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogNVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHRoaXMuc2V0U3RhdGUoeyBwYXNzd29yZDogZS5uYXRpdmVFdmVudC50ZXh0IH0pfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFZpZXcgc3R5bGU9e3sgd2lkdGg6IDEwMCwgcGFkZGluZzogNSB9fT5cbiAgICAgICAgICAgIDxCdXR0b24gdGl0bGU9XCJMb2dpblwiIG9uUHJlc3M9e3RoaXMubG9naW59IC8+XG4gICAgICAgICAgPC9WaWV3PlxuICAgICAgICA8L1ZpZXc+XG4gICAgICA8L1ZpZXc+XG4gICAgKTtcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgb2JzZXJ2ZXIoQ29tcG9zZWRDb21wb25lbnQoTG9naW4pKTtcbiJdfQ==