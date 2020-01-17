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
const react_edit_inline_1 = require("../libs/react-edit-inline");
// import Box, { ScrollView, Page, Container } from "react-layout-components"; // https://github.com/rofrischmann/react-layout-components/issues/27
const react_dropzone_component_1 = require("react-dropzone-component");
const Constants_1 = require("../Constants");
var ReactDOMServer = require("react-dom/server");
const react_native_web_1 = require("react-native-web");
const Database_1 = require("../Database");
var componentConfig = {
    iconFiletypes: [".mp4"],
    showFiletypeIcon: true,
    postUrl: Constants_1.default.SERVER_URL + "/upload"
    // previewTemplate: ReactDOMServer.renderToStaticMarkup(<div/>)
    //   <div className="dz-preview dz-file-preview">
    //     <div className="dz-details">
    //       <div className="dz-filename">
    //         <span data-dz-name="true" />
    //       </div>
    //       <img data-dz-thumbnail="true" />
    //     </div>
    //     <div className="dz-progress">
    //       <span className="dz-upload" data-dz-uploadprogress="true" />
    //     </div>
    //     <div className="dz-success-mark">
    //       <span>✔</span>
    //     </div>
    //     <div className="dz-error-mark">
    //       <span>✘</span>
    //     </div>
    //     <div className="dz-error-message">
    //       <span data-dz-errormessage="true" />
    //     </div>
    //   </div>
    // )
};
// idea, add two playlist items  at each tick, placing default item when there is nothing to display the beginning
class Gallery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            galleryItems: [],
            playlist: {},
            loading: false
        };
        this.updateVideoList = () => __awaiter(this, void 0, void 0, function* () {
            this.setState({ loading: true });
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                var ext = "";
                if (this.props.types) {
                    ext = "?extensions=" + this.props.types;
                }
                // var galleryItems = await fetch(Constants.SERVER_URL + "/gallery" + ext).then(response => {
                //   console.log({ response });
                //   return response.json();
                // });
                var galleryItems = yield Database_1.Database.getGalleryItems();
                console.log({ galleryItems });
                console.log("/gallery", galleryItems);
                this.setState({ galleryItems, loading: false });
            }), 300);
        });
        this.changeName = (item, valueMessage) => __awaiter(this, void 0, void 0, function* () {
            var value = valueMessage["message"];
            console.log("changeName", {
                item,
                valueMessage,
                value,
                galleryItems: this.state.galleryItems
            });
            var vidIndex = this.state.galleryItems.findIndex((k, i, arr) => k.name == item.name);
            console.log("changeName", { item, vidIndex });
            yield Database_1.Database.changeMediaTitle(item, value);
            this.updateVideoList();
            // fetch(Constants.SERVER_URL + "/changeName" + "?oldName=" + item.name + "&newName=" + value)
            //   .then(response => {
            //     return response.json();
            //   })
            //   .then(items => {
            //     console.log("/gallery", items);
            //     this.setState({ galleryItems: items });
            //   })
            //   .catch(e => {});
        });
        this.eventHandlers = {
            addedfile: (file) => __awaiter(this, void 0, void 0, function* () {
                //console.log(file);
                try {
                    yield Database_1.Database.addMedia(file);
                    var newPlaylist = this.state.playlist;
                    var videourl = "/upload?filename=" + file.name;
                    newPlaylist = [videourl];
                    // this.setState({ playlist: newPlaylist });
                    // this.setState({ start: new Date(), videourl: videourl, playlist: newPlaylist, currentVideo: videourl });
                    // this.refs.video.load();
                    // this.refs.video.play();
                    // this.setState({})
                    this.updateVideoList();
                }
                catch (e) {
                    alert("Attempted to upload invalid file");
                }
            }),
            complete: file => {
                var uploadfilename = file.name; // JSON.parse(file.xhr.response).name;
                console.log("DropzoneComponent complete", uploadfilename);
                var newPlaylist = this.state.playlist;
                var videourl = "/upload?filename=" + uploadfilename;
                newPlaylist = [videourl];
                // this.setState({ playlist: newPlaylist });
                // this.setState({ start: new Date(), videourl: videourl, playlist: newPlaylist, currentVideo: videourl });
                // this.refs.video.load();
                // this.refs.video.play();
                // this.setState({})
                this.updateVideoList();
            }
        };
        this.changeName = this.changeName.bind(this);
        this.deleteVideo = this.deleteVideo.bind(this);
    }
    componentDidMount() {
        this.updateVideoList();
        // componentDidMount is called by react when the component
        // has been rendered on the page. We can set the interval here:
    }
    componentWillUnmount() { }
    deleteVideo(item) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("delete", { item });
            try {
                yield Database_1.Database.deleteMedia(item.objectId);
                alert("Successfully deleted Media: " + item.title);
                this.updateVideoList();
            }
            catch (e) {
                alert("Failed to delete media: " + e.message);
            }
            // fetch(Constants.SERVER_URL + "/deleteVideo" + "?name=" + item.name)
            //   .then(response => {
            //     return response.json();
            //   })
            //   .then(items => {
            //     console.log("/gallery", items);
            //     this.setState({ galleryItems: items });
            //   })
            //   .catch(e => {});
        });
    }
    render() {
        return (React.createElement(react_native_web_1.View, { style: {
                backgroundColor: "white",
                flex: 1,
                width: "100%",
                padding: 5,
                borderRadius: 5
            } },
            React.createElement(react_native_web_1.View, { style: {
                    flexDirection: "row",
                    width: "100%",
                    flex: 1,
                    backgroundColor: "lightgray",
                    justifyContent: "space-between",
                    marginBottom: 10,
                    padding: 5
                } },
                React.createElement(react_native_web_1.Text, { style: {
                        color: "black",
                        height: 40,
                        fontWeight: "bold",
                        fontSize: 20,
                        textAlign: "center",
                        verticalAlign: "center",
                        paddingTop: 10
                    } }, `Gallery`.toUpperCase()),
                React.createElement(react_native_web_1.View, { style: { margin: 5 } },
                    React.createElement(react_native_web_1.Button, { title: "Close", onPress: this.props.closeModal }))),
            React.createElement(react_native_web_1.ScrollView, { style: { height: 500, backgroundColor: "#FAFAFA" } },
                React.createElement(react_native_web_1.View, null),
                React.createElement(react_native_web_1.View, { borderWidth: "10", borderColor: "red", borderTop: true, borderRight: true, padding: "10" },
                    React.createElement(react_native_web_1.View, { style: {
                            flex: 1,
                            flexWrap: "wrap",
                            flexDirection: "row",
                            justifyContent: "flex-start"
                        } },
                        this.state.loading ? (React.createElement(react_native_web_1.Text, { style: {
                                flex: 1,
                                justifyContent: "center",
                                verticalAlign: "center",
                                textAlign: "center",
                                alignContent: "center"
                            } }, "Loading Gallery ... please wait...")) : null,
                        this.state.galleryItems.length > 0 ? (this.state.galleryItems.map((k, i) => (React.createElement(react_native_web_1.View, { key: i, column: true, style: {
                                width: 150,
                                backgroundColor: "lightgrey",
                                marginBottom: 10,
                                marginRight: 10,
                                padding: 5
                            }, onClick: () => {
                                if (this.props.onSelect) {
                                    this.props.onSelect(this.state.galleryItems[i]);
                                }
                            } },
                            React.createElement(react_native_web_1.View, { flex: "5" },
                                React.createElement("img", { src: k.video_thumbnail
                                        ? k.video_thumbnail.url
                                        : "" /*Constants.SERVER_URL + "/upload/?filename=" + k.thumbnail*/, width: "140", height: "100" })),
                            React.createElement(react_native_web_1.View, { flex: "1", style: {
                                    backgroundColor: "white",
                                    fontSize: 10,
                                    wordWrap: "break-word"
                                } },
                                React.createElement("b", null, "Type - Size: \u00A0 \u00A0 "),
                                React.createElement(react_native_web_1.Text, null,
                                    k.type,
                                    " - ",
                                    k.video_size)),
                            React.createElement(react_native_web_1.View, { flex: "2", style: {
                                    backgroundColor: "white",
                                    fontSize: 10,
                                    wordWrap: "break-word",
                                    width: "100%"
                                } },
                                React.createElement("b", null, "Filename: \u00A0 \u00A0 "),
                                React.createElement(react_edit_inline_1.default, { activeClassName: "editing", text: k.title, paramName: "message", onSelect: () => { }, change: e => {
                                        this.changeName(k, e);
                                    }, style: {
                                        backgroundColor: "gray",
                                        color: "white",
                                        // minWidth: 150,
                                        display: "inline-block",
                                        margin: 0,
                                        padding: 10,
                                        fontSize: 15,
                                        outline: 0,
                                        border: 0
                                    } })),
                            React.createElement(react_native_web_1.View, { flex: "1", style: {
                                    backgroundColor: "white",
                                    fontSize: 10,
                                    wordWrap: "break-word",
                                    width: "100%"
                                } },
                                React.createElement(react_native_web_1.Button, { title: "Delete", color: "red", style: { left: 20 }, onPress: () => this.deleteVideo(k) })))))) : (React.createElement(react_native_web_1.Text, null, "Sorry there are no items in your gallery, add some below"))))),
            React.createElement(react_native_web_1.View, { style: {
                    margin: 5,
                    height: 200,
                    border: "1px solid gray",
                    padding: 5,
                    backgroundColor: "lightgray"
                } },
                React.createElement(react_dropzone_component_1.default, { djsConfig: {
                        autoProcessQueue: false,
                        previewTemplate: ReactDOMServer.renderToStaticMarkup(React.createElement("div", null))
                    }, config: componentConfig, eventHandlers: this.eventHandlers })),
            React.createElement(react_native_web_1.Button, { title: "Close", onPress: this.props.closeModal, style: { margin: 5 } })));
    }
}
exports.default = Gallery;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2FsbGVyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkdhbGxlcnkudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSwrQkFBK0I7QUFjL0IsaUVBQW1EO0FBQ25ELG1KQUFtSjtBQUNuSix1RUFBeUQ7QUFDekQsNENBQXFDO0FBQ3JDLElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBR2pELHVEQUFrRTtBQUNsRSwwQ0FBdUM7QUFFdkMsSUFBSSxlQUFlLEdBQUc7SUFDcEIsYUFBYSxFQUFFLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLGdCQUFnQixFQUFFLElBQUk7SUFDdEIsT0FBTyxFQUFFLG1CQUFTLENBQUMsVUFBVSxHQUFHLFNBQVM7SUFDekMsK0RBQStEO0lBQy9ELGlEQUFpRDtJQUNqRCxtQ0FBbUM7SUFDbkMsc0NBQXNDO0lBQ3RDLHVDQUF1QztJQUN2QyxlQUFlO0lBQ2YseUNBQXlDO0lBQ3pDLGFBQWE7SUFDYixvQ0FBb0M7SUFDcEMscUVBQXFFO0lBQ3JFLGFBQWE7SUFDYix3Q0FBd0M7SUFDeEMsdUJBQXVCO0lBQ3ZCLGFBQWE7SUFDYixzQ0FBc0M7SUFDdEMsdUJBQXVCO0lBQ3ZCLGFBQWE7SUFDYix5Q0FBeUM7SUFDekMsNkNBQTZDO0lBQzdDLGFBQWE7SUFDYixXQUFXO0lBQ1gsSUFBSTtDQUNMLENBQUM7QUFFRixrSEFBa0g7QUFFbEgsYUFBYyxTQUFRLEtBQUssQ0FBQyxTQUFtQjtJQVc3QyxZQUFZLEtBQUs7UUFDZixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFQZixVQUFLLEdBQUc7WUFDTixZQUFZLEVBQUUsRUFBRTtZQUNoQixRQUFRLEVBQUUsRUFBRTtZQUNaLE9BQU8sRUFBRSxLQUFLO1NBQ2YsQ0FBQztRQTBDRixvQkFBZSxHQUFHLEdBQVMsRUFBRTtZQUMzQixJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7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dkIsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLEdBQ2pDLENBQ0c7WUFDUCxvQkFBQyx5QkFBTSxJQUNMLEtBQUssRUFBQyxPQUFPLEVBQ2IsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUM5QixLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQ3BCLENBQ0csQ0FDUixDQUFDO0lBQ0osQ0FBQztDQUNGO0FBRUQsa0JBQWUsT0FBTyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwicmVhY3RcIjtcblxuaW1wb3J0ICogYXMgbW9tZW50IGZyb20gXCJtb21lbnRcIjtcbmltcG9ydCB7XG4gIGRlZmF1bHQgYXMgVmlkZW8sXG4gIENvbnRyb2xzLFxuICBQbGF5LFxuICBNdXRlLFxuICBTZWVrLFxuICBGdWxsc2NyZWVuLFxuICBUaW1lLFxuICBPdmVybGF5XG59IGZyb20gXCJyZWFjdC1odG1sNXZpZGVvXCI7XG5pbXBvcnQgSW5saW5lRWRpdCBmcm9tIFwiLi4vbGlicy9yZWFjdC1lZGl0LWlubGluZVwiO1xuLy8gaW1wb3J0IEJveCwgeyBTY3JvbGxWaWV3LCBQYWdlLCBDb250YWluZXIgfSBmcm9tIFwicmVhY3QtbGF5b3V0LWNvbXBvbmVudHNcIjsgLy8gaHR0cHM6Ly9naXRodWIuY29tL3JvZnJpc2NobWFubi9yZWFjdC1sYXlvdXQtY29tcG9uZW50cy9pc3N1ZXMvMjdcbmltcG9ydCBEcm9wem9uZUNvbXBvbmVudCBmcm9tIFwicmVhY3QtZHJvcHpvbmUtY29tcG9uZW50XCI7XG5pbXBvcnQgQ29uc3RhbnRzIGZyb20gXCIuLi9Db25zdGFudHNcIjtcbnZhciBSZWFjdERPTVNlcnZlciA9IHJlcXVpcmUoXCJyZWFjdC1kb20vc2VydmVyXCIpO1xuaW1wb3J0ICogYXMgXyBmcm9tIFwibG9kYXNoXCI7XG5cbmltcG9ydCB7IFZpZXcsIFRleHQsIEJ1dHRvbiwgU2Nyb2xsVmlldyB9IGZyb20gXCJyZWFjdC1uYXRpdmUtd2ViXCI7XG5pbXBvcnQgeyBEYXRhYmFzZSB9IGZyb20gXCIuLi9EYXRhYmFzZVwiO1xuXG52YXIgY29tcG9uZW50Q29uZmlnID0ge1xuICBpY29uRmlsZXR5cGVzOiBbXCIubXA0XCJdLCAvLycuanBnJywgJy5wbmcnLCAnLmdpZicsXG4gIHNob3dGaWxldHlwZUljb246IHRydWUsXG4gIHBvc3RVcmw6IENvbnN0YW50cy5TRVJWRVJfVVJMICsgXCIvdXBsb2FkXCJcbiAgLy8gcHJldmlld1RlbXBsYXRlOiBSZWFjdERPTVNlcnZlci5yZW5kZXJUb1N0YXRpY01hcmt1cCg8ZGl2Lz4pXG4gIC8vICAgPGRpdiBjbGFzc05hbWU9XCJkei1wcmV2aWV3IGR6LWZpbGUtcHJldmlld1wiPlxuICAvLyAgICAgPGRpdiBjbGFzc05hbWU9XCJkei1kZXRhaWxzXCI+XG4gIC8vICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZHotZmlsZW5hbWVcIj5cbiAgLy8gICAgICAgICA8c3BhbiBkYXRhLWR6LW5hbWU9XCJ0cnVlXCIgLz5cbiAgLy8gICAgICAgPC9kaXY+XG4gIC8vICAgICAgIDxpbWcgZGF0YS1kei10aHVtYm5haWw9XCJ0cnVlXCIgLz5cbiAgLy8gICAgIDwvZGl2PlxuICAvLyAgICAgPGRpdiBjbGFzc05hbWU9XCJkei1wcm9ncmVzc1wiPlxuICAvLyAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJkei11cGxvYWRcIiBkYXRhLWR6LXVwbG9hZHByb2dyZXNzPVwidHJ1ZVwiIC8+XG4gIC8vICAgICA8L2Rpdj5cbiAgLy8gICAgIDxkaXYgY2xhc3NOYW1lPVwiZHotc3VjY2Vzcy1tYXJrXCI+XG4gIC8vICAgICAgIDxzcGFuPuKclDwvc3Bhbj5cbiAgLy8gICAgIDwvZGl2PlxuICAvLyAgICAgPGRpdiBjbGFzc05hbWU9XCJkei1lcnJvci1tYXJrXCI+XG4gIC8vICAgICAgIDxzcGFuPuKcmDwvc3Bhbj5cbiAgLy8gICAgIDwvZGl2PlxuICAvLyAgICAgPGRpdiBjbGFzc05hbWU9XCJkei1lcnJvci1tZXNzYWdlXCI+XG4gIC8vICAgICAgIDxzcGFuIGRhdGEtZHotZXJyb3JtZXNzYWdlPVwidHJ1ZVwiIC8+XG4gIC8vICAgICA8L2Rpdj5cbiAgLy8gICA8L2Rpdj5cbiAgLy8gKVxufTtcblxuLy8gaWRlYSwgYWRkIHR3byBwbGF5bGlzdCBpdGVtcyAgYXQgZWFjaCB0aWNrLCBwbGFjaW5nIGRlZmF1bHQgaXRlbSB3aGVuIHRoZXJlIGlzIG5vdGhpbmcgdG8gZGlzcGxheSB0aGUgYmVnaW5uaW5nXG5cbmNsYXNzIEdhbGxlcnkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcbiAgZXZlbnRIYW5kbGVyczoge1xuICAgIGFkZGVkZmlsZTogKGZpbGU6IGFueSkgPT4gdm9pZDtcbiAgICBjb21wbGV0ZTogKGZpbGU6IGFueSkgPT4gdm9pZDtcbiAgfTtcbiAgc3RhdGUgPSB7XG4gICAgZ2FsbGVyeUl0ZW1zOiBbXSxcbiAgICBwbGF5bGlzdDoge30sXG4gICAgbG9hZGluZzogZmFsc2VcbiAgfTtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuZXZlbnRIYW5kbGVycyA9IHtcbiAgICAgIGFkZGVkZmlsZTogYXN5bmMgZmlsZSA9PiB7XG4gICAgICAgIC8vY29uc29sZS5sb2coZmlsZSk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYXdhaXQgRGF0YWJhc2UuYWRkTWVkaWEoZmlsZSk7XG4gICAgICAgICAgdmFyIG5ld1BsYXlsaXN0ID0gdGhpcy5zdGF0ZS5wbGF5bGlzdDtcbiAgICAgICAgICB2YXIgdmlkZW91cmwgPSBcIi91cGxvYWQ/ZmlsZW5hbWU9XCIgKyBmaWxlLm5hbWU7XG4gICAgICAgICAgbmV3UGxheWxpc3QgPSBbdmlkZW91cmxdO1xuICAgICAgICAgIC8vIHRoaXMuc2V0U3RhdGUoeyBwbGF5bGlzdDogbmV3UGxheWxpc3QgfSk7XG4gICAgICAgICAgLy8gdGhpcy5zZXRTdGF0ZSh7IHN0YXJ0OiBuZXcgRGF0ZSgpLCB2aWRlb3VybDogdmlkZW91cmwsIHBsYXlsaXN0OiBuZXdQbGF5bGlzdCwgY3VycmVudFZpZGVvOiB2aWRlb3VybCB9KTtcbiAgICAgICAgICAvLyB0aGlzLnJlZnMudmlkZW8ubG9hZCgpO1xuICAgICAgICAgIC8vIHRoaXMucmVmcy52aWRlby5wbGF5KCk7XG4gICAgICAgICAgLy8gdGhpcy5zZXRTdGF0ZSh7fSlcblxuICAgICAgICAgIHRoaXMudXBkYXRlVmlkZW9MaXN0KCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBhbGVydChcIkF0dGVtcHRlZCB0byB1cGxvYWQgaW52YWxpZCBmaWxlXCIpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgY29tcGxldGU6IGZpbGUgPT4ge1xuICAgICAgICB2YXIgdXBsb2FkZmlsZW5hbWUgPSBmaWxlLm5hbWU7IC8vIEpTT04ucGFyc2UoZmlsZS54aHIucmVzcG9uc2UpLm5hbWU7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRHJvcHpvbmVDb21wb25lbnQgY29tcGxldGVcIiwgdXBsb2FkZmlsZW5hbWUpO1xuICAgICAgICB2YXIgbmV3UGxheWxpc3QgPSB0aGlzLnN0YXRlLnBsYXlsaXN0O1xuICAgICAgICB2YXIgdmlkZW91cmwgPSBcIi91cGxvYWQ/ZmlsZW5hbWU9XCIgKyB1cGxvYWRmaWxlbmFtZTtcbiAgICAgICAgbmV3UGxheWxpc3QgPSBbdmlkZW91cmxdO1xuICAgICAgICAvLyB0aGlzLnNldFN0YXRlKHsgcGxheWxpc3Q6IG5ld1BsYXlsaXN0IH0pO1xuICAgICAgICAvLyB0aGlzLnNldFN0YXRlKHsgc3RhcnQ6IG5ldyBEYXRlKCksIHZpZGVvdXJsOiB2aWRlb3VybCwgcGxheWxpc3Q6IG5ld1BsYXlsaXN0LCBjdXJyZW50VmlkZW86IHZpZGVvdXJsIH0pO1xuICAgICAgICAvLyB0aGlzLnJlZnMudmlkZW8ubG9hZCgpO1xuICAgICAgICAvLyB0aGlzLnJlZnMudmlkZW8ucGxheSgpO1xuICAgICAgICAvLyB0aGlzLnNldFN0YXRlKHt9KVxuICAgICAgICB0aGlzLnVwZGF0ZVZpZGVvTGlzdCgpO1xuICAgICAgfVxuICAgIH07XG4gICAgdGhpcy5jaGFuZ2VOYW1lID0gdGhpcy5jaGFuZ2VOYW1lLmJpbmQodGhpcyk7XG4gICAgdGhpcy5kZWxldGVWaWRlbyA9IHRoaXMuZGVsZXRlVmlkZW8uYmluZCh0aGlzKTtcbiAgfVxuXG4gIHVwZGF0ZVZpZGVvTGlzdCA9IGFzeW5jICgpID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHsgbG9hZGluZzogdHJ1ZSB9KTtcbiAgICBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcbiAgICAgIHZhciBleHQgPSBcIlwiO1xuICAgICAgaWYgKHRoaXMucHJvcHMudHlwZXMpIHtcbiAgICAgICAgZXh0ID0gXCI/ZXh0ZW5zaW9ucz1cIiArIHRoaXMucHJvcHMudHlwZXM7XG4gICAgICB9XG4gICAgICAvLyB2YXIgZ2FsbGVyeUl0ZW1zID0gYXdhaXQgZmV0Y2goQ29uc3RhbnRzLlNFUlZFUl9VUkwgKyBcIi9nYWxsZXJ5XCIgKyBleHQpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgLy8gICBjb25zb2xlLmxvZyh7IHJlc3BvbnNlIH0pO1xuICAgICAgLy8gICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgLy8gfSk7XG4gICAgICB2YXIgZ2FsbGVyeUl0ZW1zID0gYXdhaXQgRGF0YWJhc2UuZ2V0R2FsbGVyeUl0ZW1zKCk7XG4gICAgICBjb25zb2xlLmxvZyh7IGdhbGxlcnlJdGVtcyB9KTtcblxuICAgICAgY29uc29sZS5sb2coXCIvZ2FsbGVyeVwiLCBnYWxsZXJ5SXRlbXMpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGdhbGxlcnlJdGVtcywgbG9hZGluZzogZmFsc2UgfSk7XG4gICAgfSwgMzAwKTtcbiAgfTtcblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnVwZGF0ZVZpZGVvTGlzdCgpO1xuICAgIC8vIGNvbXBvbmVudERpZE1vdW50IGlzIGNhbGxlZCBieSByZWFjdCB3aGVuIHRoZSBjb21wb25lbnRcbiAgICAvLyBoYXMgYmVlbiByZW5kZXJlZCBvbiB0aGUgcGFnZS4gV2UgY2FuIHNldCB0aGUgaW50ZXJ2YWwgaGVyZTpcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge31cblxuICBjaGFuZ2VOYW1lID0gYXN5bmMgKGl0ZW0sIHZhbHVlTWVzc2FnZSkgPT4ge1xuICAgIHZhciB2YWx1ZSA9IHZhbHVlTWVzc2FnZVtcIm1lc3NhZ2VcIl07XG4gICAgY29uc29sZS5sb2coXCJjaGFuZ2VOYW1lXCIsIHtcbiAgICAgIGl0ZW0sXG4gICAgICB2YWx1ZU1lc3NhZ2UsXG4gICAgICB2YWx1ZSxcbiAgICAgIGdhbGxlcnlJdGVtczogdGhpcy5zdGF0ZS5nYWxsZXJ5SXRlbXNcbiAgICB9KTtcbiAgICB2YXIgdmlkSW5kZXggPSB0aGlzLnN0YXRlLmdhbGxlcnlJdGVtcy5maW5kSW5kZXgoXG4gICAgICAoaywgaSwgYXJyKSA9PiBrLm5hbWUgPT0gaXRlbS5uYW1lXG4gICAgKTtcbiAgICBjb25zb2xlLmxvZyhcImNoYW5nZU5hbWVcIiwgeyBpdGVtLCB2aWRJbmRleCB9KTtcblxuICAgIGF3YWl0IERhdGFiYXNlLmNoYW5nZU1lZGlhVGl0bGUoaXRlbSwgdmFsdWUpO1xuXG4gICAgdGhpcy51cGRhdGVWaWRlb0xpc3QoKTtcblxuICAgIC8vIGZldGNoKENvbnN0YW50cy5TRVJWRVJfVVJMICsgXCIvY2hhbmdlTmFtZVwiICsgXCI/b2xkTmFtZT1cIiArIGl0ZW0ubmFtZSArIFwiJm5ld05hbWU9XCIgKyB2YWx1ZSlcbiAgICAvLyAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAvLyAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICAvLyAgIH0pXG4gICAgLy8gICAudGhlbihpdGVtcyA9PiB7XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKFwiL2dhbGxlcnlcIiwgaXRlbXMpO1xuICAgIC8vICAgICB0aGlzLnNldFN0YXRlKHsgZ2FsbGVyeUl0ZW1zOiBpdGVtcyB9KTtcbiAgICAvLyAgIH0pXG4gICAgLy8gICAuY2F0Y2goZSA9PiB7fSk7XG4gIH07XG5cbiAgYXN5bmMgZGVsZXRlVmlkZW8oaXRlbSkge1xuICAgIGNvbnNvbGUubG9nKFwiZGVsZXRlXCIsIHsgaXRlbSB9KTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgRGF0YWJhc2UuZGVsZXRlTWVkaWEoaXRlbS5vYmplY3RJZCk7XG4gICAgICBhbGVydChcIlN1Y2Nlc3NmdWxseSBkZWxldGVkIE1lZGlhOiBcIiArIGl0ZW0udGl0bGUpO1xuICAgICAgdGhpcy51cGRhdGVWaWRlb0xpc3QoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBhbGVydChcIkZhaWxlZCB0byBkZWxldGUgbWVkaWE6IFwiICsgZS5tZXNzYWdlKTtcbiAgICB9XG5cbiAgICAvLyBmZXRjaChDb25zdGFudHMuU0VSVkVSX1VSTCArIFwiL2RlbGV0ZVZpZGVvXCIgKyBcIj9uYW1lPVwiICsgaXRlbS5uYW1lKVxuICAgIC8vICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgIC8vICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgIC8vICAgfSlcbiAgICAvLyAgIC50aGVuKGl0ZW1zID0+IHtcbiAgICAvLyAgICAgY29uc29sZS5sb2coXCIvZ2FsbGVyeVwiLCBpdGVtcyk7XG4gICAgLy8gICAgIHRoaXMuc2V0U3RhdGUoeyBnYWxsZXJ5SXRlbXM6IGl0ZW1zIH0pO1xuICAgIC8vICAgfSlcbiAgICAvLyAgIC5jYXRjaChlID0+IHt9KTtcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxWaWV3XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcIndoaXRlXCIsXG4gICAgICAgICAgZmxleDogMSxcbiAgICAgICAgICB3aWR0aDogXCIxMDAlXCIsXG4gICAgICAgICAgcGFkZGluZzogNSxcbiAgICAgICAgICBib3JkZXJSYWRpdXM6IDVcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPFZpZXdcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgZmxleERpcmVjdGlvbjogXCJyb3dcIixcbiAgICAgICAgICAgIHdpZHRoOiBcIjEwMCVcIixcbiAgICAgICAgICAgIGZsZXg6IDEsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwibGlnaHRncmF5XCIsXG4gICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXG4gICAgICAgICAgICBtYXJnaW5Cb3R0b206IDEwLFxuICAgICAgICAgICAgcGFkZGluZzogNVxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8VGV4dFxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgY29sb3I6IFwiYmxhY2tcIixcbiAgICAgICAgICAgICAgaGVpZ2h0OiA0MCxcbiAgICAgICAgICAgICAgZm9udFdlaWdodDogXCJib2xkXCIsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAyMCxcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICAgICAgICBwYWRkaW5nVG9wOiAxMFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7YEdhbGxlcnlgLnRvVXBwZXJDYXNlKCl9XG4gICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgIDxWaWV3IHN0eWxlPXt7IG1hcmdpbjogNSB9fT5cbiAgICAgICAgICAgIDxCdXR0b24gdGl0bGU9XCJDbG9zZVwiIG9uUHJlc3M9e3RoaXMucHJvcHMuY2xvc2VNb2RhbH0gLz5cbiAgICAgICAgICA8L1ZpZXc+XG4gICAgICAgIDwvVmlldz5cblxuICAgICAgICA8U2Nyb2xsVmlldyBzdHlsZT17eyBoZWlnaHQ6IDUwMCwgYmFja2dyb3VuZENvbG9yOiBcIiNGQUZBRkFcIiB9fT5cbiAgICAgICAgICA8VmlldyAvPlxuXG4gICAgICAgICAgPFZpZXdcbiAgICAgICAgICAgIGJvcmRlcldpZHRoPVwiMTBcIlxuICAgICAgICAgICAgYm9yZGVyQ29sb3I9XCJyZWRcIlxuICAgICAgICAgICAgYm9yZGVyVG9wXG4gICAgICAgICAgICBib3JkZXJSaWdodFxuICAgICAgICAgICAgcGFkZGluZz1cIjEwXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8Vmlld1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGZsZXg6IDEsXG4gICAgICAgICAgICAgICAgZmxleFdyYXA6IFwid3JhcFwiLFxuICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246IFwicm93XCIsXG4gICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwiZmxleC1zdGFydFwiXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHt0aGlzLnN0YXRlLmxvYWRpbmcgPyAoXG4gICAgICAgICAgICAgICAgPFRleHRcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGZsZXg6IDEsXG4gICAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxuICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgICAgICAgICAgICAgIGFsaWduQ29udGVudDogXCJjZW50ZXJcIlxuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICBMb2FkaW5nIEdhbGxlcnkgLi4uIHBsZWFzZSB3YWl0Li4uXG4gICAgICAgICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICAgICAge3RoaXMuc3RhdGUuZ2FsbGVyeUl0ZW1zLmxlbmd0aCA+IDAgPyAoXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5nYWxsZXJ5SXRlbXMubWFwKChrLCBpKSA9PiAoXG4gICAgICAgICAgICAgICAgICA8Vmlld1xuICAgICAgICAgICAgICAgICAgICBrZXk9e2l9XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtblxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxNTAsXG4gICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcImxpZ2h0Z3JleVwiLFxuICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogMTAsXG4gICAgICAgICAgICAgICAgICAgICAgbWFyZ2luUmlnaHQ6IDEwLFxuICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IDVcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb3BzLm9uU2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLm9uU2VsZWN0KHRoaXMuc3RhdGUuZ2FsbGVyeUl0ZW1zW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxWaWV3IGZsZXg9XCI1XCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICAgICAgICAgICAgc3JjPXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgay52aWRlb190aHVtYm5haWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGsudmlkZW9fdGh1bWJuYWlsLnVybFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJcIiAvKkNvbnN0YW50cy5TRVJWRVJfVVJMICsgXCIvdXBsb2FkLz9maWxlbmFtZT1cIiArIGsudGh1bWJuYWlsKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoPVwiMTQwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodD1cIjEwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPC9WaWV3PlxuICAgICAgICAgICAgICAgICAgICA8Vmlld1xuICAgICAgICAgICAgICAgICAgICAgIGZsZXg9XCIxXCJcbiAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcIndoaXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTAsXG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JkV3JhcDogXCJicmVhay13b3JkXCJcbiAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgPGI+VHlwZSAtIFNpemU6ICZuYnNwOyAmbmJzcDsgPC9iPlxuICAgICAgICAgICAgICAgICAgICAgIDxUZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAge2sudHlwZX0gLSB7ay52aWRlb19zaXplfVxuICAgICAgICAgICAgICAgICAgICAgIDwvVGV4dD5cbiAgICAgICAgICAgICAgICAgICAgPC9WaWV3PlxuICAgICAgICAgICAgICAgICAgICA8Vmlld1xuICAgICAgICAgICAgICAgICAgICAgIGZsZXg9XCIyXCJcbiAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcIndoaXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTAsXG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JkV3JhcDogXCJicmVhay13b3JkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogXCIxMDAlXCJcbiAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgPGI+RmlsZW5hbWU6ICZuYnNwOyAmbmJzcDsgPC9iPlxuICAgICAgICAgICAgICAgICAgICAgIDxJbmxpbmVFZGl0XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVDbGFzc05hbWU9XCJlZGl0aW5nXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ9e2sudGl0bGV9XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbU5hbWU9XCJtZXNzYWdlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uU2VsZWN0PXsoKSA9PiB7fX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZT17ZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlTmFtZShrLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiZ3JheVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCJ3aGl0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBtaW5XaWR0aDogMTUwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcImlubGluZS1ibG9ja1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW46IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IDEwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG91dGxpbmU6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogMFxuICAgICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8L1ZpZXc+XG4gICAgICAgICAgICAgICAgICAgIDxWaWV3XG4gICAgICAgICAgICAgICAgICAgICAgZmxleD1cIjFcIlxuICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFwid2hpdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmRXcmFwOiBcImJyZWFrLXdvcmRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBcIjEwMCVcIlxuICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIkRlbGV0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcj1cInJlZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBsZWZ0OiAyMCB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgb25QcmVzcz17KCkgPT4gdGhpcy5kZWxldGVWaWRlbyhrKX1cbiAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8L1ZpZXc+XG4gICAgICAgICAgICAgICAgICA8L1ZpZXc+XG4gICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICA8VGV4dD5cbiAgICAgICAgICAgICAgICAgIFNvcnJ5IHRoZXJlIGFyZSBubyBpdGVtcyBpbiB5b3VyIGdhbGxlcnksIGFkZCBzb21lIGJlbG93XG4gICAgICAgICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9WaWV3PlxuICAgICAgICAgIDwvVmlldz5cbiAgICAgICAgPC9TY3JvbGxWaWV3PlxuICAgICAgICA8Vmlld1xuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBtYXJnaW46IDUsXG4gICAgICAgICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgZ3JheVwiLFxuICAgICAgICAgICAgcGFkZGluZzogNSxcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogXCJsaWdodGdyYXlcIlxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8RHJvcHpvbmVDb21wb25lbnRcbiAgICAgICAgICAgIGRqc0NvbmZpZz17e1xuICAgICAgICAgICAgICBhdXRvUHJvY2Vzc1F1ZXVlOiBmYWxzZSxcbiAgICAgICAgICAgICAgcHJldmlld1RlbXBsYXRlOiBSZWFjdERPTVNlcnZlci5yZW5kZXJUb1N0YXRpY01hcmt1cCg8ZGl2IC8+KVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIGNvbmZpZz17Y29tcG9uZW50Q29uZmlnfVxuICAgICAgICAgICAgZXZlbnRIYW5kbGVycz17dGhpcy5ldmVudEhhbmRsZXJzfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvVmlldz5cbiAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIHRpdGxlPVwiQ2xvc2VcIlxuICAgICAgICAgIG9uUHJlc3M9e3RoaXMucHJvcHMuY2xvc2VNb2RhbH1cbiAgICAgICAgICBzdHlsZT17eyBtYXJnaW46IDUgfX1cbiAgICAgICAgLz5cbiAgICAgIDwvVmlldz5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbGxlcnk7XG4iXX0=