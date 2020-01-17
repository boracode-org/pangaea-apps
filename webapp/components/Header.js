"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const link_1 = require("next/link");
const react_native_web_1 = require("react-native-web");
const React = require("react");
const Database_1 = require("./Database");
exports.Header = ({ url }) => (React.createElement(react_native_web_1.View, { style: {
        flexDirection: "row",
        flex: 1,
        width: "100%",
        justifyContent: "space-between",
        backgroundColor: "lightgray",
        padding: 5
    } },
    React.createElement(react_native_web_1.Text, { style: {
            backgroundColor: "darkred",
            color: "white",
            fontSize: 20,
            padding: 4,
            borderRadius: 3,
            margin: 2
        } }, url.replace("/", "").toUpperCase() || "HOME"),
    React.createElement(react_native_web_1.View, { style: {
            flexDirection: "row",
            backgroundColor: "lightgray"
        } },
        !Database_1.Database.isLoggedIn ? (React.createElement(link_1.default, { href: "/login", prefetch: true },
            React.createElement("a", { style: {
                    backgroundColor: "yellow",
                    fontSize: 20,
                    padding: 4,
                    borderRadius: 3,
                    margin: 2
                } }, "LOGIN"))) : null,
        Database_1.Database.isLoggedIn ? (React.createElement(react_native_web_1.View, { style: { flex: 1, flexDirection: "row" } },
            React.createElement(link_1.default, { href: "/", prefetch: true },
                React.createElement("a", { style: {
                        backgroundColor: "white",
                        fontSize: 20,
                        padding: 4,
                        borderRadius: 3,
                        margin: 2
                    } }, "HOME")),
            React.createElement(link_1.default, { href: "/scheduler", prefetch: true },
                React.createElement("a", { style: {
                        backgroundColor: "white",
                        fontSize: 20,
                        padding: 4,
                        borderRadius: 3,
                        margin: 2
                    } }, "SCHED.")),
            React.createElement(link_1.default, { href: "/devices", prefetch: true },
                React.createElement("a", { style: {
                        backgroundColor: "white",
                        fontSize: 20,
                        padding: 4,
                        borderRadius: 3,
                        margin: 2
                    } }, "DEVICES")),
            React.createElement(link_1.default, { href: "/groups", prefetch: true },
                React.createElement("a", { style: {
                        backgroundColor: "white",
                        fontSize: 20,
                        padding: 4,
                        borderRadius: 3,
                        margin: 2
                    } }, "GROUPS")),
            React.createElement(link_1.default, { href: "/logout", prefetch: true },
                React.createElement("a", { style: {
                        backgroundColor: "orange",
                        fontSize: 20,
                        padding: 4,
                        borderRadius: 3,
                        margin: 2
                    } }, "LOGOUT")))) : null)));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiSGVhZGVyLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9DQUE2QjtBQUM3Qix1REFBa0U7QUFDbEUsK0JBQStCO0FBQy9CLHlDQUFzQztBQUV6QixRQUFBLE1BQU0sR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFtQixFQUFFLEVBQUUsQ0FBQyxDQUNsRCxvQkFBQyx1QkFBSSxJQUNILEtBQUssRUFBRTtRQUNMLGFBQWEsRUFBRSxLQUFLO1FBQ3BCLElBQUksRUFBRSxDQUFDO1FBQ1AsS0FBSyxFQUFFLE1BQU07UUFDYixjQUFjLEVBQUUsZUFBZTtRQUMvQixlQUFlLEVBQUUsV0FBVztRQUM1QixPQUFPLEVBQUUsQ0FBQztLQUNYO0lBRUQsb0JBQUMsdUJBQUksSUFDSCxLQUFLLEVBQUU7WUFDTCxlQUFlLEVBQUUsU0FBUztZQUMxQixLQUFLLEVBQUUsT0FBTztZQUNkLFFBQVEsRUFBRSxFQUFFO1lBQ1osT0FBTyxFQUFFLENBQUM7WUFDVixZQUFZLEVBQUUsQ0FBQztZQUNmLE1BQU0sRUFBRSxDQUFDO1NBQ1YsSUFFQSxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxNQUFNLENBQ3hDO0lBQ1Asb0JBQUMsdUJBQUksSUFDSCxLQUFLLEVBQUU7WUFDTCxhQUFhLEVBQUUsS0FBSztZQUNwQixlQUFlLEVBQUUsV0FBVztTQUM3QjtRQUVBLENBQUMsbUJBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQ3RCLG9CQUFDLGNBQUksSUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFDLFFBQVE7WUFDMUIsMkJBQ0UsS0FBSyxFQUFFO29CQUNMLGVBQWUsRUFBRSxRQUFRO29CQUN6QixRQUFRLEVBQUUsRUFBRTtvQkFDWixPQUFPLEVBQUUsQ0FBQztvQkFDVixZQUFZLEVBQUUsQ0FBQztvQkFDZixNQUFNLEVBQUUsQ0FBQztpQkFDVixZQUdDLENBQ0MsQ0FDUixDQUFDLENBQUMsQ0FBQyxJQUFJO1FBQ1AsbUJBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQ3JCLG9CQUFDLHVCQUFJLElBQUMsS0FBSyxFQUFFLEVBQUMsSUFBSSxFQUFDLENBQUMsRUFBRSxhQUFhLEVBQUMsS0FBSyxFQUFDO1lBQ3hDLG9CQUFDLGNBQUksSUFBQyxJQUFJLEVBQUMsR0FBRyxFQUFDLFFBQVE7Z0JBQ3JCLDJCQUNFLEtBQUssRUFBRTt3QkFDTCxlQUFlLEVBQUUsT0FBTzt3QkFDeEIsUUFBUSxFQUFFLEVBQUU7d0JBQ1osT0FBTyxFQUFFLENBQUM7d0JBQ1YsWUFBWSxFQUFFLENBQUM7d0JBQ2YsTUFBTSxFQUFFLENBQUM7cUJBQ1YsV0FHQyxDQUNDO1lBQ1Asb0JBQUMsY0FBSSxJQUFDLElBQUksRUFBQyxZQUFZLEVBQUMsUUFBUTtnQkFDOUIsMkJBQ0UsS0FBSyxFQUFFO3dCQUNMLGVBQWUsRUFBRSxPQUFPO3dCQUN4QixRQUFRLEVBQUUsRUFBRTt3QkFDWixPQUFPLEVBQUUsQ0FBQzt3QkFDVixZQUFZLEVBQUUsQ0FBQzt3QkFDZixNQUFNLEVBQUUsQ0FBQztxQkFDVixhQUdDLENBQ0M7WUFDUCxvQkFBQyxjQUFJLElBQUMsSUFBSSxFQUFDLFVBQVUsRUFBQyxRQUFRO2dCQUM1QiwyQkFDRSxLQUFLLEVBQUU7d0JBQ0wsZUFBZSxFQUFFLE9BQU87d0JBQ3hCLFFBQVEsRUFBRSxFQUFFO3dCQUNaLE9BQU8sRUFBRSxDQUFDO3dCQUNWLFlBQVksRUFBRSxDQUFDO3dCQUNmLE1BQU0sRUFBRSxDQUFDO3FCQUNWLGNBR0MsQ0FDQztZQUNQLG9CQUFDLGNBQUksSUFBQyxJQUFJLEVBQUMsU0FBUyxFQUFDLFFBQVE7Z0JBQzNCLDJCQUNFLEtBQUssRUFBRTt3QkFDTCxlQUFlLEVBQUUsT0FBTzt3QkFDeEIsUUFBUSxFQUFFLEVBQUU7d0JBQ1osT0FBTyxFQUFFLENBQUM7d0JBQ1YsWUFBWSxFQUFFLENBQUM7d0JBQ2YsTUFBTSxFQUFFLENBQUM7cUJBQ1YsYUFHQyxDQUNDO1lBQ1Asb0JBQUMsY0FBSSxJQUFDLElBQUksRUFBQyxTQUFTLEVBQUMsUUFBUTtnQkFDM0IsMkJBQ0UsS0FBSyxFQUFFO3dCQUNMLGVBQWUsRUFBRSxRQUFRO3dCQUN6QixRQUFRLEVBQUUsRUFBRTt3QkFDWixPQUFPLEVBQUUsQ0FBQzt3QkFDVixZQUFZLEVBQUUsQ0FBQzt3QkFDZixNQUFNLEVBQUUsQ0FBQztxQkFDVixhQUdDLENBQ0MsQ0FDRixDQUNSLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDSCxDQUNGLENBQ1IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMaW5rIGZyb20gXCJuZXh0L2xpbmtcIjtcbmltcG9ydCB7IFZpZXcsIFRleHQsIEJ1dHRvbiwgU2Nyb2xsVmlldyB9IGZyb20gXCJyZWFjdC1uYXRpdmUtd2ViXCI7XG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IERhdGFiYXNlIH0gZnJvbSBcIi4vRGF0YWJhc2VcIjtcblxuZXhwb3J0IGNvbnN0IEhlYWRlciA9ICh7IHVybCB9OiB7IHVybDogc3RyaW5nIH0pID0+IChcbiAgPFZpZXdcbiAgICBzdHlsZT17e1xuICAgICAgZmxleERpcmVjdGlvbjogXCJyb3dcIixcbiAgICAgIGZsZXg6IDEsXG4gICAgICB3aWR0aDogXCIxMDAlXCIsXG4gICAgICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwibGlnaHRncmF5XCIsXG4gICAgICBwYWRkaW5nOiA1XG4gICAgfX1cbiAgPlxuICAgIDxUZXh0XG4gICAgICBzdHlsZT17e1xuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiZGFya3JlZFwiLFxuICAgICAgICBjb2xvcjogXCJ3aGl0ZVwiLFxuICAgICAgICBmb250U2l6ZTogMjAsXG4gICAgICAgIHBhZGRpbmc6IDQsXG4gICAgICAgIGJvcmRlclJhZGl1czogMyxcbiAgICAgICAgbWFyZ2luOiAyXG4gICAgICB9fVxuICAgID5cbiAgICAgIHt1cmwucmVwbGFjZShcIi9cIiwgXCJcIikudG9VcHBlckNhc2UoKSB8fCBcIkhPTUVcIn1cbiAgICA8L1RleHQ+XG4gICAgPFZpZXdcbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIGZsZXhEaXJlY3Rpb246IFwicm93XCIsXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogXCJsaWdodGdyYXlcIlxuICAgICAgfX1cbiAgICA+XG4gICAgICB7IURhdGFiYXNlLmlzTG9nZ2VkSW4gPyAoXG4gICAgICAgIDxMaW5rIGhyZWY9XCIvbG9naW5cIiBwcmVmZXRjaD5cbiAgICAgICAgICA8YVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcInllbGxvd1wiLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMjAsXG4gICAgICAgICAgICAgIHBhZGRpbmc6IDQsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogMyxcbiAgICAgICAgICAgICAgbWFyZ2luOiAyXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIExPR0lOXG4gICAgICAgICAgPC9hPlxuICAgICAgICA8L0xpbms+XG4gICAgICApIDogbnVsbH1cbiAgICAgIHtEYXRhYmFzZS5pc0xvZ2dlZEluID8gKFxuICAgICAgICA8VmlldyBzdHlsZT17e2ZsZXg6MSwgZmxleERpcmVjdGlvbjpcInJvd1wifX0+XG4gICAgICAgICAgPExpbmsgaHJlZj1cIi9cIiBwcmVmZXRjaD5cbiAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcIndoaXRlXCIsXG4gICAgICAgICAgICAgICAgZm9udFNpemU6IDIwLFxuICAgICAgICAgICAgICAgIHBhZGRpbmc6IDQsXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAzLFxuICAgICAgICAgICAgICAgIG1hcmdpbjogMlxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBIT01FXG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgIDxMaW5rIGhyZWY9XCIvc2NoZWR1bGVyXCIgcHJlZmV0Y2g+XG4gICAgICAgICAgICA8YVxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogXCJ3aGl0ZVwiLFxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiAyMCxcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiA0LFxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogMyxcbiAgICAgICAgICAgICAgICBtYXJnaW46IDJcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgU0NIRUQuXG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgIDxMaW5rIGhyZWY9XCIvZGV2aWNlc1wiIHByZWZldGNoPlxuICAgICAgICAgICAgPGFcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwid2hpdGVcIixcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogMjAsXG4gICAgICAgICAgICAgICAgcGFkZGluZzogNCxcbiAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDMsXG4gICAgICAgICAgICAgICAgbWFyZ2luOiAyXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIERFVklDRVNcbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgPExpbmsgaHJlZj1cIi9ncm91cHNcIiBwcmVmZXRjaD5cbiAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcIndoaXRlXCIsXG4gICAgICAgICAgICAgICAgZm9udFNpemU6IDIwLFxuICAgICAgICAgICAgICAgIHBhZGRpbmc6IDQsXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAzLFxuICAgICAgICAgICAgICAgIG1hcmdpbjogMlxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBHUk9VUFNcbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgPExpbmsgaHJlZj1cIi9sb2dvdXRcIiBwcmVmZXRjaD5cbiAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcIm9yYW5nZVwiLFxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiAyMCxcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiA0LFxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogMyxcbiAgICAgICAgICAgICAgICBtYXJnaW46IDJcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgTE9HT1VUXG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICAgPC9MaW5rPlxuICAgICAgICA8L1ZpZXc+XG4gICAgICApIDogbnVsbH1cbiAgICA8L1ZpZXc+XG4gIDwvVmlldz5cbik7XG4iXX0=