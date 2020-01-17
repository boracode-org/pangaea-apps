"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const app_1 = require("./app/app");
const Expo = require("expo");
// XMLHttpRequest = GLOBAL.originalXMLHttpRequest ?
//   GLOBAL.originalXMLHttpRequest : GLOBAL.XMLHttpRequest;
Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.LANDSCAPE);
class App extends React.Component {
    render() {
        return (<app_1.default />
        // <View style={styles.container}>
        //   <Text style={{ color: "blue", fontSize: 25 }}>
        //     Open up App.js to start working on your app!
        //   </Text>
        //   <Text>Changes you make will automatically reload.</Text>
        //   <Text>Shake your phone to open the developer menu.</Text>
        // </View>
        );
    }
}
exports.default = App;
// <PlayerApp/>
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center"
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQXBwLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUErQjtBQUMvQiwrQ0FBc0Q7QUFFdEQsbUNBQWtDO0FBQ2xDLDZCQUE2QjtBQUU3QixtREFBbUQ7QUFDbkQsMkRBQTJEO0FBRTNELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMzRSxNQUFxQixHQUFJLFNBQVEsS0FBSyxDQUFDLFNBQW1CO0lBQ3hELE1BQU07UUFDSixPQUFPLENBQ0wsQ0FBQyxhQUFTLENBQUMsQUFBRCxFQUFHO1FBQ2Isa0NBQWtDO1FBQ2xDLG1EQUFtRDtRQUNuRCxtREFBbUQ7UUFDbkQsWUFBWTtRQUNaLDZEQUE2RDtRQUM3RCw4REFBOEQ7UUFDOUQsVUFBVTtTQUNYLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUFiRCxzQkFhQztBQUNELGVBQWU7QUFDZixNQUFNLE1BQU0sR0FBRyx5QkFBVSxDQUFDLE1BQU0sQ0FBQztJQUMvQixTQUFTLEVBQUU7UUFDVCxJQUFJLEVBQUUsQ0FBQztRQUNQLGVBQWUsRUFBRSxPQUFPO1FBQ3hCLFVBQVUsRUFBRSxRQUFRO1FBQ3BCLGNBQWMsRUFBRSxRQUFRO0tBQ3pCO0NBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBTdHlsZVNoZWV0LCBUZXh0LCBWaWV3IH0gZnJvbSBcInJlYWN0LW5hdGl2ZVwiO1xuXG5pbXBvcnQgUGxheWVyQXBwIGZyb20gXCIuL2FwcC9hcHBcIjtcbmltcG9ydCAqIGFzIEV4cG8gZnJvbSBcImV4cG9cIjtcblxuLy8gWE1MSHR0cFJlcXVlc3QgPSBHTE9CQUwub3JpZ2luYWxYTUxIdHRwUmVxdWVzdCA/XG4vLyAgIEdMT0JBTC5vcmlnaW5hbFhNTEh0dHBSZXF1ZXN0IDogR0xPQkFMLlhNTEh0dHBSZXF1ZXN0O1xuXG5FeHBvLlNjcmVlbk9yaWVudGF0aW9uLmFsbG93KEV4cG8uU2NyZWVuT3JpZW50YXRpb24uT3JpZW50YXRpb24uTEFORFNDQVBFKTtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFwcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4ge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxQbGF5ZXJBcHAgLz5cbiAgICAgIC8vIDxWaWV3IHN0eWxlPXtzdHlsZXMuY29udGFpbmVyfT5cbiAgICAgIC8vICAgPFRleHQgc3R5bGU9e3sgY29sb3I6IFwiYmx1ZVwiLCBmb250U2l6ZTogMjUgfX0+XG4gICAgICAvLyAgICAgT3BlbiB1cCBBcHAuanMgdG8gc3RhcnQgd29ya2luZyBvbiB5b3VyIGFwcCFcbiAgICAgIC8vICAgPC9UZXh0PlxuICAgICAgLy8gICA8VGV4dD5DaGFuZ2VzIHlvdSBtYWtlIHdpbGwgYXV0b21hdGljYWxseSByZWxvYWQuPC9UZXh0PlxuICAgICAgLy8gICA8VGV4dD5TaGFrZSB5b3VyIHBob25lIHRvIG9wZW4gdGhlIGRldmVsb3BlciBtZW51LjwvVGV4dD5cbiAgICAgIC8vIDwvVmlldz5cbiAgICApO1xuICB9XG59XG4vLyA8UGxheWVyQXBwLz5cbmNvbnN0IHN0eWxlcyA9IFN0eWxlU2hlZXQuY3JlYXRlKHtcbiAgY29udGFpbmVyOiB7XG4gICAgZmxleDogMSxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFwid2hpdGVcIixcbiAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxuICAgIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiXG4gIH1cbn0pO1xuIl19