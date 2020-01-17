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
const TimeScale_1 = require("./TimeScale");
const Modal = require("react-modal");
const Player_1 = require("./Player");
const Gallery_1 = require("./Gallery");
const Settings_1 = require("./Settings");
const semantic_ui_react_1 = require("semantic-ui-react");
const Database_1 = require("../Database");
class Scheduler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playerOpen: false,
            groups: [
                {
                    key: "Aisha Williamson",
                    text: "Aisha Williamson",
                    value: "aisha_williamson"
                }
            ]
        };
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.openGalleryModal = this.openGalleryModal.bind(this);
        this.openSettingsModal = this.openSettingsModal.bind(this);
    }
    componentDidMount() {
        this.refreshGroups();
    }
    refreshGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            var groups = yield Database_1.Database.getGroups();
            this.setState({
                groups: groups.map(k => k.toJSON()).map(k => ({
                    key: k.objectId,
                    text: k.name,
                    value: k.objectId
                }))
            });
        });
    }
    closeModal() {
        this.setState({
            playerOpen: false,
            galleryOpen: false,
            settingsOpen: false
        });
    }
    openModal() {
        this.setState({ playerOpen: true });
    }
    openGalleryModal() {
        this.setState({ galleryOpen: true });
    }
    openSettingsModal() {
        this.setState({ settingsOpen: true });
    }
    render() {
        const { groups } = this.state;
        return (React.createElement("div", null,
            React.createElement(Modal, { style: modalStyle, isOpen: this.state.playerOpen, onRequestClose: this.closeModal },
                React.createElement(Player_1.default, { parent: this, closeModal: this.closeModal })),
            React.createElement(Modal, { style: modalStyle, isOpen: this.state.galleryOpen, onRequestClose: this.closeModal },
                React.createElement(Gallery_1.default, { parent: this, closeModal: this.closeModal })),
            React.createElement(Modal, { style: modalStyle, isOpen: this.state.settingsOpen, onRequestClose: this.closeModal },
                React.createElement(Settings_1.default, { parent: this, closeModal: this.closeModal })),
            React.createElement("div", { className: "container-fluid" },
                React.createElement("div", { className: "row" },
                    React.createElement("div", { className: "col-lg-12" },
                        React.createElement("b", { style: { margin: 5 } }, "Scheduler"),
                        React.createElement("b", null,
                            React.createElement("button", { className: "btn btn-primary btn-large", style: { margin: 5 }, onClick: this.openModal }, "Open Player")),
                        React.createElement("b", null,
                            React.createElement("button", { className: "btn btn-primary btn-large", style: { margin: 5 }, onClick: this.openGalleryModal }, "Gallery")),
                        React.createElement("b", null,
                            React.createElement("button", { className: "btn btn-primary btn-large", style: { margin: 5 }, onClick: this.openSettingsModal }, "Settings")),
                        React.createElement(semantic_ui_react_1.Segment, { basic: true },
                            React.createElement(semantic_ui_react_1.Form, null,
                                React.createElement(semantic_ui_react_1.Form.Field, null,
                                    React.createElement("label", null, "Current Group"),
                                    React.createElement(semantic_ui_react_1.Dropdown, { placeholder: "Select Group", fluid: true, selection: true, onChange: (e, data) => {
                                            console.log({ data });
                                            this.setState({ selectedGroup: data.value });
                                        }, options: groups })))),
                        React.createElement(TimeScale_1.default, { selectedGroup: this.state.selectedGroup }))))));
    }
}
exports.Scheduler = Scheduler;
var modalStyle = {
    overlay: {
        zIndex: 0,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
        // backgroundColor: "rgba(15, 15, 15, 0.75)"
    },
    content: {
        zIndex: -5,
        position: "absolute",
        top: "10px",
        left: "10px",
        right: "10px",
        bottom: "10px",
        border: "1px solid #ccc",
        // backgroundColor: "rgba(15, 15, 15, 0.95)",
        backgroundColor: "#EFEFEF",
        overflow: "auto",
        WebkitOverflowScrolling: "touch",
        borderRadius: "4px",
        outline: "none",
        padding: "20px"
    }
};
exports.default = Scheduler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2NoZWR1bGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiU2NoZWR1bGVyLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsK0JBQStCO0FBRy9CLDJDQUFvQztBQUNwQyxxQ0FBcUM7QUFDckMscUNBQThCO0FBQzlCLHVDQUFnQztBQUNoQyx5Q0FBa0M7QUFDbEMseURBQTREO0FBQzVELDBDQUF1QztBQUV2QyxlQUF1QixTQUFRLEtBQUssQ0FBQyxTQUFtQjtJQUN0RCxZQUFZLEtBQUs7UUFDZixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFNZixVQUFLLEdBQUc7WUFDTixVQUFVLEVBQUUsS0FBSztZQUNqQixNQUFNLEVBQUU7Z0JBQ047b0JBQ0UsR0FBRyxFQUFFLGtCQUFrQjtvQkFDdkIsSUFBSSxFQUFFLGtCQUFrQjtvQkFDeEIsS0FBSyxFQUFFLGtCQUFrQjtpQkFDMUI7YUFDRjtTQUNGLENBQUM7UUFkQSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQVlELGlCQUFpQjtRQUNmLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBQ0ssYUFBYTs7WUFDakIsSUFBSSxNQUFNLEdBQUcsTUFBTSxtQkFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3hDLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQ1osTUFBTSxF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RUFBRSxNQUFNO1FBQ2YsT0FBTyxFQUFFLE1BQU07S0FDaEI7Q0FDRixDQUFDO0FBRUYsa0JBQWUsU0FBUyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IFBhZ2VIZWFkZXIgfSBmcm9tIFwicmVhY3QtYm9vdHN0cmFwXCI7XG5pbXBvcnQgVGltZVNjYWxlIGZyb20gXCIuL1RpbWVTY2FsZVwiO1xuaW1wb3J0ICogYXMgTW9kYWwgZnJvbSBcInJlYWN0LW1vZGFsXCI7XG5pbXBvcnQgUGxheWVyIGZyb20gXCIuL1BsYXllclwiO1xuaW1wb3J0IEdhbGxlcnkgZnJvbSBcIi4vR2FsbGVyeVwiO1xuaW1wb3J0IFNldHRpbmdzIGZyb20gXCIuL1NldHRpbmdzXCI7XG5pbXBvcnQgeyBEcm9wZG93biwgRm9ybSwgU2VnbWVudCB9IGZyb20gXCJzZW1hbnRpYy11aS1yZWFjdFwiO1xuaW1wb3J0IHsgRGF0YWJhc2UgfSBmcm9tIFwiLi4vRGF0YWJhc2VcIjtcblxuZXhwb3J0IGNsYXNzIFNjaGVkdWxlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4ge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmNsb3NlTW9kYWwgPSB0aGlzLmNsb3NlTW9kYWwuYmluZCh0aGlzKTtcbiAgICB0aGlzLm9wZW5Nb2RhbCA9IHRoaXMub3Blbk1vZGFsLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vcGVuR2FsbGVyeU1vZGFsID0gdGhpcy5vcGVuR2FsbGVyeU1vZGFsLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vcGVuU2V0dGluZ3NNb2RhbCA9IHRoaXMub3BlblNldHRpbmdzTW9kYWwuYmluZCh0aGlzKTtcbiAgfVxuICBzdGF0ZSA9IHtcbiAgICBwbGF5ZXJPcGVuOiBmYWxzZSxcbiAgICBncm91cHM6IFtcbiAgICAgIHtcbiAgICAgICAga2V5OiBcIkFpc2hhIFdpbGxpYW1zb25cIixcbiAgICAgICAgdGV4dDogXCJBaXNoYSBXaWxsaWFtc29uXCIsXG4gICAgICAgIHZhbHVlOiBcImFpc2hhX3dpbGxpYW1zb25cIlxuICAgICAgfVxuICAgIF1cbiAgfTtcblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnJlZnJlc2hHcm91cHMoKTtcbiAgfVxuICBhc3luYyByZWZyZXNoR3JvdXBzKCkge1xuICAgIHZhciBncm91cHMgPSBhd2FpdCBEYXRhYmFzZS5nZXRHcm91cHMoKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGdyb3VwczogZ3JvdXBzLm1hcChrID0+IGsudG9KU09OKCkpLm1hcChrID0+ICh7XG4gICAgICAgIGtleTogay5vYmplY3RJZCxcbiAgICAgICAgdGV4dDogay5uYW1lLFxuICAgICAgICB2YWx1ZTogay5vYmplY3RJZFxuICAgICAgfSkpXG4gICAgfSk7XG4gIH1cblxuICBjbG9zZU1vZGFsKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcGxheWVyT3BlbjogZmFsc2UsXG4gICAgICBnYWxsZXJ5T3BlbjogZmFsc2UsXG4gICAgICBzZXR0aW5nc09wZW46IGZhbHNlXG4gICAgfSk7XG4gIH1cblxuICBvcGVuTW9kYWwoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHBsYXllck9wZW46IHRydWUgfSk7XG4gIH1cblxuICBvcGVuR2FsbGVyeU1vZGFsKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBnYWxsZXJ5T3BlbjogdHJ1ZSB9KTtcbiAgfVxuXG4gIG9wZW5TZXR0aW5nc01vZGFsKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzZXR0aW5nc09wZW46IHRydWUgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBncm91cHMgfSA9IHRoaXMuc3RhdGU7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxNb2RhbFxuICAgICAgICAgIHN0eWxlPXttb2RhbFN0eWxlfVxuICAgICAgICAgIGlzT3Blbj17dGhpcy5zdGF0ZS5wbGF5ZXJPcGVufVxuICAgICAgICAgIG9uUmVxdWVzdENsb3NlPXt0aGlzLmNsb3NlTW9kYWx9XG4gICAgICAgID5cbiAgICAgICAgICA8UGxheWVyIHBhcmVudD17dGhpc30gY2xvc2VNb2RhbD17dGhpcy5jbG9zZU1vZGFsfSAvPlxuICAgICAgICA8L01vZGFsPlxuICAgICAgICA8TW9kYWxcbiAgICAgICAgICBzdHlsZT17bW9kYWxTdHlsZX1cbiAgICAgICAgICBpc09wZW49e3RoaXMuc3RhdGUuZ2FsbGVyeU9wZW59XG4gICAgICAgICAgb25SZXF1ZXN0Q2xvc2U9e3RoaXMuY2xvc2VNb2RhbH1cbiAgICAgICAgPlxuICAgICAgICAgIDxHYWxsZXJ5IHBhcmVudD17dGhpc30gY2xvc2VNb2RhbD17dGhpcy5jbG9zZU1vZGFsfSAvPlxuICAgICAgICA8L01vZGFsPlxuICAgICAgICA8TW9kYWxcbiAgICAgICAgICBzdHlsZT17bW9kYWxTdHlsZX1cbiAgICAgICAgICBpc09wZW49e3RoaXMuc3RhdGUuc2V0dGluZ3NPcGVufVxuICAgICAgICAgIG9uUmVxdWVzdENsb3NlPXt0aGlzLmNsb3NlTW9kYWx9XG4gICAgICAgID5cbiAgICAgICAgICA8U2V0dGluZ3MgcGFyZW50PXt0aGlzfSBjbG9zZU1vZGFsPXt0aGlzLmNsb3NlTW9kYWx9IC8+XG4gICAgICAgIDwvTW9kYWw+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyLWZsdWlkXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTEyXCI+XG4gICAgICAgICAgICAgIDxiIHN0eWxlPXt7IG1hcmdpbjogNSB9fT5TY2hlZHVsZXI8L2I+XG4gICAgICAgICAgICAgIDxiPlxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeSBidG4tbGFyZ2VcIlxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgbWFyZ2luOiA1IH19XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLm9wZW5Nb2RhbH1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICBPcGVuIFBsYXllclxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2I+XG4gICAgICAgICAgICAgIDxiPlxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeSBidG4tbGFyZ2VcIlxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgbWFyZ2luOiA1IH19XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLm9wZW5HYWxsZXJ5TW9kYWx9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgR2FsbGVyeVxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2I+XG4gICAgICAgICAgICAgIDxiPlxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeSBidG4tbGFyZ2VcIlxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgbWFyZ2luOiA1IH19XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLm9wZW5TZXR0aW5nc01vZGFsfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIFNldHRpbmdzXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvYj5cbiAgICAgICAgICAgICAgPFNlZ21lbnQgYmFzaWM+XG4gICAgICAgICAgICAgICAgPEZvcm0+XG4gICAgICAgICAgICAgICAgICA8Rm9ybS5GaWVsZD5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsPkN1cnJlbnQgR3JvdXA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8RHJvcGRvd25cbiAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlbGVjdCBHcm91cFwiXG4gICAgICAgICAgICAgICAgICAgICAgZmx1aWRcbiAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUsIGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHsgZGF0YSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzZWxlY3RlZEdyb3VwOiBkYXRhLnZhbHVlIH0pO1xuICAgICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucz17Z3JvdXBzfVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPC9Gb3JtLkZpZWxkPlxuICAgICAgICAgICAgICAgIDwvRm9ybT5cbiAgICAgICAgICAgICAgPC9TZWdtZW50PlxuICAgICAgICAgICAgICA8VGltZVNjYWxlIHNlbGVjdGVkR3JvdXA9e3RoaXMuc3RhdGUuc2VsZWN0ZWRHcm91cH0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxudmFyIG1vZGFsU3R5bGUgPSB7XG4gIG92ZXJsYXk6IHtcbiAgICB6SW5kZXg6IDAsXG4gICAgcG9zaXRpb246IFwiZml4ZWRcIixcbiAgICB0b3A6IDAsXG4gICAgbGVmdDogMCxcbiAgICByaWdodDogMCxcbiAgICBib3R0b206IDBcbiAgICAvLyBiYWNrZ3JvdW5kQ29sb3I6IFwicmdiYSgxNSwgMTUsIDE1LCAwLjc1KVwiXG4gIH0sXG4gIGNvbnRlbnQ6IHtcbiAgICB6SW5kZXg6IC01LFxuICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG4gICAgdG9wOiBcIjEwcHhcIixcbiAgICBsZWZ0OiBcIjEwcHhcIixcbiAgICByaWdodDogXCIxMHB4XCIsXG4gICAgYm90dG9tOiBcIjEwcHhcIixcbiAgICBib3JkZXI6IFwiMXB4IHNvbGlkICNjY2NcIixcbiAgICAvLyBiYWNrZ3JvdW5kQ29sb3I6IFwicmdiYSgxNSwgMTUsIDE1LCAwLjk1KVwiLFxuICAgIGJhY2tncm91bmRDb2xvcjogXCIjRUZFRkVGXCIsXG4gICAgb3ZlcmZsb3c6IFwiYXV0b1wiLFxuICAgIFdlYmtpdE92ZXJmbG93U2Nyb2xsaW5nOiBcInRvdWNoXCIsXG4gICAgYm9yZGVyUmFkaXVzOiBcIjRweFwiLFxuICAgIG91dGxpbmU6IFwibm9uZVwiLFxuICAgIHBhZGRpbmc6IFwiMjBweFwiXG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFNjaGVkdWxlcjtcbiJdfQ==