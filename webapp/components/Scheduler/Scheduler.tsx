import * as React from "react";
import { Component } from "react";
import { PageHeader } from "react-bootstrap";
import TimeScale from "./TimeScale";
import * as Modal from "react-modal";
import Player from "./Player";
import Gallery from "./Gallery";
import Settings from "./Settings";
import { Dropdown, Form, Segment } from "semantic-ui-react";
import { Database } from "../Database";

export class Scheduler extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.openGalleryModal = this.openGalleryModal.bind(this);
    this.openSettingsModal = this.openSettingsModal.bind(this);
  }
  state = {
    playerOpen: false,
    groups: [
      {
        key: "Aisha Williamson",
        text: "Aisha Williamson",
        value: "aisha_williamson"
      }
    ]
  };

  componentDidMount() {
    this.refreshGroups();
  }
  async refreshGroups() {
    var groups = await Database.getGroups();
    this.setState({
      groups: groups.map(k => k.toJSON()).map(k => ({
        key: k.objectId,
        text: k.name,
        value: k.objectId
      }))
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
    return (
      <div>
        <Modal
          style={modalStyle}
          isOpen={this.state.playerOpen}
          onRequestClose={this.closeModal}
        >
          <Player parent={this} closeModal={this.closeModal} />
        </Modal>
        <Modal
          style={modalStyle}
          isOpen={this.state.galleryOpen}
          onRequestClose={this.closeModal}
        >
          <Gallery parent={this} closeModal={this.closeModal} />
        </Modal>
        <Modal
          style={modalStyle}
          isOpen={this.state.settingsOpen}
          onRequestClose={this.closeModal}
        >
          <Settings parent={this} closeModal={this.closeModal} />
        </Modal>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <b style={{ margin: 5 }}>Scheduler</b>
              <b>
                <button
                  className="btn btn-primary btn-large"
                  style={{ margin: 5 }}
                  onClick={this.openModal}
                >
                  Open Player
                </button>
              </b>
              <b>
                <button
                  className="btn btn-primary btn-large"
                  style={{ margin: 5 }}
                  onClick={this.openGalleryModal}
                >
                  Gallery
                </button>
              </b>
              <b>
                <button
                  className="btn btn-primary btn-large"
                  style={{ margin: 5 }}
                  onClick={this.openSettingsModal}
                >
                  Settings
                </button>
              </b>
              <Segment basic>
                <Form>
                  <Form.Field>
                    <label>Current Group</label>
                    <Dropdown
                      placeholder="Select Group"
                      fluid
                      selection
                      onChange={(e, data) => {
                        console.log({ data });
                        this.setState({ selectedGroup: data.value });
                      }}
                      options={groups}
                    />
                  </Form.Field>
                </Form>
              </Segment>
              <TimeScale selectedGroup={this.state.selectedGroup} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

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

export default Scheduler;
