"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PSignStore_1 = require("./stores/PSignStore");
const react_1 = require("react");
const React = require("react");
const player_1 = require("./components/player");
const Expo = require("expo");
Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.LANDSCAPE);
console.ignoredYellowBox = ['Setting a timer'];
class App extends react_1.Component {
    render() {
        return <player_1.default store={PSignStore_1.psignStore}/>;
    }
}
exports.default = App;
//<Player store={psignStore}/>
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUE2RDtBQUU3RCxpQ0FBa0M7QUFDbEMsK0JBQStCO0FBSS9CLGdEQUF3RDtBQUV4RCw2QkFBNkI7QUFDN0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBRTNFLE9BQU8sQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFHL0MsTUFBcUIsR0FBSSxTQUFRLGlCQUFtQjtJQUNsRCxNQUFNO1FBQ0osT0FBTyxDQUFDLGdCQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsdUJBQVUsQ0FBQyxFQUFHLENBQUM7SUFDdkMsQ0FBQztDQUNGO0FBSkQsc0JBSUM7QUFFRCw4QkFBOEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTRVJWRVJfVVJMLCBwc2lnblN0b3JlIH0gZnJvbSBcIi4vc3RvcmVzL1BTaWduU3RvcmVcIjtcblxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcblxuaW1wb3J0IHsgQXBwUmVnaXN0cnksIFN0eWxlU2hlZXQsIFRleHQsIFZpZXcgfSBmcm9tIFwicmVhY3QtbmF0aXZlXCI7XG5cbmltcG9ydCB7IGRlZmF1bHQgYXMgUGxheWVyIH0gZnJvbSBcIi4vY29tcG9uZW50cy9wbGF5ZXJcIjtcblxuaW1wb3J0ICogYXMgRXhwbyBmcm9tIFwiZXhwb1wiO1xuRXhwby5TY3JlZW5PcmllbnRhdGlvbi5hbGxvdyhFeHBvLlNjcmVlbk9yaWVudGF0aW9uLk9yaWVudGF0aW9uLkxBTkRTQ0FQRSk7XG5cbmNvbnNvbGUuaWdub3JlZFllbGxvd0JveCA9IFsnU2V0dGluZyBhIHRpbWVyJ107XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXBwIGV4dGVuZHMgQ29tcG9uZW50PGFueSwgYW55PiB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gPFBsYXllciBzdG9yZT17cHNpZ25TdG9yZX0gLz47XG4gIH1cbn1cblxuLy88UGxheWVyIHN0b3JlPXtwc2lnblN0b3JlfS8+XG4iXX0=