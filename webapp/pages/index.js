"use strict";
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
const Database_1 = require("../components/Database");
class Test extends React.Component {
    subscribe() {
        return __awaiter(this, void 0, void 0, function* () {
            var subscription = Database_1.Database.Subscribe('Settings');
            subscription.on('open', () => {
                console.log('subscription opened'); // <<---- THIS WORKS!!!!
            });
            subscription.on('update', (player) => {
                console.log(player); // <<---- NEVER TRIGGERED :(
            });
            subscription.on('enter', (object) => {
                console.log('object entered');
            });
            subscription.on('leave', (object) => {
                console.log('object left');
            });
            subscription.on('error', (error) => {
                console.log("error", error);
            });
            subscription.on('delete', (object) => {
                console.log('object deleted');
            });
            subscription.on('close', () => {
                console.log('subscription closed');
            });
            subscription.on('insert', (player) => {
                console.log(player); // <<---- NEVER TRIGGERED :(
            });
        });
    }
    componentDidMount() {
        this.subscribe();
    }
    render() {
        return (React.createElement(react_native_web_1.View, { style: {
                flex: 1,
                backgroundColor: "white",
                justifyContent: "center",
                alignItems: "center",
                height: "100%"
            } },
            React.createElement(react_native_web_1.Text, { style: { flex: 1, fontSize: 30, fontWeight: "bold" } }, "Welcome To Pangaea Media Manager")));
    }
}
exports.default = Test;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLCtCQUErQjtBQUUvQix1REFBOEM7QUFDOUMscURBQWtEO0FBSWxELFVBQTBCLFNBQVEsS0FBSyxDQUFDLFNBQW1CO0lBRW5ELFNBQVM7O1lBQ2IsSUFBSSxZQUFZLEdBQUcsbUJBQVEsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFbEQsWUFBWSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO2dCQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyx3QkFBd0I7WUFDaEUsQ0FBQyxDQUFDLENBQUM7WUFFSCxZQUFZLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsNEJBQTRCO1lBQ3JELENBQUMsQ0FBQyxDQUFDO1lBRUgsWUFBWSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ2hDLENBQUMsQ0FBQyxDQUFDO1lBRUgsWUFBWSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUM3QixDQUFDLENBQUMsQ0FBQztZQUVILFlBQVksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7Z0JBQ2pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FBQyxDQUFDO1lBRUgsWUFBWSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ2hDLENBQUMsQ0FBQyxDQUFDO1lBRUgsWUFBWSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO2dCQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFDckMsQ0FBQyxDQUFDLENBQUM7WUFFSCxZQUFZLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsNEJBQTRCO1lBQ3JELENBQUMsQ0FBQyxDQUFDO1FBRUwsQ0FBQztLQUFBO0lBRUQsaUJBQWlCO1FBQ2YsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFFRCxNQUFNO1FBQ0osTUFBTSxDQUFDLENBQ0wsb0JBQUMsdUJBQUksSUFDSCxLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFLENBQUM7Z0JBQ1AsZUFBZSxFQUFFLE9BQU87Z0JBQ3hCLGNBQWMsRUFBRSxRQUFRO2dCQUN4QixVQUFVLEVBQUUsUUFBUTtnQkFDcEIsTUFBTSxFQUFFLE1BQU07YUFDZjtZQUVELG9CQUFDLHVCQUFJLElBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsdUNBRW5ELENBQ0YsQ0FDUixDQUFDO0lBQ0osQ0FBQztDQUNGO0FBNURELHVCQTREQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IE15Q29tcG9uZW50IGZyb20gXCIuLi9jb21wb25lbnRzL015Q29tcG9uZW50XCI7XG5pbXBvcnQgeyBWaWV3LCBUZXh0IH0gZnJvbSBcInJlYWN0LW5hdGl2ZS13ZWJcIjtcbmltcG9ydCB7IERhdGFiYXNlIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvRGF0YWJhc2VcIjtcblxuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlc3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcblxuICBhc3luYyBzdWJzY3JpYmUoKSB7XG4gICAgdmFyIHN1YnNjcmlwdGlvbiA9IERhdGFiYXNlLlN1YnNjcmliZSgnU2V0dGluZ3MnKTtcbiAgIFxuICAgIHN1YnNjcmlwdGlvbi5vbignb3BlbicsICgpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ3N1YnNjcmlwdGlvbiBvcGVuZWQnKTsgLy8gPDwtLS0tIFRISVMgV09SS1MhISEhXG4gICAgfSk7XG4gICAgXG4gICAgc3Vic2NyaXB0aW9uLm9uKCd1cGRhdGUnLCAocGxheWVyKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKHBsYXllcik7IC8vIDw8LS0tLSBORVZFUiBUUklHR0VSRUQgOihcbiAgICB9KTtcbiAgICBcbiAgICBzdWJzY3JpcHRpb24ub24oJ2VudGVyJywgKG9iamVjdCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ29iamVjdCBlbnRlcmVkJyk7XG4gICAgfSk7XG5cbiAgICBzdWJzY3JpcHRpb24ub24oJ2xlYXZlJywgKG9iamVjdCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ29iamVjdCBsZWZ0Jyk7XG4gICAgfSk7XG5cbiAgICBzdWJzY3JpcHRpb24ub24oJ2Vycm9yJywgKGVycm9yKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcImVycm9yXCIsIGVycm9yKTtcbiAgICB9KTtcblxuICAgIHN1YnNjcmlwdGlvbi5vbignZGVsZXRlJywgKG9iamVjdCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ29iamVjdCBkZWxldGVkJyk7XG4gICAgfSk7XG5cbiAgICBzdWJzY3JpcHRpb24ub24oJ2Nsb3NlJywgKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ3N1YnNjcmlwdGlvbiBjbG9zZWQnKTtcbiAgICB9KTtcblxuICAgIHN1YnNjcmlwdGlvbi5vbignaW5zZXJ0JywgKHBsYXllcikgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhwbGF5ZXIpOyAvLyA8PC0tLS0gTkVWRVIgVFJJR0dFUkVEIDooXG4gICAgfSk7XG5cbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCl7XG4gICAgdGhpcy5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFZpZXdcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBmbGV4OiAxLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogXCJ3aGl0ZVwiLFxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxuICAgICAgICAgIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXG4gICAgICAgICAgaGVpZ2h0OiBcIjEwMCVcIlxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8VGV4dCBzdHlsZT17eyBmbGV4OiAxLCBmb250U2l6ZTogMzAsIGZvbnRXZWlnaHQ6IFwiYm9sZFwiIH19PlxuICAgICAgICAgIFdlbGNvbWUgVG8gUGFuZ2FlYSBNZWRpYSBNYW5hZ2VyXG4gICAgICAgIDwvVGV4dD5cbiAgICAgIDwvVmlldz5cbiAgICApO1xuICB9XG59XG4iXX0=