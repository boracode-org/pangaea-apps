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
const document_1 = require("next/document");
const React = require("react");
const react_native_web_1 = require("react-native-web");
const Header_1 = require("../components/Header");
class MyDocument extends document_1.default {
    static getInitialProps({ renderPage, asPath }) {
        return __awaiter(this, void 0, void 0, function* () {
            react_native_web_1.AppRegistry.registerComponent("Main", () => document_1.Main);
            const { stylesheet } = react_native_web_1.AppRegistry.getApplication("Main");
            const page = renderPage();
            const styles = React.createElement("style", { dangerouslySetInnerHTML: { __html: stylesheet } });
            return Object.assign({}, page, { styles, asPath });
        });
    }
    render() {
        return (React.createElement("html", null,
            React.createElement("link", { rel: "stylesheet", href: "//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css" }),
            React.createElement(document_1.Head, null,
                React.createElement("title", null, "My page")),
            React.createElement("body", null,
                React.createElement(Header_1.Header, { url: this.props.asPath }),
                React.createElement(document_1.Main, null),
                React.createElement(document_1.NextScript, null))));
    }
}
exports.default = MyDocument;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2RvY3VtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiX2RvY3VtZW50LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsNENBQWlFO0FBQ2pFLCtCQUErQjtBQUMvQix1REFBK0M7QUFDL0MsaURBQThDO0FBRzlDLGdCQUFnQyxTQUFRLGtCQUFRO0lBQzlDLE1BQU0sQ0FBTyxlQUFlLENBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFOztZQUNqRCw4QkFBVyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxlQUFJLENBQUMsQ0FBQztZQUNsRCxNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsOEJBQVcsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDMUQsTUFBTSxJQUFJLEdBQUcsVUFBVSxFQUFFLENBQUM7WUFDMUIsTUFBTSxNQUFNLEdBQUcsK0JBQU8sdUJBQXVCLEVBQUUsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUksQ0FBQztZQUMxRSxNQUFNLG1CQUFNLElBQUksSUFBRSxNQUFNLEVBQUUsTUFBTSxJQUFHO1FBQ3JDLENBQUM7S0FBQTtJQUVELE1BQU07UUFDSixNQUFNLENBQUMsQ0FDTDtZQUNFLDhCQUNFLEdBQUcsRUFBQyxZQUFZLEVBQ2hCLElBQUksRUFBQyxxRUFBcUUsR0FDMUU7WUFDRixvQkFBQyxlQUFJO2dCQUNILDZDQUFzQixDQUNqQjtZQUNQO2dCQUNFLG9CQUFDLGVBQU0sSUFBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUk7Z0JBQ2xDLG9CQUFDLGVBQUksT0FBRztnQkFDUixvQkFBQyxxQkFBVSxPQUFHLENBQ1QsQ0FDRixDQUNSLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUEzQkQsNkJBMkJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERvY3VtZW50LCB7IEhlYWQsIE1haW4sIE5leHRTY3JpcHQgfSBmcm9tIFwibmV4dC9kb2N1bWVudFwiO1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBBcHBSZWdpc3RyeSB9IGZyb20gXCJyZWFjdC1uYXRpdmUtd2ViXCI7XG5pbXBvcnQgeyBIZWFkZXIgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9IZWFkZXJcIjtcbmltcG9ydCBSb3V0ZXIgZnJvbSBcIm5leHQvcm91dGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE15RG9jdW1lbnQgZXh0ZW5kcyBEb2N1bWVudCB7XG4gIHN0YXRpYyBhc3luYyBnZXRJbml0aWFsUHJvcHMoeyByZW5kZXJQYWdlLCBhc1BhdGggfSkge1xuICAgIEFwcFJlZ2lzdHJ5LnJlZ2lzdGVyQ29tcG9uZW50KFwiTWFpblwiLCAoKSA9PiBNYWluKTtcbiAgICBjb25zdCB7IHN0eWxlc2hlZXQgfSA9IEFwcFJlZ2lzdHJ5LmdldEFwcGxpY2F0aW9uKFwiTWFpblwiKTtcbiAgICBjb25zdCBwYWdlID0gcmVuZGVyUGFnZSgpO1xuICAgIGNvbnN0IHN0eWxlcyA9IDxzdHlsZSBkYW5nZXJvdXNseVNldElubmVySFRNTD17eyBfX2h0bWw6IHN0eWxlc2hlZXQgfX0gLz47XG4gICAgcmV0dXJuIHsgLi4ucGFnZSwgc3R5bGVzLCBhc1BhdGggfTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGh0bWw+XG4gICAgICAgIDxsaW5rXG4gICAgICAgICAgcmVsPVwic3R5bGVzaGVldFwiXG4gICAgICAgICAgaHJlZj1cIi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL3NlbWFudGljLXVpLzIuMy4zL3NlbWFudGljLm1pbi5jc3NcIlxuICAgICAgICAvPlxuICAgICAgICA8SGVhZD5cbiAgICAgICAgICA8dGl0bGU+TXkgcGFnZTwvdGl0bGU+XG4gICAgICAgIDwvSGVhZD5cbiAgICAgICAgPGJvZHk+XG4gICAgICAgICAgPEhlYWRlciB1cmw9e3RoaXMucHJvcHMuYXNQYXRofSAvPlxuICAgICAgICAgIDxNYWluIC8+XG4gICAgICAgICAgPE5leHRTY3JpcHQgLz5cbiAgICAgICAgPC9ib2R5PlxuICAgICAgPC9odG1sPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==